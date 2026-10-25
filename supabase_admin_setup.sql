-- ============================================================================
-- RELATIONSPILOTEN: SÄKER ADMIN- & MODERERINGSMOTOR (SUPABASE SQL)
-- Ersätter krånglig Cloudflare Zero Trust med kryptografisk kontroll (pgcrypto)
-- direkt inne i databasen via SECURITY DEFINER RPC-funktioner.
--
-- INSTRUKTION:
-- 1. Byt ut 'BYT_TILL_DITT_HEMLIGA_ADMIN_LOSENORD' nedan mot ditt eget lösenord!
-- 2. Klistra in hela detta skript i Supabase -> SQL Editor -> klicka "Run".
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Lägg till kolumnen 'forsok_data' på tabellen 'profiler' så att räknarna
--    kan överleva och fjärr-nollställas av dig som Admin.
ALTER TABLE public.profiler
ADD COLUMN IF NOT EXISTS forsok_data jsonb DEFAULT '{}'::jsonb;

-- 2. Skapa en privat tabell för ditt krypterade Admin-lösenord (helt låst för RLS)
CREATE TABLE IF NOT EXISTS public.admin_konfig (
  id int PRIMARY KEY DEFAULT 1,
  secret_hash text NOT NULL
);

ALTER TABLE public.admin_konfig ENABLE ROW LEVEL SECURITY;
-- Ingen publik policy läggs till -> ingen vanlig användare kan någonsin läsa tabellen!

-- Spara ditt admin-lösenord som en bcrypt-hash (ÄNDRA LÖSENORDET NEDAN INNAN DU KÖR!):
INSERT INTO public.admin_konfig (id, secret_hash)
VALUES (1, crypt('BYT_TILL_DITT_HEMLIGA_ADMIN_LOSENORD', gen_salt('bf')))
ON CONFLICT (id) DO UPDATE
SET secret_hash = EXCLUDED.secret_hash;

-- Intern hjälpfunktion som validerar admin-lösenordet på serversidan
CREATE OR REPLACE FUNCTION public.verifiera_admin_nyckel(p_secret text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash text;
BEGIN
  SELECT secret_hash INTO v_hash FROM public.admin_konfig WHERE id = 1;
  IF v_hash IS NULL OR p_secret IS NULL OR p_secret = '' THEN
    RETURN false;
  END IF;
  RETURN (crypt(p_secret, v_hash) = v_hash);
END;
$$;

-- 3. RPC: Hämta komplett Admin-översikt (Statistik, Medlemmar, Försöksräknare & Flaggade chattar)
CREATE OR REPLACE FUNCTION public.admin_oversikt(p_secret text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_members jsonb;
  v_matches jsonb;
  v_flagged jsonb;
  v_total_msgs bigint;
BEGIN
  IF NOT public.verifiera_admin_nyckel(p_secret) THEN
    RAISE EXCEPTION 'Ogiltig Master Admin-nyckel.';
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(m)), '[]'::jsonb) INTO v_members
  FROM (
    SELECT
      p.user_id,
      COALESCE(split_part(u.email, '@', 1), 'Medlem') AS alias,
      u.email,
      p.frivilligt_kon,
      p.godkand_for_matchning,
      p.profil_text,
      COALESCE(p.forsok_data, '{}'::jsonb) AS forsok_data
    FROM public.profiler p
    LEFT JOIN auth.users u ON u.id = p.user_id
    ORDER BY u.created_at DESC NULLS LAST
  ) m;

  SELECT COALESCE(jsonb_agg(row_to_json(mt)), '[]'::jsonb) INTO v_matches
  FROM (
    SELECT id, user_a, user_b, alias_a, alias_b, kompatibilitet
    FROM public.matchningar
  ) mt;

  SELECT COALESCE(jsonb_agg(row_to_json(fl)), '[]'::jsonb) INTO v_flagged
  FROM (
    SELECT id, match_id, sender_id, sender_alias, receiver_id, meddelande_text, created_at
    FROM public.match_meddelanden
    WHERE anmalt = true
    ORDER BY created_at DESC
  ) fl;

  SELECT COUNT(*) INTO v_total_msgs FROM public.match_meddelanden;

  RETURN jsonb_build_object(
    'members', v_members,
    'matches', v_matches,
    'flagged_messages', v_flagged,
    'total_messages_count', v_total_msgs
  );
END;
$$;

-- 4. RPC: Fjärr-nollställ en medlems försöksräknare (vid urladdat batteri / barnskrik)
CREATE OR REPLACE FUNCTION public.admin_nollstall_forsok(
  p_secret text,
  p_target_user uuid,
  p_module text DEFAULT 'ALL'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_curr jsonb;
  v_ts bigint;
BEGIN
  IF NOT public.verifiera_admin_nyckel(p_secret) THEN
    RAISE EXCEPTION 'Ogiltig Master Admin-nyckel.';
  END IF;

  v_ts := (extract(epoch from now()) * 1000)::bigint;

  IF p_module = 'ALL' THEN
    v_curr := jsonb_build_object('admin_reset_ts', v_ts);
  ELSE
    SELECT COALESCE(forsok_data, '{}'::jsonb) INTO v_curr
    FROM public.profiler
    WHERE user_id = p_target_user;

    v_curr := jsonb_set(COALESCE(v_curr, '{}'::jsonb), ARRAY[p_module], '0'::jsonb, true);
    v_curr := jsonb_set(v_curr, ARRAY['admin_reset_ts'], to_jsonb(v_ts), true);
  END IF;

  UPDATE public.profiler
  SET forsok_data = v_curr
  WHERE user_id = p_target_user;
END;
$$;

-- 5. RPC: Hantera flaggat chattmeddelande (Radera meddelande eller frikänn)
CREATE OR REPLACE FUNCTION public.admin_hantera_flaggat_meddelande(
  p_secret text,
  p_msg_id uuid,
  p_radera boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.verifiera_admin_nyckel(p_secret) THEN
    RAISE EXCEPTION 'Ogiltig Master Admin-nyckel.';
  END IF;

  IF p_radera THEN
    DELETE FROM public.match_meddelanden WHERE id = p_msg_id;
  ELSE
    UPDATE public.match_meddelanden SET anmalt = false WHERE id = p_msg_id;
  END IF;
END;
$$;

-- 6. RPC: Stäng av & radera regelbrytare permanent (Chattar, Matchningar, Profil + Auth-konto)
CREATE OR REPLACE FUNCTION public.admin_radera_medlem(
  p_secret text,
  p_target_user uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.verifiera_admin_nyckel(p_secret) THEN
    RAISE EXCEPTION 'Ogiltig Master Admin-nyckel.';
  END IF;

  DELETE FROM public.match_meddelanden WHERE sender_id = p_target_user OR receiver_id = p_target_user;
  DELETE FROM public.matchningar WHERE user_a = p_target_user OR user_b = p_target_user;
  DELETE FROM public.profiler WHERE user_id = p_target_user;
  DELETE FROM auth.users WHERE id = p_target_user;
END;
$$;


-- ============================================================================
-- 7. SOMATISK & TAKTIL PROJEKTION + DJÄVULSTEST (BUCKET 'stimuli' + TABELL)
-- ============================================================================

-- Skapa publik bucket 'stimuli' för alla 88 testbilder (ba1-ba4, b01-b64, ta1-ta4, h1-h8, f1-f8)
INSERT INTO storage.buckets (id, name, public)
VALUES ('stimuli', 'stimuli', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access to Stimuli Images" ON storage.objects;
CREATE POLICY "Public Access to Stimuli Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'stimuli');

-- GDPR-säker tabell för de 3 separerade vektorlagren (Kroppsmatris, Hand/Fot & Off-Guard Profilskärpa)
CREATE TABLE IF NOT EXISTS public.argon_somatic_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_code TEXT NOT NULL,
    test_mode TEXT DEFAULT 'quick_all',
    body_synthesis JSONB NOT NULL DEFAULT '{}'::jsonb,
    tactile_synthesis JSONB NOT NULL DEFAULT '{}'::jsonb,
    psychoacoustic_crm_synthesis JSONB DEFAULT '{}'::jsonb,
    clarity_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    mood_symbol_compass JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.argon_somatic_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert of somatic profiles" ON public.argon_somatic_profiles;
CREATE POLICY "Allow anonymous insert of somatic profiles"
ON public.argon_somatic_profiles FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading profiles by session_code" ON public.argon_somatic_profiles;
CREATE POLICY "Allow reading profiles by session_code"
ON public.argon_somatic_profiles FOR SELECT
TO anon, authenticated
USING (true);

ALTER TABLE public.argon_somatic_profiles ADD COLUMN IF NOT EXISTS psychoacoustic_crm_synthesis JSONB DEFAULT '{}'::jsonb;
