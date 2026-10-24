// =========================================================================
// 6. KOMPLETTERANDE TESTER: RÖST-TILL-BILD, VARDAGSBILDER & MINNE
// =========================================================================
    function previewPhoto(input, imgId) {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.getElementById(imgId);
        img.src = e.target.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    }

    function startVoiceRecord() {
      const status = document.getElementById("voice-status");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = "Direktinspelning stöds inte i webbläsaren. Använd filuppladdning eller skriv i fältet nedan.";
        return;
      }
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        recordedChunks = [];
        recordedAudioBlob = null;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
        mediaRecorder.onstop = () => {
          recordedAudioBlob = new Blob(recordedChunks, { type: "audio/webm" });
          const url = URL.createObjectURL(recordedAudioBlob);
          status.innerHTML = '✅ Inspelning klar! Klicka på "Steg 1: Låt Argon 4.0 lyssna & måla" nedan. <audio controls src="' + url + '" style="vertical-align:middle; max-width:200px; margin-left:6px;"></audio>';
          stream.getTracks().forEach(t => t.stop());
          const recBtn = document.getElementById("btn-voice-record");
          if (recBtn) recBtn.textContent = "🎙️ Spela in på nytt (max 30s)";
        };
        mediaRecorder.start();
        const recBtn = document.getElementById("btn-voice-record");
        if (recBtn) recBtn.textContent = "⏹️ Stoppa inspelning nu";
        status.textContent = "🔴 Spelar in din röst... Tryck på knappen igen när du är klar (max 30s).";
        setTimeout(() => { if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop(); }, 30000);
      }).catch(err => {
        status.textContent = "Kunde inte starta mikrofon: " + err.message;
      });
    }

    async function generateVoiceArtWithArgon() {
      const statusEl = document.getElementById("voice-art-status");
      const btn = document.getElementById("btn-generate-voice-art");
      const stage2El = document.getElementById("voice-art-stage2");
      const theme = document.getElementById("voice-theme-select") ? document.getElementById("voice-theme-select").value : "Något känslosamt";
      const voiceTranscript = document.getElementById("voice-transcript").value.trim();
      const voiceFile = document.getElementById("voice-file").files[0];
      const activeAudioBlob = voiceFile || recordedAudioBlob;

      if (getModuleAttempts("test_voice") >= 1) {
        statusEl.style.color = "#fca5a5";
        statusEl.textContent = "Du har redan genomfört röst-till-bild-testet (endast 1 försök gäller).";
        return;
      }
      if (!activeAudioBlob && !voiceTranscript) {
        statusEl.style.color = "#fca5a5";
        statusEl.textContent = "Spela in ett röstklipp med mikrofonen (eller välj en ljudfil / skriv i stöd-rutan) först!";
        return;
      }

      btn.disabled = true;
      statusEl.style.color = "#38bdf8";
      statusEl.textContent = "🎨 Argon 4.0 lyssnar på din röst, analyserar tonfallet och målar ett konstverk...";

      try {
        const parts = [];
        if (activeAudioBlob) {
          const audioBase64 = await blobToBase64(activeAudioBlob);
          const cleanAudioMime = ((activeAudioBlob.type || "audio/webm").split(";")[0].trim()) || "audio/webm";
          parts.push({
            inline_data: { mime_type: cleanAudioMime, data: audioBase64 }
          });
        }

        const userPromptText = "VALT TEMA ATT BESKRIVA: " + theme + ".\n" +
          (voiceTranscript ? "Användarens ord/kommentar: \"" + voiceTranscript + "\"\n" : "") +
          "Lyssna noga på rösten, intonationen, pauserna och känslan (eller läs beskrivningen). Skapa nu ditt konstnärliga, lätt suggestiva och flertydiga verk som speglar vad du hörde.";
        parts.push({ text: userPromptText });

        const systemPrompt = "Du är Argon 4.0, en psykologiskt skarpsynt och kreativ AI-konstnär.\n" +
          "Användaren har precis berättat om '" + theme + "' med sin röst.\n" +
          "Ditt uppdrag är Steg 1 i ett psykologiskt projektions- och speglingsväxelspel:\n" +
          "1. Lyssna på vad användaren säger OCH hur det sägs (tonfall, melodi, tvekan, värme, tyngd eller energi).\n" +
          "2. Skapa en fantasifull, konstnärlig och psykologiskt spännande SVG-målning ('svgArtwork') som gestaltar det du hörde. Målningen ska vara rik på stämning, färggradienter, ljusdunkel, symboliska former och organiska silhuetter – men avsiktligt öppen för tolkning (likt ett modernt konstverk eller ett estetiskt Rorschach-motiv där olika betraktare kan se helt olika saker).\n" +
          "3. 'svgArtwork' MÅSTE vara en komplett, giltig <svg viewBox=\"0 0 500 360\" xmlns=\"http://www.w3.org/2000/svg\">...</svg> med minst 8-15 genomtänkta visuella element (bakgrundsgradienter, organiska kurvor/paths, cirklar/ljuskällor, kontrasterande former). Använd inga externa bilder eller länkar i SVG:n.\n" +
          "4. 'spokenIntro': 2-3 varma, nyfikna meningar på SVENSKA direkt till användaren: förklara kort vad du fångade upp i deras röst/berättelse och avsluta med: 'Det här var det jag fick för mig att måla när jag hörde dig. Vad tycker du om det, och vad ser du i bilden?'\n" +
          "5. 'vocalObservation': Din interna analys (2 meningar) av användarens röstklang, känsloläge och ordval.\n" +
          "6. 'visualSymbolism': Din interna notering (2 meningar) om vilka tvetydiga former/kontraster du lagt in i bilden för att testa hur användaren projicerar och reagerar.\n\n" +
          "Returnera ENDAST giltig JSON (ingen markdown utanför JSON):\n" +
          "{\n" +
          '  "spokenIntro": "...",\n' +
          '  "vocalObservation": "...",\n' +
          '  "visualSymbolism": "...",\n' +
          '  "svgArtwork": "<svg viewBox=\'0 0 500 360\' xmlns=\'http://www.w3.org/2000/svg\'>...</svg>"\n' +
          "}";

        const rawReply = await callGeminiDirect("argon", systemPrompt, [{ role: "user", parts: parts }]);
        let parsed = null;
        try {
          parsed = JSON.parse(cleanJsonOutput(rawReply));
        } catch (jsonErr) {
          const svgMatch = rawReply.match(/<svg[\s\S]*?<\/svg>/i);
          const introMatch = rawReply.match(new RegExp('"spokenIntro"\\s*:\\s*"([^"]*)"'));
          const vocalMatch = rawReply.match(new RegExp('"vocalObservation"\\s*:\\s*"([^"]*)"'));
          const symMatch = rawReply.match(new RegExp('"visualSymbolism"\\s*:\\s*"([^"]*)"'));
          parsed = {
            spokenIntro: introMatch ? introMatch[1] : "När jag lyssnade på din röst och tonfallet i det du berättade fick jag för mig att måla det här. Vad tycker du om det, och vad ser du i bilden?",
            vocalObservation: vocalMatch ? vocalMatch[1] : "tydlig känslomässig närvaro i rösten",
            visualSymbolism: symMatch ? symMatch[1] : "abstrakta kontraster och organiska former",
            svgArtwork: svgMatch ? svgMatch[0] : ""
          };
        }

        argonGeneratedArtMeta = {
          theme: theme,
          spokenIntro: parsed.spokenIntro || "",
          vocalObservation: parsed.vocalObservation || "",
          visualSymbolism: parsed.visualSymbolism || ""
        };

        document.getElementById("argon-art-intro").textContent = parsed.spokenIntro || "Det här fick jag för mig att måla när jag lyssnade på dig. Vad tycker du om det, och vad ser du i bilden?";
        const artBox = document.getElementById("argon-artwork-container");
        if (parsed.svgArtwork && parsed.svgArtwork.indexOf("<svg") !== -1) {
          artBox.innerHTML = parsed.svgArtwork;
          const svgEl = artBox.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.height = "auto";
            svgEl.style.display = "block";
          }
        } else {
          artBox.innerHTML = '<div style="padding:30px; text-align:center; color:#94a3b8;">[Abstrakt komposition genererad av Argon 4.0]</div>';
        }

        stage2El.style.display = "block";
        statusEl.style.color = "#6ee7b7";
        statusEl.textContent = "✨ Målningen är klar! Titta på bilden nedan och skriv din spontana reaktion.";
        stage2El.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        statusEl.style.color = "#fca5a5";
        statusEl.textContent = "Kunde inte skapa målningen: " + err.message;
      } finally {
        btn.disabled = false;
      }
    }

    async function deepenWithTests() {
      const statusEl = document.getElementById("tests-status");
      const btn = document.getElementById("btn-deepen-tests");
      const existingProfile = document.getElementById("profile-text").innerText.trim();

      if (!existingProfile) {
        statusEl.textContent = "Du behöver först ha en profil från grundäventyret.";
        return;
      }

      const voiceTranscript = document.getElementById("voice-transcript").value.trim();
      const voiceReaction = document.getElementById("voice-art-reaction") ? document.getElementById("voice-art-reaction").value.trim() : "";
      const voiceFile = document.getElementById("voice-file").files[0];
      const activeAudioBlob = voiceFile || recordedAudioBlob;

      const photoInputs = [
        { file: document.getElementById("photo1").files[0], cap: document.getElementById("caption1").value.trim() },
        { file: document.getElementById("photo2").files[0], cap: document.getElementById("caption2").value.trim() },
        { file: document.getElementById("photo3").files[0], cap: document.getElementById("caption3").value.trim() }
      ];
      const hasPhotos = photoInputs.some(p => p.file || p.cap);
      const memory = document.getElementById("memory-answer").value.trim();

      const doingVoice = !!(activeAudioBlob || voiceTranscript || argonGeneratedArtMeta || voiceReaction);
      const doingPhotos = hasPhotos;
      const doingMemory = !!memory;

      if (!doingVoice && !doingPhotos && !doingMemory) {
        statusEl.textContent = "Fyll i eller gör minst ett av delmomenten innan du fördjupar.";
        return;
      }
      if (doingVoice && getModuleAttempts("test_voice") >= 1) {
        statusEl.textContent = "Du har redan förbrukat ditt 1 försök på Röst-till-bild-växelspelet.";
        return;
      }
      if (doingPhotos && getModuleAttempts("test_photos") >= 1) {
        statusEl.textContent = "Du har redan förbrukat ditt 1 försök på Vardagsbilder.";
        return;
      }
      if (doingMemory && getModuleAttempts("test_memory") >= 1) {
        statusEl.textContent = "Du har redan förbrukat ditt 1 försök på Minnesfrågan.";
        return;
      }
      if (!confirm("Observera: För de kompletterande testerna gäller endast 1 försök per delmoment. Vill du skicka in och låsa ditt försök nu?")) {
        return;
      }
      if (doingVoice) incrementModuleAttempts("test_voice");
      if (doingPhotos) incrementModuleAttempts("test_photos");
      if (doingMemory) incrementModuleAttempts("test_memory");

      btn.disabled = true;
      statusEl.textContent = "Argon 4.0 analyserar växelspelet (röst + AI-målning + din tolkning), bilder och minne...";

      try {
        const multimodalParts = [];
        let contextNotes = "TIDIGARE PROFIL (från rollspel):\n" + existingProfile + "\n\nINKOMNA KOMPLETTERANDE TESTER:\n";

        if (activeAudioBlob) {
          const audioBase64 = await blobToBase64(activeAudioBlob);
          const mimeType = ((activeAudioBlob.type || "audio/webm").split(";")[0].trim()) || "audio/webm";
          multimodalParts.push({
            inline_data: { mime_type: mimeType, data: audioBase64 }
          });
          contextNotes += "- RÖSTINSPELNING (Bifogad som ljudfil ovan): Lyssna på tonfall, tempo, pauser och känsla.\n";
        }
        if (voiceTranscript) {
          contextNotes += '- Användarens inledande beskrivning i ord: "' + voiceTranscript + '".\n';
        }
        if (argonGeneratedArtMeta) {
          contextNotes += "- VÄXELSPEL (RÖST -> AI-BILD -> PROJEKTION):\n" +
            "  * Valt tema: " + argonGeneratedArtMeta.theme + "\n" +
            "  * Argons observation av rösten: " + argonGeneratedArtMeta.vocalObservation + "\n" +
            "  * Symbolik i bilden som Argon målade åt användaren: " + argonGeneratedArtMeta.visualSymbolism + "\n";
        }
        if (voiceReaction) {
          contextNotes += '  * ANVÄNDARENS REAKTION & TOLKNING AV AI-MÅLNINGEN: "' + voiceReaction + '"\n' +
            "  (Analysera hur användaren reagerade på Argons tolkning: visar svaret självdistans, humor, nyfikenhet, sårbarhet, projektion eller försvar?).\n";
        }

        for (let i = 0; i < photoInputs.length; i++) {
          const item = photoInputs[i];
          if (item.file) {
            const imgBase64 = await blobToBase64(item.file);
            multimodalParts.push({
              inline_data: { mime_type: item.file.type || "image/jpeg", data: imgBase64 }
            });
            contextNotes += '- BILD ' + (i + 1) + ' (Bifogad som bild ovan). Bildtext från användaren: "' + (item.cap || 'Ingen bildtext') + '". Kontrollera även att bilden följer regeln (ingen selfie, inget gym, ingen solnedgång).\n';
          } else if (item.cap) {
            contextNotes += '- BILDTEXT ' + (i + 1) + ' (utan bild): "' + item.cap + '".\n';
          }
        }

        if (memory) {
          contextNotes += '- MINNESFRÅGA (En gång användaren ändrade sig): "' + memory + '"\n';
        }

        multimodalParts.push({ text: contextNotes });

        const systemPrompt = "Du är Argon 4.0, en beteendeanalytiker (du är inte terapeut och ställer inga diagnoser).\n" +
          "Ditt uppdrag är att NYANSERA OCH FÖRDJUPA en redan etablerad beteendeprofil genom att analysera användarens röst-till-bild-växelspel (vad användaren berättade, vad du målade åt dem, och hur användaren tolkade och reagerade på målningen), samt eventuella vardagsbilder och minnesfråga.\n\n" +
          "UPPDRAGSREGLER:\n" +
          "1. Ersätt INTE profilen helt. Behåll de verifierade dragen från rollspelet och väv in insikterna från röst- och bildväxelspelet (projektionsmönster, röstvärme, självdistans, känslomässig öppenhet), vardagsbilder och minnesfråga.\n" +
          "2. Om en vardagsbild bryter mot regeln (t.ex. är en tydlig selfie eller gymbild), notera det sakligt som en observation.\n" +
          "3. Strukturera under exakt samma 7 rubriker:\n" +
          "1. Konflikthantering & Stressrespons\n" +
          "2. Samarbetsdynamik & Kontrollbehov\n" +
          "3. Emotionell lyhördhet & Bekräftelsemönster\n" +
          "4. Beslutsfattande under osäkerhet\n" +
          "5. Största relationsstyrka\n" +
          "6. Potentiell friktionsyta i ett partnerskap\n" +
          "7. Värderingar & livsåskådning (vad personen verkar prioritera när något måste offras)\n\n" +
          "Max 450 ord. Tonen ska vara varm, observant och psykologiskt skarp.";

        const analysis = await callGeminiDirect("argon", systemPrompt, [{ role: "user", parts: multimodalParts }]);
        const stampedAnalysis = attachCompletedModulesStamp(analysis);
        document.getElementById("profile-text").innerText = stripModulesStampForDisplay(stampedAnalysis);
        window.latestProfile = stampedAnalysis;

        if (sessionData) {
          await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
            profil_text: stampedAnalysis,
            godkand_for_matchning: true,
            frivilligt_kon: currentGender || null
          }, sessionData.access_token);
        }

        statusEl.textContent = "✅ Argon 4.0 har fördjupat profilen med insikterna från röst- och bildväxelspelet och sparat i valvet!";
        document.getElementById("profile-text").scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        enqueueArgonJob({
          type: "deepen_multimodal",
          label: "Fördjupning (Röst/Bild/Minne)",
          systemPrompt: systemPrompt,
          contents: [{ role: "user", parts: multimodalParts }]
        });
        statusEl.style.color = "#fde68a";
        statusEl.textContent = "⏳ Argon 4.0 kunde inte nås direkt. Din fördjupning är nu sparad i bakgrundskön och körs automatiskt var 10:e minut (du kan tryggt stänga webbläsaren under tiden!).";
      } finally {
        btn.disabled = false;
      }
    }

    window.generateVoiceArtWithArgon = generateVoiceArtWithArgon;

    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.saveInterestsAndStartBase = saveInterestsAndStartBase;
    window.startDeepAdventure = startDeepAdventure;
    window.logout = logout;
    window.deleteMyData = deleteMyData;
    window.sendFreeTextTurn = sendFreeTextTurn;
    window.runAnalysis = runAnalysis;
    window.proceedToHub = proceedToHub;
    window.runLiveMatching = runLiveMatching;
    window.updateGenderSetting = updateGenderSetting;
    window.toggleEmbeddedChat = toggleEmbeddedChat;
    window.closeEmbeddedChat = closeEmbeddedChat;
    window.sendHubMessage = sendHubMessage;
    window.reportMessage = reportMessage;
    window.previewPhoto = previewPhoto;
    window.startVoiceRecord = startVoiceRecord;
    window.deepenWithTests = deepenWithTests;
    window.closeTrollModal = closeTrollModal;


