    // =========================================================================
    // STRIKT ARGON 4.0 KÖ-MOTOR (10-MINUTERS INTERVALL + OVERLEVER STÄNGD WEBBLÄSARE)
    // =========================================================================
    const ARGON_QUEUE_STORAGE_KEY = "rp_argon_strict_queue_v1";
    const ARGON_RETRY_INTERVAL_MS = 10 * 60 * 1000; // Exakt 10 minuter
    let argonQueueTimer = null;
    let argonCountdownTimer = null;

    function getArgonQueue() {
      try {
        const raw = localStorage.getItem(ARGON_QUEUE_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function saveArgonQueue(list) {
      try {
        localStorage.setItem(ARGON_QUEUE_STORAGE_KEY, JSON.stringify(list || []));
      } catch (e) {
        console.warn("Kunde inte spara Argon-kö i localStorage:", e);
      }
      refreshArgonQueueUI();
    }

    async function requestArgonNotificationPermission() {
      if ("Notification" in window && Notification.permission === "default") {
        try { await Notification.requestPermission(); } catch (e) {}
      }
    }

    function sendArgonBrowserNotification(title, body) {
      if ("Notification" in window && Notification.permission === "granted") {
        try { new Notification(title, { body: body }); } catch (e) {}
      }
    }

    async function syncJobToServerWaitlist(job) {
      // 1. Om användaren är inloggad i Supabase: spara en säkerhetskopia av det väntande Argon-jobbet på profilraden eller i molnet
      // 2. Skicka även till Cloudflare Worker (/queue-argon) om server-cron är aktiverad, så den kan köra jobbet även när telefonen/datorn är helt avstängd!
      try {
        fetch("https://relationspiloten.mikaelno76.workers.dev/queue-argon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: job.id,
            userId: sessionData && sessionData.user ? sessionData.user.id : null,
            supabaseToken: sessionData ? sessionData.access_token : null,
            type: job.type,
            model: "gemini-4-argon",
            systemPrompt: job.systemPrompt,
            contents: job.contents
          })
        }).catch(() => {});
      } catch (e) {}
    }

    function enqueueArgonJob(jobSpec) {
      requestArgonNotificationPermission();
      const q = getArgonQueue();
      // Undvik dubbletter av samma typ för samma användare; uppdatera befintligt jobb
      const existingIdx = q.findIndex(item => item.type === jobSpec.type);
      const newJob = {
        id: "argon_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        type: jobSpec.type || "roleplay_profile",
        label: jobSpec.label || "Argon 4.0 Analys",
        systemPrompt: jobSpec.systemPrompt,
        contents: jobSpec.contents,
        userId: sessionData && sessionData.user ? sessionData.user.id : null,
        createdAt: Date.now(),
        lastTriedAt: Date.now(),
        nextRetryAt: Date.now() + ARGON_RETRY_INTERVAL_MS,
        attempts: 1
      };

      if (existingIdx !== -1) {
        q[existingIdx] = newJob;
      } else {
        q.push(newJob);
      }

      saveArgonQueue(q);
      syncJobToServerWaitlist(newJob);
      ensureArgonQueueScheduler();
    }

    function clearArgonQueue() {
      if (!confirm("Vill du ta bort alla väntande Argon 4.0-analyser ur kön?")) return;
      saveArgonQueue([]);
      const qBox = document.getElementById("argon-queued-box");
      if (qBox) qBox.style.display = "none";
    }

    function refreshArgonQueueUI() {
      const q = getArgonQueue();
      const hubBanner = document.getElementById("argon-queue-hub-banner");
      const badge = document.getElementById("argon-queue-count-badge");
      const msg = document.getElementById("argon-queue-hub-msg");
      const clockEl = document.getElementById("argon-next-retry-clock");

      if (!q || q.length === 0) {
        if (hubBanner) hubBanner.style.display = "none";
        return;
      }

      if (hubBanner) hubBanner.style.display = "block";
      if (badge) badge.textContent = q.length + " jobb i Argon-kö";

      const nextTs = Math.min(...q.map(j => j.nextRetryAt || (Date.now() + ARGON_RETRY_INTERVAL_MS)));
      const diffSec = Math.max(0, Math.round((nextTs - Date.now()) / 1000));
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      const timeStr = mins > 0 ? (mins + " min " + secs + " sek") : (secs + " sek");

      if (clockEl) clockEl.textContent = "om " + timeStr;
      if (msg) {
        const labels = q.map(j => j.label).join(", ");
        msg.innerHTML = "Väntar strikt på <strong>Gemini 4.0 Argon</strong> för: <em>" + labels + "</em>.<br>" +
          "Nästa automatiska försök sker om <strong>" + timeStr + "</strong> (var 10:e minut). Du kan stänga webbläsaren när du vill – jobbet ligger kvar säkert och körs direkt när du eller bakgrundsmotorn får kontakt med Argon.";
      }
    }

    async function applyCompletedArgonJob(job, resultText) {
      if (job.type === "roleplay_profile" || job.type === "deepen_multimodal") {
        window.latestProfile = resultText;
        const profEl = document.getElementById("profile-text");
        if (profEl) profEl.innerText = resultText;
        const resEl = document.getElementById("analysis-result");
        if (resEl) resEl.innerText = resultText;
        const qBox = document.getElementById("argon-queued-box");
        if (qBox) qBox.style.display = "none";
        const proceedBtn = document.getElementById("proceed-btn");
        if (proceedBtn) proceedBtn.style.display = "block";

        if (sessionData && sessionData.user) {
          const existing = await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id + '&select=user_id', 'GET', null, sessionData.access_token);
          if (existing && existing.length > 0) {
            await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
              profil_text: resultText,
              godkand_for_matchning: true,
              frivilligt_kon: currentGender || null
            }, sessionData.access_token);
          } else {
            await supabaseRequest('/rest/v1/profiler', 'POST', {
              user_id: sessionData.user.id,
              profil_text: resultText,
              godkand_for_matchning: true,
              frivilligt_kon: currentGender || null
            }, sessionData.access_token);
          }
        }
      } else if (job.type === "swipe_profile") {
        const outEl = document.getElementById("swipe-argon-output");
        if (outEl) {
          outEl.style.display = "block";
          outEl.innerText = resultText;
        }
        const existingProf = document.getElementById("profile-text") ? document.getElementById("profile-text").innerText.trim() : "";
        if (existingProf && sessionData && sessionData.user) {
          const combined = existingProf + "\n\n--- VISUELL KOMPASS & SJÄLVBILD (ARGON 4.0) ---\n" + resultText;
          document.getElementById("profile-text").innerText = combined;
          await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
            profil_text: combined
          }, sessionData.access_token);
        }
      } else if (job.type === "somatic_profile") {
        const outEl = document.getElementById("somatic-argon-output");
        if (outEl) {
          outEl.style.display = "block";
          outEl.innerText = resultText;
        }
        const existingProf = document.getElementById("profile-text") ? document.getElementById("profile-text").innerText.trim() : "";
        if (existingProf && sessionData && sessionData.user) {
          const combined = attachCompletedModulesStamp(existingProf + "\n\n--- SOMATISK & TAKTIL POLARITET + PROFILSKÄRPA (ARGON 4.0) ---\n" + resultText);
          document.getElementById("profile-text").innerText = stripModulesStampForDisplay(combined);
          await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
            profil_text: combined
          }, sessionData.access_token);
        }
      }

      sendArgonBrowserNotification("✅ Argon 4.0 är klar!", "Din analys (" + job.label + ") är nu färdig och sparad i Relationspiloten.");
    }

    async function processArgonQueueNow(manualTrigger) {
      const q = getArgonQueue();
      if (!q || q.length === 0) return;

      const now = Date.now();
      const remaining = [];
      let anyCompleted = false;

      for (let i = 0; i < q.length; i++) {
        const job = q[i];
        if (!manualTrigger && job.nextRetryAt && now < job.nextRetryAt) {
          remaining.push(job);
          continue;
        }

        try {
          console.log("[Argon-Kö] Testar strikt Argon 4.0 för jobb:", job.label, "(Försök #" + (job.attempts + 1) + ")");
          const reply = await callGeminiDirect("argon", job.systemPrompt, job.contents);
          await applyCompletedArgonJob(job, reply);
          anyCompleted = true;
        } catch (err) {
          job.attempts = (job.attempts || 1) + 1;
          job.lastTriedAt = Date.now();
          job.nextRetryAt = Date.now() + ARGON_RETRY_INTERVAL_MS;
          job.lastError = err.message;
          remaining.push(job);
          console.warn("[Argon-Kö] Argon 4.0 fortfarande ej nåbar (" + err.message + "). Nästa försök om 10 min.");
        }
      }

      saveArgonQueue(remaining);
      if (anyCompleted && manualTrigger) {
        alert("🎉 Argon 4.0 svarade! Din analys är nu klar och sparad i din profil.");
      } else if (!anyCompleted && manualTrigger && remaining.length > 0) {
        alert("⏳ Argon 4.0 är fortfarande upptagen eller otillgänglig (" + (remaining[0].lastError || "Inget svar") + ").\n\nKön fortsätter prova automatiskt var 10:e minut i bakgrunden!");
      }
    }

    function ensureArgonQueueScheduler() {
      refreshArgonQueueUI();
      if (!argonCountdownTimer) {
        argonCountdownTimer = setInterval(() => {
          const q = getArgonQueue();
          if (!q || q.length === 0) return;
          refreshArgonQueueUI();
          const now = Date.now();
          if (q.some(j => !j.nextRetryAt || now >= j.nextRetryAt)) {
            processArgonQueueNow(false);
          }
        }, 15000); // Kollar klockan var 15:e sekund och exekverar exakt när 10-minutersgränsen passerats
      }
    }

    window.processArgonQueueNow = processArgonQueueNow;
    window.clearArgonQueue = clearArgonQueue;


