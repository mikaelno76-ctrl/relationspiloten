# Relationspiloten

Beteendebaserad relationsmatchning via djupgående samarbetsrollspel, 360° vektorkompass och röst-till-bild-projektion.

## 📂 Projektstruktur (GitHub & Cloudflare Pages)

```text
├── index.html                  # Ren, överskådlig huvudfil som laddar CSS, vyer och JS-moduler
├── css/
│   └── styles.css              # All design, färgteman, kortlayout och 360°-kompassens animationer
├── views/                      # Uppdelade HTML-vyer (en fil per sida/delmoment)
│   ├── auth.html               # 1. Inloggning, registrering & GDPR
│   ├── interests.html          # 1.5. Scenariobyggare (Värld, epok, språk & intressen)
│   ├── hub.html                # 2. Matchningshubben, Topp 3-matchningar, chatt & extratester
│   ├── game.html               # 3. Rollspelsmotorn, efterreflektion & Argon-analysvy
│   ├── swipe-lab.html          # 4. 360° Vektorswipe, tvingad gallring & självbildsval
│   ├── somatic-lab.html        # 4.5. Somatisk & Taktil 2-stegs Radialprojektion + Off-Guard Djävulstest
│   ├── labs.html               # 5. Fristående snabbtester (?test=taxi och ?test=voice)
│   ├── admin.html              # 6. Krypterad Admin- & Modereringscentral (?admin=1)
│   └── modals.html             # 7. Frågor & svar (med Grok-filter + dold kontakt) & Gult kort
├── js/                         # Uppdelade JavaScript-moduler efter ansvarsområde
│   ├── config.js               # Globala konstanter, modeller och världsbyggar-menyer
│   ├── api.js                  # Kommunikation med Supabase & Cloudflare Worker (Gemini)
│   ├── auth.js                 # Konto, inloggning, försöksräknare & Art. 17-radering
│   ├── roleplay.js             # Spelledarmotor (Flash 3.1 Lite), Argon-analys & modulstämpel
│   ├── matching-chat.js        # Matchning, seriositetsbrickor, puffar, Grok-isbrytare & chatt
│   ├── multimodal-tests.js     # Röst -> AI-målning -> Tolkning, 3 vardagsbilder & minnesfråga
│   ├── swipe-lab.js            # Tvåspråkigt stöd (SV/EN) & 360° Vektorswipe-motor
│   ├── somatic-lab.js          # Somatisk kroppsmatris (64), Händer/Fötter (16) & Off-Guard Profilskärpa
│   ├── standalone-labs.js      # Logik för fristående baksätes-/QR-kodstester utan lagring
│   ├── argon-queue.js          # Strikt Argon 4.0 bakgrundskö (provar var 10:e minut)
│   ├── admin.js                # Adminpanelens RPC-anrop, statistik, avstängning & nollställning
│   └── main.js                 # Dynamisk inläsning av views/*.html & event-kopplingar vid start
└── sql/
    └── supabase_admin_setup.sql # SQL-skript för Supabase SQL Editor (Admin-RPC & krypterad nyckel)
```

## 🚀 Publicering via GitHub + Cloudflare Pages
1. Ladda upp hela innehållet i detta arkiv till ditt GitHub-repo.
2. Koppla ditt GitHub-repo till **Cloudflare Pages** (inget byggsteg krävs, lämna *Build command* tomt och sätt *Build output directory* till `/`).
3. Varje gång du redigerar en enskild fil (t.ex. `views/modals.html` eller `js/matching-chat.js`) på GitHub uppdateras sajten automatiskt!
