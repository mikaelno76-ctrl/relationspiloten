// =========================================================================
// 4. ROLLSPELSMOTOR (FLASH 3.1 LITE) & DJUPANALYS (ARGON 4.0)
// =========================================================================
    function appendMessageToUI(role, text) {
      const container = document.getElementById("chat-history");
      const div = document.createElement("div");
      div.className = "msg " + role;
      div.innerText = text;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function fillBriefing(box, b) {
      const head = document.createElement("div");
      head.style.cssText = "font-weight:700; color:#38bdf8; margin-bottom:8px; font-size:0.92rem;";
      head.textContent = "📋 SCENARIO-BRIEFING & UTGÅNGSLÄGE";
      box.appendChild(head);
      const rows = [
        ["📍 Var & När (Plats, tid & atmosfär):", b.whereAndWhen || b.situation || ""],
        ["❓ Varför ni är här (Bakgrund & insats):", b.whyHere || ""],
        ["👥 Karaktärer & Relation:", b.characters || ""],
        ["🎯 Gemensamt mål & Utmaning:", b.goal || ""]
      ].filter(r => r[1]);
      rows.forEach((row, i) => {
        const d = document.createElement("div");
        if (i < rows.length - 1) d.style.marginBottom = "6px";
        const s = document.createElement("strong");
        s.style.color = "#cbd5e1";
        s.textContent = row[0];
        d.appendChild(s);
        d.appendChild(document.createTextNode(" " + row[1]));
        box.appendChild(d);
      });
    }

    function renderControls(data) {
      lastOffered = (data.interactionType === "choice" && Array.isArray(data.options))
        ? data.options.map(o => ({ id: o.id, text: o.text, trait: o.traitTarget || null }))
        : [];
      controlsShownAt = performance.now();
      const choiceBox = document.getElementById("choice-container");
      const freeTextBox = document.getElementById("freetext-container");

      if (data.interactionType === "choice" && Array.isArray(data.options) && data.options.length > 0) {
        freeTextBox.style.display = "none";
        choiceBox.innerHTML = "";
        choiceBox.style.display = "flex";

        data.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-choice";
          const idEl = document.createElement("strong");
          idEl.textContent = opt.id + ".";
          const txtEl = document.createElement("span");
          txtEl.textContent = opt.text;
          btn.appendChild(idEl);
          btn.appendChild(txtEl);
          btn.addEventListener("click", () => {
            executeTurnEngine(opt.text, opt.traitTarget || null);
          });
          choiceBox.appendChild(btn);
        });
      } else {
        choiceBox.style.display = "none";
        freeTextBox.style.display = "block";
        const inp = document.getElementById("user-input");
        inp.placeholder = data.freeTextPlaceholder || "Vad gör eller säger du nu?...";
        inp.value = "";
        inp.focus();
      }
    }

    function getPacingRule(turn, maxTurns) {
      const long = maxTurns !== 16;
      const breatherStart = long ? 10 : 6;
      const breatherEnd = long ? 13 : 8;
      const swapOn = long && swapEnabled;

      if (turn >= maxTurns) {
        return "FAS 4 (EPILOG - SISTA RUNDAN): Detta är sista rundan! Knyt ihop hela berättelsen utifrån spelarens sista val och ge en stämningsfull epilog. Låt minst två tidigare val få en synlig konsekvens i slutet. VIKTIGT: Sätt alltid 'warning' till 'NONE' i epilogen!";
      }
      if (swapOn && turn === SWAP_ROUND) {
        return "PERSPEKTIVBYTE (TWIST, DENNA RUNDA): Berättelsen gör nu ett skifte inom fiktionen. Från och med denna runda spelar SPELAREN den roll som kompanjonen hittills haft, och DU styr den gamla spelarkaraktären. Motivera skiftet inuti världen (t.ex. minnesbyte, dröm, rollomkastning som passar genren). Börja 'narration' med '🔄 ' och ge spelaren en kort stund att landa: 2-3 meningar där hen tar in sin nya position innan valen. Den gamla spelarkaraktären ska agera TROGET efter hur spelaren faktiskt betett sig hittills (samma tonfall, prioriteringar och blinda fläckar, hämtade ur krönikan och tidigare handlingar), men som en människa, inte som en karikatyr. Alla val ska nu vara i den nya rollen. Ändra inga fakta om världen.";
      }
      if (swapOn && turn > SWAP_ROUND) {
        return "FAS 3B (NYTT PERSPEKTIV): Spelaren spelar fortfarande kompanjonens roll. Fortsätt styra den gamla spelarkaraktären konsekvent efter spelarens tidigare mönster och låt situationen trappas upp. Låt spelaren möta konsekvenserna av just de beteenden hen själv visade tidigare, utan att förklara parallellen. Håll den röda tråden mot slutet.";
      }
      if (turn < breatherStart) {
        return "FAS 1 (UPPBYGGNAD & GRUNDLÄGGANDE SAMARBETE): Utforska situationen och lös praktiska delproblem ihop. Så små frön: kompanjonen har egna behov och ett första litet motsatsförhållande till spelaren. Håll en tydlig röd tråd från tidigare rundor.";
      }
      if (turn <= breatherEnd) {
        return "FAS 2 (KORT ANDNINGSPAUS & MELLANMÄNSKLIG DIALOG): Sänk tempot en liten stund. Låt kompanjonen och spelaren samtala om värderingar och tillit baserat på det ni gått igenom, och låt kompanjonen ställa en personlig fråga i karaktär. Plantera ett obehagligt frö som växer i nästa fas.";
      }
      return "FAS 3 (TRAPPAR UPP & SLUTGILTIG PRÖVNING): Insatserna ska stiga för varje runda. Sätt relationen, målet och principerna på prov med skarpa val där något värdefullt måste offras. Låt tidigare val och löften komma tillbaka. Undvik fler lugna pauser.";
    }

    async function startWorldStateEngine(title, context, maxTurns) {
      currentTurn = 1;
      warningGiven = false;
      finished = false;
      window.latestProfile = null;
      currentWorldState = "";
      round1AnchorContext = "";
      freeTextTurnsCount = 0;
      recentHistory = [];
      allSessionHistory = [];

      document.getElementById("game-title").innerText = title;
      document.getElementById("game-desc").innerText = currentDilemmaKey ? DEEP_DILEMMAS[currentDilemmaKey].focusDesc : "Samarbeta med din kompanjon och fatta besluten tillsammans.";
      document.getElementById("turn-indicator").innerText = "Runda 1 av " + maxTurns;
      document.getElementById("chat-history").innerHTML = '<div class="msg model">Flash 3.1 Lite etablerar scenariot och världsramarna...</div>';
      document.getElementById("epilogue-action").style.display = "none";
      document.getElementById("choice-container").style.display = "none";
      document.getElementById("freetext-container").style.display = "none";

      switchView("view-game");
      setBusy(true);

      const systemInstruction = "Du är spelledarmotor för Relationspiloten. Språk: " + activeLanguage + ".\n" + SPELLEDAR_CRAFT + "\n\n" +
        "Ditt uppdrag är att leverera rollspelets öppning (Runda 1) i STRIKT giltig JSON (ingen markdown utanför JSON).\n\n" +
        "REGLER FÖR RUNDA 1 (DJUP ETABLERING AV KONTEXT — VAR, NÄR, VARFÖR, VEM):\n" +
        "1. 'briefing': Du MÅSTE inleda med ett fylligt, kristallklart objekt så att både spelaren och framtida rundor har 100 % koll på förutsättningarna:\n" +
        "   - 'whereAndWhen': Exakt VAR ni befinner er (miljö, geografi, stämning, sinnliga detaljer) och NÄR det utspelar sig (årstid, tid på dygnet, epok/läge) (2-3 meningar).\n" +
        "   - 'whyHere': VARFÖR ni är just här, vilken förhistoria som lett er hit och vad som står på spel om ni misslyckas (2-3 meningar).\n" +
        "   - 'characters': Tydlig presentation av vem spelaren är (roll/kompetens) samt vem kompanjonen är (namn, roll, röst/jargong, personlighet och er relation till varandra).\n" +
        "   - 'goal': Ert konkreta gemensamma huvudmål OCH det omedelbara hindret framför er just nu.\n" +
        "2. 'narration': Själva öppningsscenen (90-120 ord) som målar upp miljön levande, förankrar var/när/varför ni är här och kastar in er direkt i en situation där kompanjonen gör eller säger något som kräver ett ställningstagande.\n" +
        "3. 'interactionType': Sätt till 'choice' i Runda 1 så att spelaren kommer igång smidigt (eller 'free_text' endast om öppningen kräver ett personligt löfte/svar med egna ord).\n" +
        "4. Om 'interactionType' == 'choice': Skapa exakt 3 distinkta val i 'options' (id: 'A','B','C'), där varje val har en 'traitTarget'. Sätt 'freeTextPlaceholder' till null.\n" +
        "5. 'roundSummary': 2 kompakta meningar som sammanfattar utgångsläget och den omedelbara konflikten.\n" +
        "6. 'warning': Sätt alltid 'NONE'.\n\n" +
        "JSON SCHEMA:\n" +
        "{\n" +
        '  "round": 1,\n' +
        '  "briefing": {\n' +
        '    "whereAndWhen": "...",\n' +
        '    "whyHere": "...",\n' +
        '    "characters": "...",\n' +
        '    "goal": "..."\n' +
        '  },\n' +
        '  "narration": "...",\n' +
        '  "interactionType": "choice",\n' +
        '  "options": [{"id": "A", "text": "...", "traitTarget": "..."}],\n' +
        '  "freeTextPlaceholder": null,\n' +
        '  "roundSummary": "...",\n' +
        '  "warning": "NONE"\n' +
        "}";

      const startPayload = {
        round: 1,
        totalRounds: maxTurns,
        scenarioTitle: title,
        scenarioContext: context,
        instruction: "Skapa en rik, levande briefing (whereAndWhen, whyHere, characters, goal) och en fyllig öppningsscen (narration) som gör det helt glasklart var man är, när man är där och varför man är där."
      };

      try {
        const rawReply = await callGeminiDirect("flash", systemInstruction, [
          { role: "user", parts: [{ text: JSON.stringify(startPayload) }] }
        ]);

        const parsed = JSON.parse(cleanJsonOutput(rawReply));

        document.getElementById("chat-history").innerHTML = "";
        let fullBriefingText = "";
        if (parsed.briefing) {
          const bBox = document.createElement("div");
          bBox.className = "msg model";
          bBox.style.cssText = "background:#141c27; border:1px solid #38bdf8; max-width:95%; width:100%; box-sizing:border-box;";
          fillBriefing(bBox, parsed.briefing);
          document.getElementById("chat-history").appendChild(bBox);
          fullBriefingText =
            "VAR & NÄR: " + (parsed.briefing.whereAndWhen || parsed.briefing.situation || "") + "\n" +
            "VARFÖR NI ÄR HÄR: " + (parsed.briefing.whyHere || "") + "\n" +
            "KARAKTÄRER & RELATION: " + (parsed.briefing.characters || "") + "\n" +
            "GEMENSAMT MÅL: " + (parsed.briefing.goal || "");
        }
        appendMessageToUI("model", parsed.narration);

        // SPARA HELA RUNDA 1 + SCENARIOPROMPTEN OAVKORTAD SOM PERMANENT ANKARE FÖR ALLA FRAMTIDA RUNDOR!
        round1AnchorContext =
          "=== URSPRUNGLIG SCENARIOPROMPT & DIREKTIV (INLÄSES I SIN HELHET VARJE RUNDA) ===\n" +
          context + "\n\n" +
          "=== ETABLERAD BRIEFING FRÅN RUNDA 1 (VAR, NÄR, VARFÖR, VEM) ===\n" +
          fullBriefingText + "\n\n" +
          "=== ÖPPNINGSSCEN I RUNDA 1 (ORDAGRANT) ===\n" +
          parsed.narration;

        const r1Sum = parsed.roundSummary || parsed.newWorldState || parsed.narration;
        currentWorldState = "[Runda 1 - Utgångsläge]: " + r1Sum;

        recentHistory.push({
          round: 1,
          gmNarration: parsed.narration,
          playerAction: null
        });

        allSessionHistory.push({
          round: 1,
          gmNarration: parsed.narration,
          playingAs: "EGEN ROLL",
          optionsOffered: null,
          playerAction: null,
          inputType: null,
          responseTimeSec: null,
          trait: null
        });

        if (parsed.interactionType === "free_text") freeTextTurnsCount++;
        renderControls(parsed);
      } catch (err) {
        alert("Kunde inte starta äventyret: " + err.message);
        leaveGame();
      } finally {
        setBusy(false);
      }
    }

    async function executeTurnEngine(actionText, traitTarget) {
      if (busy || finished) return;
      setBusy(true);

      const nextRound = currentTurn + 1;
      const isFinalEpilogue = nextRound >= activeScenario.maxTurns;
      const isButtonChoice = (traitTarget && traitTarget !== "egen_formulering");

      appendMessageToUI("user", actionText);

      const currentActionRecord = {
        playingAs: (swapEnabled && activeScenario.maxTurns === 35 && currentTurn >= SWAP_ROUND) ? "KOMPANJONENS ROLL (efter twist)" : "EGEN ROLL",
        optionsOffered: lastOffered.length ? lastOffered.map(o => o.id + ": " + o.text) : null,
        playerAction: actionText,
        inputType: isButtonChoice ? "knappval" : "fritext",
        responseTimeSec: controlsShownAt ? Math.round((performance.now() - controlsShownAt) / 1000) : null,
        trait: traitTarget || null
      };
      if (allSessionHistory.length > 0 && allSessionHistory[allSessionHistory.length - 1].round === currentTurn && allSessionHistory[allSessionHistory.length - 1].playerAction === null) {
        Object.assign(allSessionHistory[allSessionHistory.length - 1], currentActionRecord);
      } else {
        allSessionHistory.push(Object.assign({ round: currentTurn, gmNarration: "" }, currentActionRecord));
      }

      if (recentHistory.length > 0 && recentHistory[recentHistory.length - 1].playerAction === null) {
        recentHistory[recentHistory.length - 1].playerAction = actionText;
      } else {
        recentHistory.push({
          round: currentTurn,
          gmNarration: "",
          playerAction: actionText
        });
      }
      if (recentHistory.length > 3) recentHistory.shift();

      const pacingDirective = getPacingRule(nextRound, activeScenario.maxTurns);
      const targetFreeTextQuota = activeScenario.maxTurns === 16 ? 5 : 11;

      const turnPayload = {
        round: nextRound,
        totalRounds: activeScenario.maxTurns,
        isFinalEpilogueRound: isFinalEpilogue,
        freeTextUsedSoFar: freeTextTurnsCount,
        recommendedTotalFreeTextTurns: targetFreeTextQuota,
        lastTurnWasFreeText: !isButtonChoice,
        fullOriginalScenarioAndRound1Anchor: round1AnchorContext,
        accumulatedStoryChronicle: currentWorldState,
        lastThreeRoundsDetail: recentHistory,
        latestPlayerAction: actionText
      };

      const systemInstruction = "Du är spelledarmotor för Relationspiloten. Språk: " + activeLanguage + ".\n" + SPELLEDAR_CRAFT + "\n\n" +
        "Ditt uppdrag är att leverera fortsättningen i STRIKT giltig JSON (ingen markdown utanför JSON).\n\n" +
        "DRAMATURGI: " + pacingDirective + "\n\n" +
        "FULLSTÄNDIG KONTEXTFÖRANKRING (KRITISKT VIKTIGT):\n" +
        "- Läs ALLTID 'fullOriginalScenarioAndRound1Anchor' (hela grundprompten + var/när/varför vi är här från Runda 1), 'accumulatedStoryChronicle' (krönikan) samt 'lastThreeRoundsDetail' (de tre senaste rundorna ordagrant).\n" +
        "- Tappa ALDRIG bort var vi är, varför vi är här, när det utspelar sig eller vilka karaktärerna är.\n\n" +
        "DYNAMISKT VAL MELLAN KNAPPVAL ('choice') OCH FRITEXT ('free_text'):\n" +
        "- Du bestämmer SJÄLV i fältet 'interactionType' om denna runda ska ge 3 knappval ('choice') eller kräva att spelaren svarar med egna ord ('free_text')!\n" +
        "- Välj 'free_text' NÄR DET ÄR PSYKOLOGISKT OCH DRAMATURGISKT LÄMPLIGT för ett nyanserat svar: t.ex. när kompanjonen ställer en direkt personlig/känslomässig fråga, när en förtroendekris eller värdekonflikt ställs på sin spets, när spelaren måste förklara SITT motiv/sin gräns, eller vid ett avgörande etiskt vägskäl där färdiga knappar skulle bli för platta.\n" +
        "- Välj 'choice' (3 skarpa handlingsalternativ A, B, C) när tempot behöver drivas framåt i praktisk handling, taktik eller snabba vägval.\n" +
        "- BALANSREGEL: Sikta på att ungefär var tredje runda (~" + targetFreeTextQuota + " rundor totalt under äventyret, hittills har " + freeTextTurnsCount + " fritextrundor körts) är 'free_text'. Undvik att lägga två 'free_text' direkt efter varandra om det inte är absolut nödvändigt för en intensiv dialog.\n\n" +
        "REGLER FÖR JSON-FÄLTEN:\n" +
        "1. 'narration': Max 65-90 ord. Fortsätt direkt på spelarens senaste handling ('latestPlayerAction') och visa hur kompanjonen och omgivningen reagerar.\n" +
        "2. Om du väljer 'interactionType' == 'choice' (och det inte är sista rundan):\n" +
        "   - Skapa 3 distinkta, logiska handlingsval i 'options' (id: 'A','B','C') som bygger vidare på den aktuella scenen.\n" +
        "   - Varje val måste ha 'traitTarget' (t.ex. gränssättning, tillit, pragmatism, handlingskraft).\n" +
        "   - Sätt 'freeTextPlaceholder' till null.\n" +
        "3. Om du väljer 'interactionType' == 'free_text' (och det inte är sista rundan):\n" +
        "   - Sätt 'options' till [].\n" +
        "   - Sätt 'freeTextPlaceholder' till en skarp, konkret fråga eller utmaning till spelaren i just detta ögonblick (t.ex. 'Vad svarar du när hen ifrågasätter ditt löfte?...').\n" +
        "4. 'roundSummary': Skriv 1-2 kompakta meningar som sammanfattar vad spelaren gjorde och vad som hände i DENNA runda (detta läggs till i slutet av krönikan inför nästa runda).\n" +
        "5. 'warning': Sätt ALLTID till 'NONE' vid normalt spel och i epilogen! Använd 'WARNING' ENDAST om spelaren i fritext skriver rent tangentbordsspam eller medvetet saboterar spelet.\n\n" +
        "JSON SCHEMA:\n" +
        "{\n" +
        '  "round": ' + nextRound + ',\n' +
        '  "narration": "...",\n' +
        '  "interactionType": "choice eller free_text",\n' +
        '  "options": [{"id": "A", "text": "...", "traitTarget": "..."}],\n' +
        '  "freeTextPlaceholder": null,\n' +
        '  "roundSummary": "...",\n' +
        '  "warning": "NONE"\n' +
        "}";

      try {
        const rawReply = await callGeminiDirect("flash", systemInstruction, [
          { role: "user", parts: [{ text: JSON.stringify(turnPayload) }] }
        ]);

        const parsed = JSON.parse(cleanJsonOutput(rawReply));

        // Skyddsspärr: Tillåt ALDRIG falska sabotage-larm på sista rundan eller när spelaren klickat på ett knappval!
        if (!isFinalEpilogue && !isButtonChoice) {
          if ((parsed.warning === "TERMINATE" || parsed.warning === "SABOTAGE_ABORT") && warningGiven) {
            alert("Sessionen avbröts på grund av upprepat fiktionssabotage.");
            leaveGame();
            return;
          } else if (parsed.warning === "WARNING" || parsed.warning === "TERMINATE" || parsed.warning === "SABOTAGE_ABORT") {
            if (!warningGiven) {
              warningGiven = true;
              document.getElementById("troll-modal").classList.add("active");
            }
          }
        }

        // Bygg på kontext-texten med ett par meningar för varje runda så att den röda tråden bevaras!
        const newAddition = (parsed.roundSummary || parsed.newWorldState || "").trim();
        if (newAddition) {
          currentWorldState = currentWorldState + "\n[Runda " + nextRound + " (Efter val: '" + actionText.slice(0, 60) + "')]: " + newAddition;
        }

        currentTurn = nextRound;
        appendMessageToUI("model", parsed.narration);
        document.getElementById("turn-indicator").innerText = "Runda " + currentTurn + " av " + activeScenario.maxTurns;

        recentHistory.push({
          round: currentTurn,
          gmNarration: parsed.narration,
          playerAction: null
        });
        if (recentHistory.length > 3) recentHistory.shift();

        allSessionHistory.push({
          round: currentTurn,
          gmNarration: parsed.narration,
          playingAs: (swapEnabled && activeScenario.maxTurns === 35 && currentTurn >= SWAP_ROUND) ? "KOMPANJONENS ROLL (efter twist)" : "EGEN ROLL",
          optionsOffered: null,
          playerAction: null,
          inputType: null,
          responseTimeSec: null,
          trait: null
        });

        if (currentTurn >= activeScenario.maxTurns) {
          finished = true;
          document.getElementById("turn-indicator").innerText = "Avslutat";
          document.getElementById("choice-container").style.display = "none";
          document.getElementById("freetext-container").style.display = "none";
          document.getElementById("epilogue-action").style.display = "block";
        } else {
          if (parsed.interactionType === "free_text" || !Array.isArray(parsed.options) || parsed.options.length === 0) {
            parsed.interactionType = "free_text";
            freeTextTurnsCount++;
          }
          const offGuardTurns = activeScenario.maxTurns === 16 ? [6, 12] : [10, 20];
          const moodLadderTurn = activeScenario.maxTurns === 16 ? 8 : 14;

          if (currentTurn === moodLadderTurn && typeof window.maybeTriggerColorFormMoodCheck === "function") {
            // Kontrollera mot Supabase INNAN momentet visas om användaren har gjort Färg/Form-stegen < 2 ggr
            window.maybeTriggerColorFormMoodCheck("Mitt i Rollspelet (Runda " + currentTurn + ")", () => {
              renderControls(parsed);
            });
          } else if (offGuardTurns.includes(currentTurn) && typeof window.triggerGlobalOffGuardDevil === "function") {
            const qObj = window.getNextUnansweredDevilQuestion(currentTurn);
            window.triggerGlobalOffGuardDevil(qObj, "Off-Guard under Rollspel (Runda " + currentTurn + ")", () => {
              renderControls(parsed);
            });
          } else {
            renderControls(parsed);
          }
        }
      } catch (err) {
        alert("Ett fel uppstod: " + err.message + "\nFörsök igen.");
      } finally {
        setBusy(false);
      }
    }

    function sendFreeTextTurn() {
      const inp = document.getElementById("user-input");
      const val = inp.value.trim();
      if (!val) return;
      inp.value = "";
      executeTurnEngine(val, "egen_formulering");
    }

    function openPostQuestions() {
      document.getElementById("post-q1").value = "";
      document.getElementById("post-q2").value = "";
      document.getElementById("post-q3").value = "";
      document.getElementById("post-q4").value = "";
      document.getElementById("post-q4-wrap").style.display = (swapEnabled && activeScenario && activeScenario.maxTurns === 35) ? "block" : "none";
      switchView("view-post-questions");
    }

    function finishAndAnalyze() {
      switchView("view-profile-result");
      runAnalysis();
    }

    async function runAnalysis() {
      const resultEl = document.getElementById("analysis-result");
      const retryBtn = document.getElementById("retry-btn");
      const proceedBtn = document.getElementById("proceed-btn");

      retryBtn.style.display = "none";
      proceedBtn.style.display = "none";
      resultEl.innerText = "Argon 4.0 sammanställer djupgående beteendeanalys baserat på dina vägval... Detta tar några sekunder.";

      const existingProfile = document.getElementById("profile-text").innerText.trim();
      const q1 = (document.getElementById("post-q1")?.value || "").trim();
      const q2 = (document.getElementById("post-q2")?.value || "").trim();
      const q3 = (document.getElementById("post-q3")?.value || "").trim();
      const q4 = (document.getElementById("post-q4")?.value || "").trim();
      const reflectionBlock = (q1 || q2 || q3 || q4)
        ? "\n\nSPELARENS EGNA REFLEKTIONER EFTER EPILOGEN:\n" +
          "- Upplevelse av samarbetet: " + (q1 || "(Ej angivet)") + "\n" +
          "- Svåraste/viktigaste beslutet: " + (q2 || "(Ej angivet)") + "\n" +
          "- Behov från en partner i verkligheten: " + (q3 || "(Ej angivet)") + (q4 ? "\n- Upplevelse av perspektivbytet (att spela kompanjonens roll): " + q4 : "")
        : "";

      const clarityMetrics = (typeof window.computeGlobalClarityMetrics === "function")
        ? window.computeGlobalClarityMetrics()
        : null;
      const devilBlock = (clarityMetrics && clarityMetrics.totalAnswered > 0)
        ? "\n\nOFF-GUARD DJÄVULSTEST (FASADINDEX & PROFILSKÄRPA):\n" +
          "- Beräknad Profilskärpa: " + clarityMetrics.profileClarityPct + "% (Helgonkvot/Halo: " + Math.round(clarityMetrics.haloRatio * 100) + "%, Snittlatens: " + clarityMetrics.avgLatencyMs + " ms)\n" +
          "- Enskilda Off-Guard-svar: " + JSON.stringify(window.globalDevilResponses) + "\n" +
          "VIKTIG ANALYSREGEL FÖR KONGRUENS: Jämför vad spelaren påstår om sig själv i Off-Guard-frågorna med hur spelaren faktiskt agerade i rollspelsrundorna! Om någon väljer helgonlika svar men agerar hårt eller själviskt i rollspelet, belys sakligt och varmt hur profilskärpan kan fördjupas (utan att kalla personen lögnare)."
        : "";

      const moodSynth = (typeof window.getMoodLadderSynthesisForArgon === "function")
        ? window.getMoodLadderSynthesisForArgon()
        : null;
      const moodBlock = moodSynth
        ? "\n\nPERSONLIG SYMBOLKOMPASS (FÄRG- & FORMSTEGE VID BRA VS DÅLIGT HUMÖR + KOHERENS):\n" +
          JSON.stringify(moodSynth, null, 2) + "\n" +
          "(Använd detta för att tolka hur personen reglerar affekt mellan bra och dåligt humör samt om personens inre kompass är koherent över tid)."
        : "";

      let systemPrompt = "";
      let userPrompt = "";

      if (existingProfile) {
        systemPrompt = "Du är Argon 4.0, en beteendeanalytiker (du är inte terapeut och ställer inga diagnoser).\n" +
          "Ditt uppdrag är att NYANSERA OCH FÖRDJUPA en redan etablerad beteendeprofil på SVENSKA med nya insikter från ett nyligen avklarat samarbetsäventyr.\n\n" +
          "UPPDRAGSREGLER:\n" +
          "1. Ersätt INTE profilen helt. Behåll de verifierade dragen och integrera hur deltagaren hanterade det nya scenariots specifika utmaning.\n" +
          "2. Väg faktiska handlingar tyngre än ord.\n" +
          "3. Strukturera på SVENSKA under exakt samma 7 rubriker:\n" +
          "1. Konflikthantering & Stressrespons\n" +
          "2. Samarbetsdynamik & Kontrollbehov\n" +
          "3. Emotionell lyhördhet & Bekräftelsemönster\n" +
          "4. Beslutsfattande under osäkerhet\n" +
          "5. Största relationsstyrka\n" +
          "6. Potentiell friktionsyta i ett partnerskap\n" +
          "7. Värderingar & livsåskådning (vad personen verkar prioritera när något måste offras)\n\n" +
          "Max 420 ord. Tonen ska vara varm, observant och psykologiskt skarp.";

        userPrompt = "TIDIGARE PROFIL:\n" + existingProfile + "\n\nNYTT SCENARIO (" + activeScenario.title + "):\nSamlade val och handlingar:\n" + JSON.stringify(allSessionHistory) + reflectionBlock + devilBlock + moodBlock;
      } else {
        systemPrompt = "Du är Argon 4.0, en beteendeanalytiker (du är inte terapeut och ställer inga diagnoser).\n" +
          'Analysera spelarens handlingar och kommunikation i äventyret "' + activeScenario.title + '" samt spelarens avslutande reflektioner.\n' +
          "Jämför gärna hur spelaren agerade i fiktionen med hur spelaren själv reflekterar kring samarbetet efteråt.\n" +
          "Formulera en saklig, varm och insiktsfull profil på SVENSKA under följande 7 punkter:\n" +
          "1. Konflikthantering & Stressrespons\n" +
          "2. Samarbetsdynamik & Kontrollbehov\n" +
          "3. Emotionell lyhördhet & Bekräftelsemönster\n" +
          "4. Beslutsfattande under osäkerhet\n" +
          "5. Största relationsstyrka\n" +
          "6. Potentiell friktionsyta i ett partnerskap\n" +
          "7. Värderingar & livsåskådning (vad personen verkar prioritera när något måste offras)\n\n" +
          "Max 400 ord. Undvik astrologi och floskler; förankra i spelarens konkreta val och reflektioner.";

        userPrompt = "Samlade val och handlingar:\n\n" + JSON.stringify(allSessionHistory) + reflectionBlock + devilBlock + moodBlock;
      }

      const swapNote = (swapEnabled && activeScenario && activeScenario.maxTurns === 35)
        ? "\n\nTWIST I DETTA SCENARIO: Från runda " + SWAP_ROUND + " spelade deltagaren sin kompanjons roll medan spelledaren styrde deltagarens ursprungliga karaktär (se 'playingAs'). Jämför före och efter: vad hänger kvar oavsett roll (sannolikt grundvärderingar) och vad ändras med rollen? Hur hanterar deltagaren att bemötas på samma sätt som hen själv bemött andra? Väg det som hänger kvar tyngst.\n"
        : "";
      systemPrompt += ANALYSIS_RULES + swapNote;

      const headingEl = document.getElementById("profile-result-heading");
      const qBox = document.getElementById("argon-queued-box");
      if (qBox) qBox.style.display = "none";
      if (headingEl) headingEl.innerText = "Din Profil sammanställs av Argon 4.0...";

      try {
        const analysis = await callGeminiDirect("argon", systemPrompt, [{ role: "user", parts: [{ text: userPrompt }] }]);
        if (headingEl) headingEl.innerText = "Din Profil har sammanställts";
        resultEl.innerText = analysis;
        window.latestProfile = analysis;
        proceedBtn.style.display = "block";
      } catch (err) {
        if (headingEl) headingEl.innerText = "⏳ Väntar på Argon 4.0 (Köad i bakgrunden)";
        resultEl.innerText = "Argon 4.0 svarade inte direkt (" + err.message + ").\n\nVi byter INTE ner oss till en enklare modell – ditt underlag har lagts i den automatiska Argon-kön.";
        enqueueArgonJob({
          type: "roleplay_profile",
          label: "Rollspelsprofil (" + (activeScenario ? activeScenario.title : "Äventyr") + ")",
          systemPrompt: systemPrompt,
          contents: [{ role: "user", parts: [{ text: userPrompt }] }]
        });
        if (qBox) qBox.style.display = "block";
      }
    }

    const MODULE_BADGE_Catalog = [
      { key: "base_roleplay", code: "GRUND", icon: "🎭", label: "Grundrollspel (16r)" },
      { key: "deep_resource", code: "MOD_A", icon: "⚔️", label: "Modul A: Resursbrist (35r)" },
      { key: "deep_conflict", code: "MOD_B", icon: "⚖️", label: "Modul B: Värdekonflikt (35r)" },
      { key: "deep_routine",  code: "MOD_C", icon: "☕", label: "Modul C: Vardagslunk (35r)" },
      { key: "swipe_test",    code: "SWIPE_360", icon: "🧭", label: "360° Vektorswipe & Självbild" },
      { key: "somatic_test",  code: "SOMATIK",   icon: "🏛️", label: "Somatisk & Taktil Projektion" },
      { key: "crm_test",      code: "CRM_LJUD",  icon: "🎧", label: "Psykoakustisk Ljudanalys (CRM)" },
      { key: "devil_test",    code: "SKARPA",    icon: "⚡", label: "Off-Guard Profilskärpa" },
      { key: "color_form_mood_test", code: "SYMBOL", icon: "🎨", label: "Symbolkompass (Humör & Koherens)" },
      { key: "test_voice",    code: "ROST_BILD", icon: "🎙️", label: "Röst-till-Bild Projektion" },
      { key: "test_photos",   code: "BILDER_3",  icon: "📷", label: "3 Verklighetsbilder" },
      { key: "test_memory",   code: "MINNE",     icon: "📝", label: "Minnesfråga (Vändpunkt)" }
    ];

    function stripModulesStampForDisplay(rawProfileText) {
      if (!rawProfileText) return "";
      const s = String(rawProfileText);
      const tagIdx = s.indexOf("[GENOMFÖRDA_MODULER:");
      return (tagIdx !== -1 ? s.substring(0, tagIdx) : s).trim();
    }

    function attachCompletedModulesStamp(rawProfileText) {
      if (!rawProfileText) return "";
      const cleanBase = stripModulesStampForDisplay(rawProfileText);
      const map = getAttemptsMap();
      const codes = ["GRUND"];
      MODULE_BADGE_Catalog.forEach(item => {
        if (item.code !== "GRUND" && Number(map[item.key] || 0) >= 1) {
          codes.push(item.code);
        }
      });
      if (cleanBase.indexOf("VISUELL KOMPASS") !== -1 && codes.indexOf("SWIPE_360") === -1) {
        codes.push("SWIPE_360");
      }
      return cleanBase + "\n\n[GENOMFÖRDA_MODULER: " + codes.join(",") + "]";
    }

    function extractCompletedModulesFromProfile(profileText, forsokData) {
      const done = new Set(["GRUND"]);
      const txt = String(profileText || "");
      const m = txt.match(new RegExp("\\[GENOMFÖRDA_MODULER:\\s*([^\\]]+)\\]"));
      if (m && m[1]) {
        m[1].split(",").forEach(c => {
          const clean = c.trim();
          if (clean) done.add(clean);
        });
      }
      if (txt.indexOf("VISUELL KOMPASS") !== -1) done.add("SWIPE_360");
      if (txt.indexOf("SOMATISK & TAKTIL POLARITET") !== -1) { done.add("SOMATIK"); done.add("CRM_LJUD"); done.add("SKARPA"); }
      if (forsokData && typeof forsokData === "object") {
        MODULE_BADGE_Catalog.forEach(item => {
          if (Number(forsokData[item.key] || 0) >= 1) done.add(item.code);
        });
      }
      return Array.from(done);
    }

    async function proceedToHub() {
      const proceedBtn = document.getElementById("proceed-btn");
      proceedBtn.disabled = true;
      proceedBtn.innerText = "Sparar i Supabase...";

      if (window.latestProfile && sessionData) {
        try {
          const existing = await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id + '&select=user_id', 'GET', null, sessionData.access_token);
          
          const stampedProfile = attachCompletedModulesStamp(window.latestProfile);
          if (existing && existing.length > 0) {
            await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
              profil_text: stampedProfile,
              godkand_for_matchning: true,
              frivilligt_kon: currentGender || null
            }, sessionData.access_token);
          } else {
            await supabaseRequest('/rest/v1/profiler', 'POST', {
              user_id: sessionData.user.id,
              profil_text: stampedProfile,
              godkand_for_matchning: true,
              frivilligt_kon: currentGender || null
            }, sessionData.access_token);
          }

          document.getElementById("profile-text").innerText = stripModulesStampForDisplay(stampedProfile);
        } catch (e) {
          alert("Kunde inte spara i databasen: " + e.message);
        }
      }

      proceedBtn.disabled = false;
      proceedBtn.innerText = "Spara i Valvet & Gå till Huvudsidan";
      window.latestProfile = null;
      switchView("view-hub");
    }
