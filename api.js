// =========================================================================
// 2. API-KOMMUNIKATION (SUPABASE & GEMINI) SAMT UI-HJÄLPFUNKTIONER
// =========================================================================
    function showBanner(id, message, type) {
      const el = document.getElementById(id);
      if (!el) return;
      if (!message) {
        el.className = "feedback-banner";
        el.textContent = "";
        return;
      }
      el.className = "feedback-banner " + (type || "error");
      el.textContent = message;
    }

    function switchView(viewId) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const target = document.getElementById(viewId);
      if (target) target.classList.add('active');
      if (typeof refreshAttemptsUI === "function") refreshAttemptsUI();
    }

    function closeTrollModal() {
      document.getElementById("troll-modal").classList.remove("active");
    }

    function openFaqModal() {
      const m = document.getElementById("faq-modal");
      if (m) m.classList.add("active");
    }

    function closeFaqModal() {
      const m = document.getElementById("faq-modal");
      if (m) m.classList.remove("active");
    }

    function revealDeveloperEmail() {
      const slot = document.getElementById("dev-mail-slot");
      const btn = document.getElementById("btn-reveal-dev-mail");
      if (!slot) return;
      // Sammansatt i runtime så att spambotar inte kan skrapa källkoden
      const u = "mikaelno" + "76";
      const d = "gmail" + "." + "com";
      const addr = u + "@" + d;
      slot.innerHTML = '<a href="mailto:' + addr + '" style="color:#fde68a; text-decoration:underline;">' + addr + '</a>';
      slot.style.display = "inline";
      if (btn) btn.style.display = "none";
    }
    window.openFaqModal = openFaqModal;
    window.closeFaqModal = closeFaqModal;
    window.revealDeveloperEmail = revealDeveloperEmail;

    function setBusy(state) {
      busy = state;
      const uInp = document.getElementById("user-input");
      const sBtn = document.getElementById("send-btn");
      if (uInp) uInp.disabled = state;
      if (sBtn) sBtn.disabled = state;
      document.querySelectorAll(".btn-choice").forEach(b => { b.disabled = state; });
    }

    function cleanJsonOutput(rawText) {
      if (!rawText) return "{}";
      let clean = rawText.trim();
      if (clean.startsWith("```json")) clean = clean.substring(7);
      else if (clean.startsWith("```")) clean = clean.substring(3);
      if (clean.endsWith("```")) clean = clean.substring(0, clean.length - 3);
      return clean.trim();
    }

    function blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const parts = reader.result.split(',');
          resolve(parts.length > 1 ? parts[1] : "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    async function supabaseRequest(endpoint, method, body, token, extraHeaders) {
      const reqMethod = method || 'GET';
      const headers = { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      if (extraHeaders) Object.assign(headers, extraHeaders);
      const opts = { method: reqMethod, headers: headers };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(SUPABASE_URL + endpoint, opts);
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = null;
      }
      if (!res.ok) {
        const msg = (data && (data.message || data.error_description || data.msg)) || 'Fel vid kommunikation med databasen.';
        throw new Error(msg);
      }
      return data;
    }

    function aliasToEmail(alias) {
      const clean = alias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      return (clean || 'user') + '@pilot.flen';
    }

    async function executeGeminiRequest(modelId, isDeepReasoning, systemInstruction, contents) {
      const generationConfig = {
        temperature: isDeepReasoning ? 0.6 : 0.7,
        maxOutputTokens: isDeepReasoning ? 8192 : 2000
      };
      if (!isDeepReasoning) {
        generationConfig.thinkingConfig = { thinkingBudget: 0 };
        generationConfig.responseMimeType = "application/json";
      }

      const payload = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: contents,
        generationConfig: generationConfig
      };

      let res = null;
      let data = null;
      let usedProxy = false;

      try {
        res = await fetch("https://relationspiloten.mikaelno76.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelId,
            apiKey: apiKey || undefined,
            payload: payload
          })
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.indexOf("application/json") !== -1) {
          data = await res.json();
          usedProxy = true;
        }
      } catch (proxyErr) {
        usedProxy = false;
      }

      if (!usedProxy || (!res.ok && apiKey)) {
        if (!apiKey) {
          const errMsg = (data && (data.error?.message || data.error)) || "Kunde inte nå /api/chat i Cloudflare och ingen lokal API-nyckel är angiven.";
          const err = new Error(errMsg);
          err.status = res ? res.status : 500;
          throw err;
        }
        const url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelId + ":generateContent?key=" + encodeURIComponent(apiKey);
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
      }

      if (!res.ok) {
        const errText = (data && (data.error?.message || data.error)) || ("Fel från modell " + modelId);
        const err = new Error(errText);
        err.status = res.status;
        throw err;
      }

      const cand = data && data.candidates ? data.candidates[0] : null;
      const parts = (cand && cand.content && cand.content.parts) ? cand.content.parts : [];
      const text = parts.map(p => p.text || "").join("").trim();
      if (!text) {
        const reason = (data && data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "okänd orsak";
        throw new Error("Tomt svar från modellen (" + reason + "). Försök igen.");
      }
      return text;
    }

    async function callGeminiDirect(tier, systemInstruction, contents) {
      const isDeep = (tier === "argon" || tier.indexOf("pro") !== -1 || tier.indexOf("argon") !== -1);
      const models = isDeep ? DEEP_MODELS : ROLEPLAY_MODELS;
      let lastError = null;

      for (let i = 0; i < models.length; i++) {
        const modelId = models[i];
        try {
          return await executeGeminiRequest(modelId, isDeep, systemInstruction, contents);
        } catch (err) {
          lastError = err;
          console.warn("Modell " + modelId + " kunde inte köras (" + err.message + "), testar nästa modell i kedjan...");
        }
      }
      throw lastError;
    }

