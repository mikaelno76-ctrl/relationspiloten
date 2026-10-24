    // =========================================================================
    // FRISTÅENDE SNABBTESTER (TAXI DROP-IN / QR-KODSLÄGE UTAN LAGRING)
    // =========================================================================
    let soloMediaRecorder = null;
    let soloRecordedChunks = [];
    let soloRecordedBlob = null;
    let soloArtMeta = null;
    let enteredFromTaxiMenu = false;

    function openTaxiMenu() {
      enteredFromTaxiMenu = true;
      document.body.classList.remove("swipe-locked");
      switchView("view-taxi-menu");
    }

    function openStandaloneVoiceLab() {
      document.body.classList.remove("swipe-locked");
      switchView("view-voice-lab");
    }

    function exitStandaloneVoiceLab() {
      if (enteredFromTaxiMenu) {
        switchView("view-taxi-menu");
      } else if (sessionData && document.getElementById("profile-text").innerText.trim()) {
        switchView("view-hub");
      } else {
        switchView("view-auth");
      }
    }

    function copyTextElement(elId) {
      const el = document.getElementById(elId);
      if (!el || !el.innerText.trim()) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(el.innerText.trim()).then(() => {
          alert("✅ Analysen har kopierats till urklipp! Du kan nu klistra in den i dina anteckningar.");
        }).catch(() => {
          alert("Kunde inte kopiera automatiskt – markera texten och kopiera manuellt.");
        });
      } else {
        alert("Markera texten i rutan för att kopiera den.");
      }
    }

    function downloadTextElement(elId, filename) {
      const el = document.getElementById(elId);
      if (!el || !el.innerText.trim()) return;
      const blob = new Blob([el.innerText.trim()], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "relationspiloten-analys.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function startSoloVoiceRecord() {
      const status = document.getElementById("solo-voice-status");
      const recBtn = document.getElementById("btn-solo-voice-record");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = "Direktinspelning stöds inte i denna webbläsare. Välj en ljudfil eller skriv i textrutan nedan.";
        return;
      }
      if (soloMediaRecorder && soloMediaRecorder.state === "recording") {
        soloMediaRecorder.stop();
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        soloRecordedChunks = [];
        soloRecordedBlob = null;
        soloMediaRecorder = new MediaRecorder(stream);
        soloMediaRecorder.ondataavailable = e => { if (e.data.size > 0) soloRecordedChunks.push(e.data); };
        soloMediaRecorder.onstop = () => {
          soloRecordedBlob = new Blob(soloRecordedChunks, { type: "audio/webm" });
          const url = URL.createObjectURL(soloRecordedBlob);
          status.innerHTML = '✅ Inspelning klar! Klicka på "Steg 1: Låt Argon 4.0 lyssna & måla" nedan. <audio controls src="' + url + '" style="vertical-align:middle; max-width:200px; margin-left:6px;"></audio>';
          stream.getTracks().forEach(t => t.stop());
          if (recBtn) recBtn.textContent = "🎙️ Spela in på nytt (max 30s)";
        };
        soloMediaRecorder.start();
        if (recBtn) recBtn.textContent = "⏹️ Stoppa inspelning nu";
        status.textContent = "🔴 Spelar in din röst... Tryck på knappen igen när du är klar (max 30s).";
        setTimeout(() => { if (soloMediaRecorder && soloMediaRecorder.state === "recording") soloMediaRecorder.stop(); }, 30000);
      }).catch(err => {
        status.textContent = "Kunde inte starta mikrofon: " + err.message;
      });
    }

    async function generateSoloVoiceArt() {
      const statusEl = document.getElementById("solo-art-status");
      const btn = document.getElementById("btn-solo-generate-art");
      const stage2El = document.getElementById("solo-voice-stage2");
      const theme = document.getElementById("solo-voice-theme") ? document.getElementById("solo-voice-theme").value : "Något känslosamt";
      const transcript = document.getElementById("solo-voice-transcript").value.trim();
      const fileInp = document.getElementById("solo-voice-file").files[0];
      const activeBlob = fileInp || soloRecordedBlob;

      if (!activeBlob && !transcript) {
        statusEl.style.color = "#fca5a5";
        statusEl.textContent = "Spela in ett röstklipp med mikrofonen (eller välj en ljudfil / skriv i rutan) först!";
        return;
      }

      btn.disabled = true;
      statusEl.style.color = "#38bdf8";
      statusEl.textContent = "🎨 Argon 4.0 lyssnar på din röst, analyserar tonfallet och målar ett konstverk...";

      try {
        const parts = [];
        if (activeBlob) {
          const audioBase64 = await blobToBase64(activeBlob);
          const cleanMime = ((activeBlob.type || "audio/webm").split(";")[0].trim()) || "audio/webm";
          parts.push({
            inline_data: { mime_type: cleanMime, data: audioBase64 }
          });
        }

        const userPromptText = "VALT TEMA ATT BESKRIVA: " + theme + ".\n" +
          (transcript ? "Användarens ord/kommentar: \"" + transcript + "\"\n" : "") +
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

        soloArtMeta = {
          theme: theme,
          spokenIntro: parsed.spokenIntro || "",
          vocalObservation: parsed.vocalObservation || "",
          visualSymbolism: parsed.visualSymbolism || ""
        };

        document.getElementById("solo-argon-intro").textContent = parsed.spokenIntro || "Det här fick jag för mig att måla när jag lyssnade på dig. Vad tycker du om det, och vad ser du i bilden?";
        const artBox = document.getElementById("solo-artwork-box");
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
        document.getElementById("solo-voice-output").style.display = "none";
        document.getElementById("solo-voice-actions").style.display = "none";
        statusEl.style.color = "#6ee7b7";
        statusEl.textContent = "✨ Målningen är klar! Titta på bilden nedan och beskriv vad du ser.";
        stage2El.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        statusEl.style.color = "#fca5a5";
        statusEl.textContent = "Kunde inte skapa målningen: " + err.message;
      } finally {
        btn.disabled = false;
      }
    }

    async function runSoloVoiceFinalAnalysis() {
      const reaction = document.getElementById("solo-voice-reaction").value.trim();
      const outEl = document.getElementById("solo-voice-output");
      const actEl = document.getElementById("solo-voice-actions");
      const btn = document.getElementById("btn-solo-run-analysis");
      const transcript = document.getElementById("solo-voice-transcript").value.trim();
      const fileInp = document.getElementById("solo-voice-file").files[0];
      const activeBlob = fileInp || soloRecordedBlob;

      if (!reaction) {
        alert("Skriv ett par ord om vad du tycker om målningen eller vad du ser i den först!");
        return;
      }

      btn.disabled = true;
      outEl.style.display = "block";
      outEl.innerText = "Argon 4.0 analyserar växelspelet mellan din röst, målningen och din tolkning...";

      try {
        const parts = [];
        if (activeBlob) {
          const audioBase64 = await blobToBase64(activeBlob);
          const cleanMime = ((activeBlob.type || "audio/webm").split(";")[0].trim()) || "audio/webm";
          parts.push({
            inline_data: { mime_type: cleanMime, data: audioBase64 }
          });
        }

        const payloadNote = "UNDERLAG FÖR FRISTÅENDE SPEGLINGS- & PROJEKTIONSANALYS:\n" +
          "- Valt tema: " + (soloArtMeta ? soloArtMeta.theme : "Känslobeskrivning") + "\n" +
          (transcript ? "- Användarens inledande ord: \"" + transcript + "\"\n" : "") +
          "- Argons observation av rösten i Steg 1: " + (soloArtMeta ? soloArtMeta.vocalObservation : "") + "\n" +
          "- Visuell symbolik i målningen som Argon visade: " + (soloArtMeta ? soloArtMeta.visualSymbolism : "") + "\n" +
          "- ANVÄNDARENS REAKTION & TOLKNING AV MÅLNINGEN I STEG 2: \"" + reaction + "\"\n";
        parts.push({ text: payloadNote });

        const systemPrompt = "Du är Argon 4.0, expert på psykologisk projektion, röstanalys och mellanmänsklig dynamik (du ställer inga kliniska diagnoser).\n" +
          "Analysera detta fristående växelspel där användaren först berättade om något med sin röst, fick se en AI-målning baserad på rösten, och sedan tolkade målningen med egna ord.\n\n" +
          "Ge en träffsäker, varm, underhållande och psykologiskt skarp profil på SVENSKA under 4 rubriker:\n" +
          "1. Vad rösten och tonfallet avslöjade (Känslomässig närvaro, tempo, nyanser och underton)\n" +
          "2. Projektionen i bilden (Hur personen reagerade på målningen: ser de hopp, struktur, kaos, humor, skönhet eller går de i klinch med motivet?)\n" +
          "3. Din största styrka i samtal & närhet (Vad som gör personen spännande eller trygg att umgås med)\n" +
          "4. Vilken typ av människa du klickar bäst med (Vem som matchar denna energi i vardag eller relation).\n" +
          "Max 280 ord.";

        const reply = await callGeminiDirect("argon", systemPrompt, [{ role: "user", parts: parts }]);
        outEl.innerText = reply;
        actEl.style.display = "flex";
        outEl.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        outEl.innerText = "Kunde inte slutföra analysen: " + err.message;
      } finally {
        btn.disabled = false;
      }
    }

    window.openTaxiMenu = openTaxiMenu;
    window.openStandaloneVoiceLab = openStandaloneVoiceLab;
    window.exitStandaloneVoiceLab = exitStandaloneVoiceLab;
    window.startSoloVoiceRecord = startSoloVoiceRecord;
    window.generateSoloVoiceArt = generateSoloVoiceArt;
    window.runSoloVoiceFinalAnalysis = runSoloVoiceFinalAnalysis;
    window.copyTextElement = copyTextElement;
    window.downloadTextElement = downloadTextElement;
    window.switchView = switchView;


