    // =========================================================================
    // ADMINPORTAL & MODERERINGSMOTOR (SUPABASE RPC MED KRYPTERAD NYCKEL)
    // =========================================================================
    let adminSecretKey = sessionStorage.getItem("rp_admin_secret") || "";
    let adminAllMembers = [];

    function openAdminPanel() {
      document.body.classList.remove("swipe-locked");
      switchView("view-admin");
      if (adminSecretKey) {
        document.getElementById("admin-secret-input").value = adminSecretKey;
        loadAdminDashboard();
      }
    }

    function lockAdminPanel() {
      adminSecretKey = "";
      sessionStorage.removeItem("rp_admin_secret");
      document.getElementById("admin-secret-input").value = "";
      document.getElementById("admin-dashboard-content").style.display = "none";
      document.getElementById("admin-login-box").style.display = "block";
    }

    function exitAdminPanel() {
      if (sessionData && document.getElementById("profile-text").innerText.trim()) {
        switchView("view-hub");
      } else {
        switchView("view-auth");
      }
    }

    async function adminRpcCall(fnName, params) {
      const secret = document.getElementById("admin-secret-input").value.trim() || adminSecretKey;
      if (!secret) throw new Error("Ange din Master Admin-nyckel först.");
      const payload = Object.assign({ p_secret: secret }, params || {});
      return await supabaseRequest('/rest/v1/rpc/' + fnName, 'POST', payload, sessionData ? sessionData.access_token : null);
    }

    async function loadAdminDashboard() {
      const authMsg = document.getElementById("admin-auth-msg");
      const btn = document.getElementById("btn-admin-unlock");
      authMsg.style.display = "none";
      if (btn) btn.disabled = true;

      try {
        const data = await adminRpcCall("admin_oversikt", {});
        const secret = document.getElementById("admin-secret-input").value.trim();
        if (secret) {
          adminSecretKey = secret;
          sessionStorage.setItem("rp_admin_secret", secret);
        }

        document.getElementById("admin-login-box").style.display = "none";
        document.getElementById("admin-dashboard-content").style.display = "block";

        renderAdminStats(data);
        renderAdminFlaggedMessages(data.flagged_messages || []);
        adminAllMembers = data.members || [];
        renderAdminMembers(adminAllMembers);
      } catch (err) {
        authMsg.style.display = "block";
        authMsg.textContent = "❌ Åtkomst nekad eller RPC saknas: " + err.message + " (Kontrollera att du har kört Admin-SQL-skriptet i Supabase SQL Editor och angett rätt nyckel).";
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    function renderAdminStats(data) {
      const members = data.members || [];
      const matches = data.matches || [];
      const flagged = data.flagged_messages || [];
      const totalMsgs = Number(data.total_messages_count || 0);

      const totalProf = members.length;
      const readyProf = members.filter(m => m.godkand_for_matchning && m.profil_text).length;
      document.getElementById("stat-total-profiles").textContent = totalProf;
      document.getElementById("stat-ready-profiles").textContent = readyProf + " redo för matchning";

      let women = 0, men = 0, other = 0, unspec = 0, compassCount = 0;
      members.forEach(m => {
        if (m.frivilligt_kon === "Kvinna") women++;
        else if (m.frivilligt_kon === "Man") men++;
        else if (m.frivilligt_kon === "Annat") other++;
        else unspec++;
        if (m.profil_text && m.profil_text.indexOf("VISUELL KOMPASS") !== -1) compassCount++;
      });
      document.getElementById("stat-gender-split").innerHTML =
        "👩 Kvinnor: " + women + "<br>👨 Män: " + men + "<br>✨ Annat/Ej angivet: " + (other + unspec);

      document.getElementById("stat-total-matches").textContent = matches.length;
      if (matches.length > 0) {
        const avg = Math.round(matches.reduce((acc, r) => acc + Number(r.kompatibilitet || 0), 0) / matches.length);
        document.getElementById("stat-avg-score").textContent = "Snittkompatibilitet: " + avg + " %";
      } else {
        document.getElementById("stat-avg-score").textContent = "Snitt: - %";
      }

      document.getElementById("stat-total-msgs").textContent = totalMsgs;
      document.getElementById("stat-flagged-msgs").textContent = flagged.length + " anmälda ärenden";
      document.getElementById("stat-multimodal-count").textContent = compassCount + " kompasser";
    }

    function renderAdminFlaggedMessages(flagged) {
      const box = document.getElementById("admin-flagged-list");
      const badge = document.getElementById("admin-flagged-badge");
      badge.textContent = flagged.length + " ärenden";
      box.innerHTML = "";

      if (!flagged || flagged.length === 0) {
        box.innerHTML = '<p style="font-size:0.85rem; margin:0; color:#6ee7b7;">✅ Inga anmälda eller flaggade chattmeddelanden att hantera.</p>';
        return;
      }

      flagged.forEach(msg => {
        const div = document.createElement("div");
        div.style.cssText = "background:#11151c; border:1px solid #7f1d1d; border-radius:8px; padding:12px;";
        div.innerHTML =
          '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">' +
            '<strong style="color:#fca5a5; font-size:0.88rem;">Avsändare: ' + String(msg.sender_alias || "Okänd") + ' <code style="font-size:0.72rem; color:#94a3b8;">(' + String(msg.sender_id || "").substring(0, 8) + '...)</code></strong>' +
            '<span style="font-size:0.75rem; color:var(--muted);">' + (msg.created_at ? new Date(msg.created_at).toLocaleString("sv-SE") : "") + '</span>' +
          '</div>' +
          '<div style="background:#090d13; padding:10px; border-radius:6px; font-size:0.9rem; color:#fff; margin-bottom:10px; white-space:pre-wrap;"></div>' +
          '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
            '<button type="button" class="btn btn-danger" style="width:auto; margin:0; padding:6px 12px; font-size:0.78rem;" onclick="window.adminBanUser(\'' + msg.sender_id + '\', \'' + String(msg.sender_alias || "").replace(/[^a-zA-Z0-9_-]/g, "") + '\')">🚫 Radera &amp; Stäng av avsändaren permanent</button>' +
            '<button type="button" class="btn btn-secondary" style="width:auto; margin:0; padding:6px 12px; font-size:0.78rem;" onclick="window.adminDismissFlag(\'' + msg.id + '\', true)">🗑️ Radera endast meddelandet</button>' +
            '<button type="button" class="btn btn-secondary" style="width:auto; margin:0; padding:6px 12px; font-size:0.78rem;" onclick="window.adminDismissFlag(\'' + msg.id + '\', false)">✓ Frikänn (Ta bort flagga)</button>' +
          '</div>';
        div.querySelector("div:nth-child(2)").textContent = msg.meddelande_text || "";
        box.appendChild(div);
      });
    }

    function filterAdminMembers() {
      const q = (document.getElementById("admin-member-search").value || "").toLowerCase().trim();
      if (!q) {
        renderAdminMembers(adminAllMembers);
        return;
      }
      const filtered = adminAllMembers.filter(m =>
        String(m.alias || "").toLowerCase().indexOf(q) !== -1 ||
        String(m.user_id || "").toLowerCase().indexOf(q) !== -1 ||
        String(m.email || "").toLowerCase().indexOf(q) !== -1
      );
      renderAdminMembers(filtered);
    }

    function renderAdminMembers(members) {
      const box = document.getElementById("admin-members-list");
      box.innerHTML = "";
      if (!members || members.length === 0) {
        box.innerHTML = '<p style="font-size:0.85rem;">Inga medlemmar hittades.</p>';
        return;
      }

      members.forEach(m => {
        const fData = (m.forsok_data && typeof m.forsok_data === "object") ? m.forsok_data : {};
        const card = document.createElement("div");
        card.style.cssText = "background:#11151c; border:1px solid var(--border); border-radius:8px; padding:14px;";

        const aliasClean = String(m.alias || m.email || ("Medlem-" + String(m.user_id).substring(0, 6)));
        const countersSummary =
          "Grundrollspel: " + Number(fData.base_roleplay || 0) + "/2 • " +
          "Modul A/B/C: " + Number(fData.deep_resource || 0) + "/" + Number(fData.deep_conflict || 0) + "/" + Number(fData.deep_routine || 0) + " • " +
          "360°-Svajp: " + Number(fData.swipe_test || 0) + "/1 • Somatik: " + Number(fData.somatic_test || 0) + "/1 • CRM-Ljud: " + Number(fData.crm_test || 0) + "/1 • Symbolkompass: " + Number(fData.color_form_mood_test || 0) + "/2 • " +
          "Röst/Bild/Minne: " + Number(fData.test_voice || 0) + "/" + Number(fData.test_photos || 0) + "/" + Number(fData.test_memory || 0);

        card.innerHTML =
          '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">' +
            '<div>' +
              '<strong style="color:#fff; font-size:0.95rem;">👤 ' + aliasClean + '</strong> ' +
              (m.frivilligt_kon ? '<span class="status-badge" style="margin:0; font-size:0.7rem;">' + m.frivilligt_kon + '</span> ' : '') +
              '<code style="font-size:0.72rem; color:#94a3b8;">' + m.user_id + '</code>' +
            '</div>' +
            '<span class="status-badge ' + (m.godkand_for_matchning ? '' : 'badge-silver') + '" style="margin:0;">' +
              (m.godkand_for_matchning ? 'Aktiv i matchning' : 'Ej i matchning') +
            '</span>' +
          '</div>' +
          '<div style="font-size:0.78rem; color:#38bdf8; margin-bottom:10px;">📊 <strong>Förbrukade försök:</strong> ' + countersSummary + '</div>' +
          '<div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">' +
            '<select id="reset-sel-' + m.user_id + '" style="width:auto; margin:0; padding:6px 10px; font-size:0.78rem;">' +
              '<option value="ALL">🔄 Nollställ ALLA räknare (Full omstart)</option>' +
              '<option value="base_roleplay">🎭 Grundäventyret (16 rundor)</option>' +
              '<option value="deep_resource">⚔️ Modul A: Resursbrist (35 rundor)</option>' +
              '<option value="deep_conflict">⚖️ Modul B: Värdekonflikt (35 rundor)</option>' +
              '<option value="deep_routine">☕ Modul C: Vardagslunk (35 rundor)</option>' +
              '<option value="swipe_test">🔥 360° Vektorswipe &amp; Självbild</option>' +
              '<option value="somatic_test">🏛️ Somatisk &amp; Taktil Projektion</option>
              <option value="crm_test">🎧 Psykoakustisk Ljudanalys (CRM)</option>' +
              '<option value="devil_test">⚡ Off-Guard Profilskärpa</option>' +
              '<option value="color_form_mood_test">🎨 Symbolkompass (Färg/Form Bra vs Dåligt humör, 0/2)</option>' +
              '<option value="test_voice">🎙️ Röst ➔ AI-Målning</option>' +
              '<option value="test_photos">📷 Tre bilder ur verkligheten</option>' +
              '<option value="test_memory">📝 Minnesfrågan (Ändrade mig)</option>' +
            '</select>' +
            '<button type="button" class="btn" style="width:auto; margin:0; padding:6px 12px; font-size:0.78rem;" onclick="window.adminResetMemberAttempts(\'' + m.user_id + '\', \'' + aliasClean.replace(/[^a-zA-Z0-9_-]/g, "") + '\')">⚡ Nollställ vald räknare</button>' +
            '<button type="button" class="btn btn-danger" style="width:auto; margin:0; padding:6px 12px; font-size:0.78rem; margin-left:auto;" onclick="window.adminBanUser(\'' + m.user_id + '\', \'' + aliasClean.replace(/[^a-zA-Z0-9_-]/g, "") + '\')">🚫 Radera medlem &amp; konto</button>' +
          '</div>';

        box.appendChild(card);
      });
    }

    async function adminResetMemberAttempts(targetUserId, aliasLabel) {
      const selEl = document.getElementById("reset-sel-" + targetUserId);
      const moduleKey = selEl ? selEl.value : "ALL";
      if (!confirm("Vill du nollställa räknaren (" + moduleKey + ") för " + aliasLabel + "?")) return;

      try {
        await adminRpcCall("admin_nollstall_forsok", {
          p_target_user: targetUserId,
          p_module: moduleKey
        });
        if (sessionData && sessionData.user && sessionData.user.id === targetUserId) {
          const map = getAttemptsMap();
          if (moduleKey === "ALL") {
            saveAttemptsMapLocal({ admin_reset_ts: Date.now() });
          } else {
            map[moduleKey] = 0;
            map.admin_reset_ts = Date.now();
            saveAttemptsMapLocal(map);
          }
          refreshAttemptsUI();
        }
        alert("✅ Räknaren (" + moduleKey + ") är nu nollställd för " + aliasLabel + "!");
        await loadAdminDashboard();
      } catch (err) {
        alert("Kunde inte nollställa räknare: " + err.message);
      }
    }

    async function adminDismissFlag(msgId, deleteMsg) {
      const actionDesc = deleteMsg ? "radera detta chattmeddelande permanent" : "frikänna meddelandet och ta bort flaggan";
      if (!confirm("Vill du " + actionDesc + "?")) return;
      try {
        await adminRpcCall("admin_hantera_flaggat_meddelande", {
          p_msg_id: msgId,
          p_radera: !!deleteMsg
        });
        await loadAdminDashboard();
      } catch (err) {
        alert("Kunde inte utföra åtgärd: " + err.message);
      }
    }

    async function adminBanUser(targetUserId, aliasLabel) {
      if (!confirm("⚠️ VARNING: Vill du permanent radera medlemmen '" + aliasLabel + "' (inklusive profil, matchningar, chattmeddelanden och inloggningskonto)? Detta går inte att ångra.")) return;
      try {
        await adminRpcCall("admin_radera_medlem", {
          p_target_user: targetUserId
        });
        alert("🚫 Medlemmen " + aliasLabel + " och all tillhörande data har raderats permanent.");
        await loadAdminDashboard();
      } catch (err) {
        alert("Kunde inte radera medlem: " + err.message);
      }
    }

    window.openAdminPanel = openAdminPanel;
    window.lockAdminPanel = lockAdminPanel;
    window.exitAdminPanel = exitAdminPanel;
    window.loadAdminDashboard = loadAdminDashboard;
    window.filterAdminMembers = filterAdminMembers;
    window.adminResetMemberAttempts = adminResetMemberAttempts;
    window.adminDismissFlag = adminDismissFlag;
    window.adminBanUser = adminBanUser;

