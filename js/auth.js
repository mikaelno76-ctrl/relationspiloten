// =========================================================================
// 3. INLOGGNING, REGISTRERING, FÖRSÖKSSPÄRR & KONTOHANTERING
// =========================================================================
    async function handleRegister() {
      showBanner("auth-feedback", "", "error");
      const alias = document.getElementById("auth-id").value.trim();
      const pass = document.getElementById("auth-pass").value.trim();
      const key = "";
      const consent = document.getElementById("legal-consent").checked;

      if (!alias || pass.length < 6) {
        showBanner("auth-feedback", "Välj ett alias och ett lösenord på minst 6 tecken.", "error");
        return;
      }
      if (!document.getElementById("age-consent").checked) {
        showBanner("auth-feedback", "Du måste vara minst 18 år för att skapa en profil.", "error");
        return;
      }
      if (!consent) {
        showBanner("auth-feedback", "Kryssa i rutan för att godkänna villkoren först.", "error");
        return;
      }

      const btn = document.getElementById("btn-register");
      btn.disabled = true;
      btn.innerText = "Skapar profil...";

      try {
        const email = aliasToEmail(alias);
        const data = await supabaseRequest('/auth/v1/signup', 'POST', { email: email, password: pass });
        
        apiKey = key;
        if (key) localStorage.setItem("gemini_api_key", key);

        if (data && data.access_token) {
          sessionData = data;
          currentAlias = alias;
          localStorage.setItem('rp_sb_session', JSON.stringify(data));
          localStorage.setItem('rp_alias', alias);
          document.getElementById("hub-user-name").innerText = alias;
          switchView("view-interests");
        } else {
          showBanner("auth-feedback", "Profil skapad! Klicka nu på 'Logga in'.", "info");
        }
      } catch (err) {
        showBanner("auth-feedback", "Kunde inte skapa konto: " + err.message, "error");
      } finally {
        btn.disabled = false;
        btn.innerText = "Skapa profil";
      }
    }

    async function handleLogin() {
      showBanner("auth-feedback", "", "error");
      const alias = document.getElementById("auth-id").value.trim();
      const pass = document.getElementById("auth-pass").value.trim();
      const key = "";
      const consent = document.getElementById("legal-consent").checked;

      if (!alias || !pass) {
        showBanner("auth-feedback", "Ange både ditt alias och ditt lösenord.", "error");
        return;
      }
      if (!consent) {
        showBanner("auth-feedback", "Kryssa i rutan för att godkänna villkoren först.", "error");
        return;
      }

      const btn = document.getElementById("btn-login");
      btn.disabled = true;
      btn.innerText = "Loggar in...";

      try {
        const email = aliasToEmail(alias);
        const data = await supabaseRequest('/auth/v1/token?grant_type=password', 'POST', { email: email, password: pass });
        
        sessionData = data;
        currentAlias = alias;
        apiKey = key;
        if (key) localStorage.setItem("gemini_api_key", key);
        localStorage.setItem('rp_sb_session', JSON.stringify(data));
        localStorage.setItem('rp_alias', alias);
        document.getElementById("hub-user-name").innerText = alias;

        const profiles = await supabaseRequest('/rest/v1/profiler?user_id=eq.' + data.user.id + '&select=*', 'GET', null, data.access_token);
        
        if (profiles && profiles.length > 0) {
          await syncAttemptsWithSupabase(profiles[0]);
        }
        if (profiles && profiles.length > 0 && profiles[0].profil_text) {
          document.getElementById("profile-text").innerText = stripModulesStampForDisplay(profiles[0].profil_text);
          if (profiles[0].frivilligt_kon) {
            currentGender = profiles[0].frivilligt_kon;
            document.getElementById("user-gender-select").value = currentGender;
          }
          await loadSavedMatchesFromSupabase();
          switchView("view-hub");
        } else {
          switchView("view-interests");
        }
      } catch (err) {
        showBanner("auth-feedback", "Inloggning misslyckades: " + err.message, "error");
      } finally {
        btn.disabled = false;
        btn.innerText = "Logga in";
      }
    }


    // =========================================================================
    // FÖRSÖKSSPÄRR (SYNKAD MED SUPABASE FÖR FJÄRR-NOLLSTÄLLNING FRÅN ADMIN)
    // =========================================================================
    function getAttemptStorageKey() {
      const uid = (sessionData && sessionData.user && sessionData.user.id) ? sessionData.user.id : (currentAlias || "guest");
      return "rp_attempts_v1_" + uid;
    }

    function getAttemptsMap() {
      try {
        const raw = localStorage.getItem(getAttemptStorageKey());
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveAttemptsMapLocal(map) {
      try {
        localStorage.setItem(getAttemptStorageKey(), JSON.stringify(map || {}));
      } catch (e) {}
    }

    async function syncAttemptsWithSupabase(profileRow) {
      if (!sessionData || !sessionData.user) return;
      try {
        let row = profileRow;
        if (!row) {
          const rows = await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id + '&select=*', 'GET', null, sessionData.access_token);
          row = (rows && rows.length > 0) ? rows[0] : null;
        }
        if (row && row.forsok_data && typeof row.forsok_data === "object") {
          const serverMap = row.forsok_data;
          const localMap = getAttemptsMap();
          // Om admin har gjort en nollställning på servern har serverMap ett högre 'admin_reset_ts'
          if ((serverMap.admin_reset_ts || 0) > (localMap.admin_reset_ts || 0)) {
            saveAttemptsMapLocal(serverMap);
          } else {
            const merged = Object.assign({}, serverMap, localMap);
            saveAttemptsMapLocal(merged);
          }
          refreshAttemptsUI();
        }
      } catch (e) {}
    }

    async function pushAttemptsToSupabase(map) {
      if (!sessionData || !sessionData.user) return;
      try {
        await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
          forsok_data: map
        }, sessionData.access_token);
      } catch (e) {}
    }

    function getModuleAttempts(modKey) {
      const map = getAttemptsMap();
      return Number(map[modKey] || 0);
    }

    function incrementModuleAttempts(modKey) {
      const map = getAttemptsMap();
      map[modKey] = Number(map[modKey] || 0) + 1;
      saveAttemptsMapLocal(map);
      pushAttemptsToSupabase(map);
      refreshAttemptsUI();
    }

    function refreshAttemptsUI() {
      const baseUsed = getModuleAttempts("base_roleplay");
      const baseLbl = document.getElementById("attempts-base-label");
      if (baseLbl) baseLbl.textContent = baseUsed + " av 2 förbrukade";
      const btnStartBase = document.getElementById("btn-start-base");
      if (btnStartBase) {
        btnStartBase.disabled = (baseUsed >= 2);
        if (baseUsed >= 2) btnStartBase.textContent = "🔒 Max 2 försök förbrukade för Grundäventyret";
      }
      const btnReplayBase = document.getElementById("btn-replay-base");
      if (btnReplayBase) {
        btnReplayBase.disabled = (baseUsed >= 2);
        btnReplayBase.textContent = baseUsed >= 2
          ? "🔒 Grundäventyr (2/2 försök använda)"
          : "Spela nytt Grundäventyr (" + baseUsed + "/2 försök använda)";
      }

      ["resource", "conflict", "routine"].forEach(k => {
        const used = getModuleAttempts("deep_" + k);
        const badge = document.getElementById("attempts-deep-" + k + "-badge");
        const btn = document.getElementById("btn-deep-" + k);
        if (badge) {
          badge.textContent = "Försök: " + used + " / 2";
          if (used >= 2) badge.style.background = "#7f1d1d";
        }
        if (btn) {
          btn.disabled = (used >= 2);
          if (used >= 2) btn.textContent = "🔒 Max 2 försök förbrukade";
        }
      });

      const swipeUsed = getModuleAttempts("swipe_test");
      const swipeLbl = document.getElementById("attempts-swipe-label");
      if (swipeLbl) swipeLbl.textContent = swipeUsed + " av 1 förbrukat";
      const btnHubSwipe = document.getElementById("btn-hub-swipelab");
      if (btnHubSwipe) {
        btnHubSwipe.disabled = (swipeUsed >= 1);
        if (swipeUsed >= 1) btnHubSwipe.textContent = "🔒 360° Vektorswipe redan genomförd (1/1 försök)";
      }
      const btnStartSwipe = document.getElementById("btn-start-locked-swipe");
      if (btnStartSwipe) {
        btnStartSwipe.disabled = (swipeUsed >= 1);
        if (swipeUsed >= 1) btnStartSwipe.textContent = "🔒 Redan genomförd (1/1 försök)";
      }

      const somUsed = getModuleAttempts("somatic_test");
      const somLbl = document.getElementById("attempts-somatic-label");
      if (somLbl) somLbl.textContent = somUsed + " av 1 förbrukat";
      const somModLbl = document.getElementById("attempts-somatic-modal-label");
      if (somModLbl) somModLbl.textContent = somUsed + " av 1 förbrukat";
      const btnHubSom = document.getElementById("btn-hub-somaticlab");
      if (btnHubSom) {
        btnHubSom.disabled = (somUsed >= 1);
        if (somUsed >= 1) btnHubSom.textContent = "🔒 Somatisk & Taktil Projektion redan genomförd (1/1 försök)";
      }
      if (typeof updateHubClarityBadge === "function") updateHubClarityBadge();

      const voiceUsed = getModuleAttempts("test_voice");
      const photosUsed = getModuleAttempts("test_photos");
      const memUsed = getModuleAttempts("test_memory");

      const vLbl = document.getElementById("attempts-voice-label");
      if (vLbl) vLbl.textContent = voiceUsed + "/1";
      const pLbl = document.getElementById("attempts-photos-label");
      if (pLbl) pLbl.textContent = photosUsed + "/1";
      const mLbl = document.getElementById("attempts-memory-label");
      if (mLbl) mLbl.textContent = memUsed + "/1";

      const btnGenArt = document.getElementById("btn-generate-voice-art");
      if (btnGenArt && voiceUsed >= 1) {
        btnGenArt.disabled = true;
        btnGenArt.textContent = "🔒 Röst-till-bild-testet är redan genomfört (1/1 försök)";
      }

      const btnDeepen = document.getElementById("btn-deepen-tests");
      if (btnDeepen && voiceUsed >= 1 && photosUsed >= 1 && memUsed >= 1) {
        btnDeepen.disabled = true;
        btnDeepen.textContent = "🔒 Alla kompletterande tester är genomförda (1/1 försök)";
      }
    }

    function saveInterestsAndStartBase() {
      const used = getModuleAttempts("base_roleplay");
      if (used >= 2) {
        showBanner("interests-feedback", "Du har redan förbrukat dina max 2 försök på Grundäventyret.", "error");
        return;
      }
      if (!confirm("Observera: Du har max 2 försök på Grundäventyret (detta blir försök " + (used + 1) + " av 2). Vill du starta äventyret nu?")) {
        return;
      }
      incrementModuleAttempts("base_roleplay");
      const langChoice = combineChoice("base-lang-select", "base-lang-free") || "Svenska";
      const worldChoice = combineChoice("base-world-select", "base-world-free");
      const eraChoice = combineChoice("base-era-select", "base-era-free");
      const contextChoice = combineChoice("base-context-select", "base-context-free");
      const superChoice = combineChoice("base-super-select", "base-super-free");

      const interests = document.getElementById("user-interests").value.trim();
      const avoid = document.getElementById("user-avoid").value.trim();
      swapEnabled = false;

      activeLanguage = langChoice;

      const cfg = WORLD_BUILDER_CONFIG[document.getElementById("base-world-select").value] || WORLD_BUILDER_CONFIG["Verkligheten"];
      let prefString = "VALDA SCENARIORAMAR: " +
        "Språk för rollspelet: " + activeLanguage + ". " +
        "Värld/Genre: " + worldChoice + ". " +
        cfg.eraLabel.replace(/^[^a-zA-ZåäöÅÄÖ]+/, "") + " " + eraChoice + ". " +
        cfg.contextLabel.replace(/^[^a-zA-ZåäöÅÄÖ]+/, "") + " " + contextChoice + ". " +
        cfg.superLabel.replace(/^[^a-zA-ZåäöÅÄÖ]+/, "") + " " + superChoice + ". ";

      if (interests) prefString += "SPELARENS ÖNSKADE TEMA & INTRESSEN: " + interests + ". ";
      if (avoid) prefString += "UNDVIK HELT I FIKTIONEN: " + avoid + ". ";

      if (prefString && sessionData) {
        localStorage.setItem("user_prefs_" + sessionData.user.id, prefString);
      }

      currentDilemmaKey = null;
      const combinedContext = (prefString + "\n\n" + BASE_SCENARIO.context).trim();
      const dynamicTitle = "Grundäventyret: " + worldChoice + " (" + eraChoice + " – " + contextChoice + ")";

      activeScenario = {
        title: dynamicTitle,
        context: combinedContext,
        maxTurns: 16
      };
      customPreferences = prefString;
      startWorldStateEngine(activeScenario.title, activeScenario.context, 16);
    }

    function startDeepAdventure(dilemmaKey) {
      const modKey = "deep_" + dilemmaKey;
      const used = getModuleAttempts(modKey);
      if (used >= 2) {
        alert("Du har redan förbrukat dina max 2 försök på denna rollspelsmodul.");
        return;
      }
      if (!confirm("Observera: För varje rollspelsdelmoment gäller max 2 försök (detta blir försök " + (used + 1) + " av 2). Vill du starta nu?")) {
        return;
      }
      incrementModuleAttempts(modKey);
      const langChoice = combineChoice("deep-lang-select", "deep-lang-free") || "Svenska";
      const worldChoice = combineChoice("deep-world-select", "deep-world-free");
      const eraChoice = combineChoice("deep-era-select", "deep-era-free");
      const contextChoice = combineChoice("deep-context-select", "deep-context-free");
      const superChoice = combineChoice("deep-super-select", "deep-super-free");

      const env = document.getElementById("deep-env").value.trim();
      const companion = document.getElementById("deep-companion").value.trim();
      swapEnabled = !!(document.getElementById("deep-swap-twist") && document.getElementById("deep-swap-twist").checked);

      activeLanguage = langChoice;

      const dilemma = DEEP_DILEMMAS[dilemmaKey];
      currentDilemmaKey = dilemmaKey;

      const savedPrefs = sessionData ? (localStorage.getItem("user_prefs_" + sessionData.user.id) || "") : "";
      const cfg = WORLD_BUILDER_CONFIG[document.getElementById("deep-world-select").value] || WORLD_BUILDER_CONFIG["Verkligheten"];
      const envDesc = worldChoice + " | " + cfg.eraLabel.replace(/^[^a-zA-ZåäöÅÄÖ]+/, "") + " " + eraChoice +
        " | " + cfg.contextLabel.replace(/^[^a-zA-ZåäöÅÄÖ]+/, "") + " " + contextChoice +
        " | " + cfg.superLabel.replace(/^[^a-zA-ZåäöÅÄÖ]+/, "") + " " + superChoice + (env ? " – " + env : "");
      const compDesc = companion || "En trovärdig och namngiven kompanjon som passar scenariot";

      const fullContext = "SPRÅK FÖR ROLLSPELET: " + activeLanguage + ". VÄRLD & MILJÖ: " + envDesc + ". KOMPANJON: " + compDesc + ". " + savedPrefs + " " + dilemma.spelledarDirektiv +
        (swapEnabled ? " TWIST-FÖRBEREDELSE (dold för spelaren): Gör kompanjonen till en tydlig, välgestaltad person med egna mål, vanor och ett särskilt sätt att prata, så att ett perspektivbyte senare i äventyret blir meningsfullt." : "");

      activeScenario = {
        title: dilemma.title + " (" + worldChoice + ", " + eraChoice + ")",
        context: fullContext,
        maxTurns: 35
      };
      customPreferences = fullContext;

      startWorldStateEngine(activeScenario.title, fullContext, 35);
    }

    function logout() {
      sessionData = null;
      currentAlias = "";
      currentGender = "";
      window.latestProfile = null;
      currentWorldState = "";
      recentHistory = [];
      allSessionHistory = [];
      finished = false;
      warningGiven = false;
      currentChatMatch = null;
      localStorage.removeItem('rp_sb_session');
      localStorage.removeItem('rp_alias');
      document.getElementById("auth-id").value = "";
      document.getElementById("auth-pass").value = "";
      document.getElementById("legal-consent").checked = false;
      document.getElementById("profile-text").innerText = "";
      closeTrollModal();
      switchView("view-auth");
    }

    async function deleteMyData() {
      if (!confirm("Är du säker? Profil, matchningar, meddelanden och ditt inloggningskonto raderas permanent.")) return;
      if (!sessionData || !sessionData.access_token) {
        alert("Du är inte inloggad.");
        return;
      }
      try {
        await supabaseRequest('/rest/v1/rpc/radera_mitt_konto', 'POST', {}, sessionData.access_token);
      } catch (e) {
        alert("Raderingen misslyckades: " + e.message + "\nDina uppgifter är INTE raderade. Försök igen.");
        return;
      }
      try {
        localStorage.removeItem("user_prefs_" + sessionData.user.id);
        localStorage.removeItem("gemini_api_key");
      } catch (e) {}
      alert("All din data och ditt konto har raderats.");
      logout();
    }

    function leaveGame() {
      currentWorldState = "";
      recentHistory = [];
      allSessionHistory = [];
      window.latestProfile = null;
      finished = false;
      closeTrollModal();
      if (document.getElementById("profile-text").innerText.trim()) {
        switchView("view-hub");
      } else {
        switchView("view-interests");
      }
    }

