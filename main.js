// =========================================================================
// 11. HUVUDSTART & DYNAMISK LADDNING AV HTML-VYER (views/*.html)
// =========================================================================
async function loadModularViews() {
  const slots = document.querySelectorAll("[data-view-src]");
  await Promise.all(Array.from(slots).map(async (slot) => {
    const src = slot.getAttribute("data-view-src");
    if (!src) return;
    try {
      const res = await fetch(src);
      if (res.ok) {
        const html = await res.text();
        slot.outerHTML = html;
      }
    } catch (err) {
      console.warn("Kunde inte hämta vy-fil " + src + " via fetch (t.ex. vid lokal file://):", err);
    }
  }));
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadModularViews();
      initSwipeListeners();
      syncSupabaseArketyper();
      if (typeof initSomaticWheelListeners === 'function') initSomaticWheelListeners();
      if (typeof syncSupabaseStimuliBucket === 'function') syncSupabaseStimuliBucket();
      if (typeof updateHubClarityBadge === 'function') updateHubClarityBadge();
      ensureArgonQueueScheduler();
      // Om användaren hade stängt webbläsaren och öppnar den igen efter >10 min: kör förfallna Argon-jobb direkt!
      setTimeout(() => processArgonQueueNow(false), 2500);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") processArgonQueueNow(false);
      });
      setAppLanguage(currentAppLanguage);
      const directLabBtn = document.getElementById('btn-direct-swipelab');
      if (directLabBtn) directLabBtn.addEventListener('click', openSwipeLab);
      const hubLabBtn = document.getElementById('btn-hub-swipelab');
      if (hubLabBtn) hubLabBtn.addEventListener('click', openSwipeLab);
      const exitLabBtn = document.getElementById('btn-exit-swipelab');
      if (exitLabBtn) exitLabBtn.addEventListener('click', exitSwipeLab);
      const localFileInp = document.getElementById('test-local-files');
      if (localFileInp) {
        localFileInp.addEventListener('change', (e) => {
          const files = Array.from(e.target.files);
          if (!files.length) return;
          let matchedCount = 0;
          const unmatchedFiles = [];
          const allDecks = ['ONBOARDING', 'A', 'B', 'C', 'D'];

          files.forEach(f => {
            const cleanBase = f.name.replace(/\.[^/.]+$/, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
            const normId = cleanBase.replace(/^([A-Z])0+(\d+)$/, '$1$2');
            let found = false;
            allDecks.forEach(dKey => {
              ARCHETYPE_DECKS[dKey].cards.forEach(card => {
                if (card.id.toUpperCase() === normId) {
                  card.blobUrl = URL.createObjectURL(f);
                  card.resolvedUrl = card.blobUrl;
                  found = true;
                  matchedCount++;
                }
              });
            });
            if (!found) unmatchedFiles.push(f);
          });

          const statusSpan = document.getElementById('local-files-status');
          if (matchedCount > 0) {
            customUploadedCards = [];
            if (statusSpan) {
              statusSpan.style.color = '#6ee7b7';
              statusSpan.textContent = '✅ ' + matchedCount + ' arketypbilder matchade och redo!';
            }
          } else {
            customUploadedCards = unmatchedFiles.map((f, i) => ({
              id: 'NANO_' + (i + 1),
              filename: f.name,
              name: f.name.replace(/\.[^/.]+$/, ''),
              trait: 'Egen Nano Banana-arketyp',
              blobUrl: URL.createObjectURL(f)
            }));
            if (statusSpan) {
              statusSpan.style.color = '#6ee7b7';
              statusSpan.textContent = '✅ ' + customUploadedCards.length + ' egna bilder inlästa och redo!';
            }
          }
        });
      }

      const healthEl = document.getElementById("js-health");
      if (healthEl) {
        healthEl.style.color = "#6ee7b7";
        healthEl.textContent = "🟢 Systemstatus: JavaScript-motorn är aktiv och redo.";
      }

      document.getElementById("base-world-select").addEventListener("change", () => updateBuilderMenus("base"));
      document.getElementById("deep-world-select").addEventListener("change", () => updateBuilderMenus("deep"));
      updateBuilderMenus("base");
      updateBuilderMenus("deep");

      document.getElementById("btn-login").addEventListener("click", handleLogin);
      document.getElementById("btn-register").addEventListener("click", handleRegister);
      document.getElementById("btn-start-base").addEventListener("click", saveInterestsAndStartBase);
      document.getElementById("btn-logout").addEventListener("click", logout);
      document.getElementById("btn-delete-data").addEventListener("click", deleteMyData);
      document.getElementById("btn-replay-base").addEventListener("click", () => switchView("view-interests"));
      document.getElementById("btn-run-match").addEventListener("click", runLiveMatching);
      document.getElementById("btn-close-chat").addEventListener("click", closeEmbeddedChat);
      document.getElementById("user-gender-select").addEventListener("change", updateGenderSetting);
      document.getElementById("btn-send-hub-msg").addEventListener("click", sendHubMessage);
      document.getElementById("btn-voice-record").addEventListener("click", startVoiceRecord);
      document.getElementById("btn-deepen-tests").addEventListener("click", deepenWithTests);
      
      document.getElementById("send-btn").addEventListener("click", sendFreeTextTurn);
      document.getElementById("btn-to-questions").addEventListener("click", openPostQuestions);
      document.getElementById("btn-to-summary").addEventListener("click", finishAndAnalyze);
      document.getElementById("retry-btn").addEventListener("click", runAnalysis);
      document.getElementById("proceed-btn").addEventListener("click", proceedToHub);
      document.getElementById("btn-close-troll").addEventListener("click", closeTrollModal);

      document.getElementById("user-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendFreeTextTurn();
      });
      document.getElementById("hub-chat-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendHubMessage();
      });

      localStorage.removeItem("gemini_api_key");

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("admin") === "1" || (urlParams.get("mode") || "").toLowerCase() === "admin") {
        openAdminPanel();
        return;
      }
      const testParam = (urlParams.get("test") || urlParams.get("mode") || "").toLowerCase();
      if (testParam === "swipe" || testParam === "kompass") {
        switchView("view-swipe-lab");
        syncSupabaseArketyper();
      if (typeof initSomaticWheelListeners === 'function') initSomaticWheelListeners();
      if (typeof syncSupabaseStimuliBucket === 'function') syncSupabaseStimuliBucket();
      if (typeof updateHubClarityBadge === 'function') updateHubClarityBadge();
        startLockedSwipeSession();
        return;
      } else if (testParam === "somatic" || testParam === "kropp" || testParam === "taktil") {
        openSomaticLab();
        return;
      } else if (testParam === "crm" || testParam === "psykoakustik" || testParam === "audio") {
        openSomaticLab();
        startPsychoacousticCrmDirect();
        return;
      } else if (testParam === "voice" || testParam === "rost" || testParam === "art") {
        openStandaloneVoiceLab();
        return;
      } else if (testParam === "taxi" || testParam === "dropin" || testParam === "lab") {
        openTaxiMenu();
        return;
      }

      const storedSession = localStorage.getItem('rp_sb_session');
      const storedAlias = localStorage.getItem('rp_alias');

      if (storedSession && storedAlias) {
        try {
          sessionData = JSON.parse(storedSession);
          currentAlias = storedAlias;
          document.getElementById("hub-user-name").innerText = currentAlias;

          const profiles = await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id + '&select=*', 'GET', null, sessionData.access_token);
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
          }
        } catch (e) {
          localStorage.removeItem('rp_sb_session');
        }
      }
});
