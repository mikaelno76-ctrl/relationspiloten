    // =========================================================================
    // TVÅSPRÅKIGT STÖD (I18N) & 360° VEKTORSWIPE LAB
    // =========================================================================
    let currentAppLanguage = localStorage.getItem("rp_app_lang") || "sv";

    const DICTIONARY = {
      sv: {
        appSubtitle: "Beteendebaserad relationsmatchning via djupgående samarbetsrollspel.",
        btnLogin: "Logga in",
        btnRegister: "Skapa profil",
        btnDirectLab: "🔥 1. 360° Vektorswipe & Självbild",
        compassUp: "UPP: Tillit",
        compassRight: "HÖGER: Kemi / Gnista",
        compassDown: "NER: Varning / Risk",
        compassLeft: "VÄNSTER: Distans",
        btnRunSwipeArgon: "🧠 Låt Argon 4.0 analysera mina vektorer, hastigheter & självbild",
        btnConfirmElim: "Bekräfta gallring & Gå till Självbildsvalet ➔"
      },
      en: {
        appSubtitle: "Behavior-based matchmaking powered by interactive roleplay simulations.",
        btnLogin: "Sign In",
        btnRegister: "Create Profile",
        btnDirectLab: "🔥 1. 360° Vector Swipe & Self-Image",
        compassUp: "UP: Trust",
        compassRight: "RIGHT: Chemistry / Spark",
        compassDown: "DOWN: Warning / Risk",
        compassLeft: "LEFT: Distance",
        btnRunSwipeArgon: "🧠 Let Argon 4.0 Analyze My Vectors, Velocities & Self-Image",
        btnConfirmElim: "Confirm Elimination & Proceed to Self-Archetype ➔"
      }
    };

    function setAppLanguage(lang) {
      currentAppLanguage = lang;
      localStorage.setItem("rp_app_lang", lang);

      const btnSv = document.getElementById("lang-btn-sv");
      const btnEn = document.getElementById("lang-btn-en");
      if (btnSv && btnEn) {
        btnSv.className = "lang-btn" + (lang === "sv" ? " active" : "");
        btnEn.className = "lang-btn" + (lang === "en" ? " active" : "");
      }

      const t = DICTIONARY[lang] || DICTIONARY.sv;
      const subEl = document.querySelector("#view-auth p");
      if (subEl) subEl.textContent = t.appSubtitle;
      const bLog = document.getElementById("btn-login");
      if (bLog) bLog.textContent = t.btnLogin;
      const bReg = document.getElementById("btn-register");
      if (bReg) bReg.textContent = t.btnRegister;
      const bLab = document.getElementById("btn-direct-swipelab");
      if (bLab) bLab.textContent = t.btnDirectLab;

      const compassPoints = document.querySelectorAll(".compass-point");
      if (compassPoints.length >= 4) {
        compassPoints[0].innerHTML = '<span class="compass-dot dot-up"></span> ' + t.compassUp;
        compassPoints[1].innerHTML = '<span class="compass-dot dot-right"></span> ' + t.compassRight;
        compassPoints[2].innerHTML = '<span class="compass-dot dot-down"></span> ' + t.compassDown;
        compassPoints[3].innerHTML = '<span class="compass-dot dot-left"></span> ' + t.compassLeft;
      }

      const baseLangSel = document.getElementById("base-lang-select");
      const deepLangSel = document.getElementById("deep-lang-select");
      if (lang === "en") {
        if (baseLangSel) baseLangSel.value = "Engelska (English)";
        if (deepLangSel) deepLangSel.value = "Engelska (English)";
        activeLanguage = "Engelska (English)";
      } else {
        if (baseLangSel) baseLangSel.value = "Svenska";
        if (deepLangSel) deepLangSel.value = "Svenska";
        activeLanguage = "Svenska";
      }

      const bArgon = document.getElementById("btn-run-swipe-argon");
      if (bArgon) bArgon.textContent = t.btnRunSwipeArgon;
      const bConfirm = document.getElementById("btn-confirm-elim");
      if (bConfirm) bConfirm.textContent = t.btnConfirmElim;
    }

    const ARCHETYPE_DECKS = {
      ONBOARDING: {
        badge: "Övningsrond: Kalibrering & Kontraster",
        title: "Känner du skillnad på fasad och äkta närvaro?",
        desc: "Starka kontraster som kalibrerar ditt nervsystem innan de skarpa ronderna.",
        cards: [
        {
                "id": "X1",
                "filename": "x1.jpg",
                "name": "X1: Isdrottningen",
                "trait": "Kylig symmetri / Fientlig dominans / Falskt leende"
        },
        {
                "id": "X2",
                "filename": "x2.jpg",
                "name": "X2: Den skrovliga tryggheten",
                "trait": "Hög asymmetri / Maximal värme / Genuin ömhet"
        },
        {
                "id": "X3",
                "filename": "x3.jpg",
                "name": "X3: Den kalkylerande psykopaten",
                "trait": "Attraktiv fasad / Stirrande blick / Maskerad aggression"
        },
        {
                "id": "X4",
                "filename": "x4.jpg",
                "name": "X4: Den ödmjuka omsorgen",
                "trait": "Okonventionell / Ren empati / Total sårbarhet"
        },
        {
                "id": "X5",
                "filename": "x5.jpg",
                "name": "X5: Det kyliga föraktet",
                "trait": "Androgyn perfektion / Extrem arrogans / Social avvisning"
        },
        {
                "id": "X6",
                "filename": "x6.jpg",
                "name": "X6: Den anspråkslöse försonaren",
                "trait": "Trött vardaglighet / Noll ego / Förlåtande värme"
        }
]
      },
      A: {
        badge: "Rond A: Social tillit & kemi (16 arketyper)",
        title: "Vem vill du fika, äta lunch eller samarbeta med?",
        desc: "Fokus på vardagstillit, värme, intellektuell skärpa och samarbetskemi.",
        cards: [
        {
                "id": "A1",
                "filename": "a1.jpg",
                "name": "A1: Den aktiva lyssnaren",
                "trait": "Hög värme & empati / Låg dominans"
        },
        {
                "id": "A2",
                "filename": "a2.jpg",
                "name": "A2: Den pragmatiska klippan",
                "trait": "Hög samvetsgrannhet / Lugn kompetens & struktur"
        },
        {
                "id": "A3",
                "filename": "a3.jpg",
                "name": "A3: Den kvicktänkte analytikern",
                "trait": "Intellektuell skärpa / Torr humor / Eftertänksam"
        },
        {
                "id": "A4",
                "filename": "a4.jpg",
                "name": "A4: Den spontana speglaren",
                "trait": "Hög humor / Lekfull kemi / Duchenne-leende"
        },
        {
                "id": "A5",
                "filename": "a5.jpg",
                "name": "A5: Den jordade tryggheten",
                "trait": "Icke-dömande acceptans / Kravlös samvaro"
        },
        {
                "id": "A6",
                "filename": "a6.jpg",
                "name": "A6: Den lugne iakttagaren",
                "trait": "Reserverad integritet / Låg reaktivitet / Tyst förståelse"
        },
        {
                "id": "A7",
                "filename": "a7.jpg",
                "name": "A7: Den inkluderande katalysatorn",
                "trait": "Social generositet / Varm dominans / Ledande empati"
        },
        {
                "id": "A8",
                "filename": "a8.jpg",
                "name": "A8: Den diskreta diplomaten",
                "trait": "Mjuk integritet / Gränsrespekt / Taktfullhet"
        },
        {
                "id": "A9",
                "filename": "a9.jpg",
                "name": "A9: Den avväpnande skeptikern",
                "trait": "Kritisk rationalitet / Bullshit-detektor / Torr värme"
        },
        {
                "id": "A10",
                "filename": "a10.jpg",
                "name": "A10: Det tålmodiga ankaret",
                "trait": "Hög tålamodströskel / Lugn buffert / Uthållighet"
        },
        {
                "id": "A11",
                "filename": "a11.jpg",
                "name": "A11: Den sårbara optimisten",
                "trait": "Öppen hjärtlighet / Ren tillit / Noll cynism"
        },
        {
                "id": "A12",
                "filename": "a12.jpg",
                "name": "A12: Den metodiske problemlösaren",
                "trait": "Systematiskt tänkande / Pålitlig ordning / Fast blick"
        },
        {
                "id": "A13",
                "filename": "a13.jpg",
                "name": "A13: Den skarpsynta mentorn",
                "trait": "Vänlig auktoritet / Djup visdom / Låg prestige"
        },
        {
                "id": "A14",
                "filename": "a14.jpg",
                "name": "A14: Den jordnära hantverkaren",
                "trait": "Avskalad autenticitet / Ärlig realism / Opretentiös"
        },
        {
                "id": "A15",
                "filename": "a15.jpg",
                "name": "A15: Det orubbliga lugnet",
                "trait": "Extrem emotionell stabilitet / Trygghetsbas utan drama"
        },
        {
                "id": "A16",
                "filename": "a16.jpg",
                "name": "A16: Den nyfikne samtalaren",
                "trait": "Hög social öppenhet / Relationsbyggande & snabb kemi"
        }
]
      },
      B: {
        badge: "Rond B: Romantisk attraktion & gnista (16 arketyper)",
        title: "Vem känner du en spontan dragningskraft till?",
        desc: "Romantisk laddning, sensualitet, sårbarhet, 'bedroom eyes' och magnetisk spänning.",
        cards: [
        {
                "id": "B1",
                "filename": "b1.jpg",
                "name": "B1: Den magnetiska blicken",
                "trait": "Lugnt självförtroende / Tyst sexuell magnetism"
        },
        {
                "id": "B2",
                "filename": "b2.jpg",
                "name": "B2: Den självsäkra utmanaren",
                "trait": "Romantisk lekfullhet / Karismatisk pondus / Flirtig"
        },
        {
                "id": "B3",
                "filename": "b3.jpg",
                "name": "B3: Den intima sårbarheten",
                "trait": "Emotionell tillgänglighet / Mjuk sensualitet / Ömhet"
        },
        {
                "id": "B4",
                "filename": "b4.jpg",
                "name": "B4: Den gåtfulla förföraren",
                "trait": "Mörk sensualitet / Reserverad laddning / Intensitet"
        },
        {
                "id": "B5",
                "filename": "b5.jpg",
                "name": "B5: Den omedelbara gnistan",
                "trait": "Spontan sexuell kemi / Fysisk glädje / Puls"
        },
        {
                "id": "B6",
                "filename": "b6.jpg",
                "name": "B6: Den lugne förföraren",
                "trait": "Mogen sexuell trygghet / Stabil närvaro utan spel"
        },
        {
                "id": "B7",
                "filename": "b7.jpg",
                "name": "B7: Den introverta intensiteten",
                "trait": "Djupt emotionellt fokus / Sensuell återhållsamhet"
        },
        {
                "id": "B8",
                "filename": "b8.jpg",
                "name": "B8: Den lekfulla utmanaren",
                "trait": "Flirtig överlägsenhet / Skarp charm / Spontan attraktion"
        },
        {
                "id": "B9",
                "filename": "b9.jpg",
                "name": "B9: Den lågmälda retstickan",
                "trait": "Romantisk spänning / Underfundig flirt / Kontroll"
        },
        {
                "id": "B10",
                "filename": "b10.jpg",
                "name": "B10: Den elektriska blicken",
                "trait": "Hög fysisk laddning / Orädd intimitet / Rak dragningskraft"
        },
        {
                "id": "B11",
                "filename": "b11.jpg",
                "name": "B11: Den tysta hängivenheten",
                "trait": "Mjuk sårbarhet / Tyst dyrkan / Emotionell resonans"
        },
        {
                "id": "B12",
                "filename": "b12.jpg",
                "name": "B12: Den eldiga provokatören",
                "trait": "Hög passion / Varm dominans / Gnistrande utmaning"
        },
        {
                "id": "B13",
                "filename": "b13.jpg",
                "name": "B13: Den världsvana förföraren",
                "trait": "Självsäker elegans / Avspänd sensualitet / Hög status"
        },
        {
                "id": "B14",
                "filename": "b14.jpg",
                "name": "B14: Den råa närvaron",
                "trait": "Maskulin rå magnetism / Direkt opolerad kemi"
        },
        {
                "id": "B15",
                "filename": "b15.jpg",
                "name": "B15: Den drömmande romantikern",
                "trait": "Poetisk känslighet / Öppen längtan / Mjukhet"
        },
        {
                "id": "B16",
                "filename": "b16.jpg",
                "name": "B16: Den magnetiska gåtan",
                "trait": "Feminin mystik / Dämpad hetta / Svåråtkomlig sensualitet"
        }
]
      },
      C: {
        badge: "Rond C: Spänning & Mytologiska väsen (11 arketyper)",
        title: "Vad dras ditt nervsystem till när garden sänks?",
        desc: "Skogsrået, Trickstern, Alven, Hamnskiftaren, Näcken och Oraklet.",
        cards: [
        {
                "id": "C1",
                "filename": "c1.jpg",
                "name": "C1: Skogsrået / Sirenen",
                "trait": "Hög magnetism / Låg transparens / Förförelse med risk"
        },
        {
                "id": "C2",
                "filename": "c2.jpg",
                "name": "C2: Trickstern / Vätten",
                "trait": "Oberäkneligt kaos / Otämjd lekfullhet / Gränsutmanande"
        },
        {
                "id": "C3",
                "filename": "c3.jpg",
                "name": "C3: Den eteriska / Alven",
                "trait": "Eterisk skönhet / Sval distans / Ouppnåelig renhet"
        },
        {
                "id": "C4",
                "filename": "c4.jpg",
                "name": "C4: Hamnskiftaren / Rovdjuret",
                "trait": "Mörk dominans / Rå kraft / Skräck vs dragningskraft"
        },
        {
                "id": "C5",
                "filename": "c5.jpg",
                "name": "C5: Oraklet / Mystikern",
                "trait": "Intuitiv kyla / Ogenomtränglighet / Slöjad visdom"
        },
        {
                "id": "C6",
                "filename": "c6.jpg",
                "name": "C6: Skuggan / Den sårade hämnaren",
                "trait": "Undvikande anknytning / Förhöjd vaksamhet / Mörk karisma"
        },
        {
                "id": "C7",
                "filename": "c7.jpg",
                "name": "C7: Den arketypiska oskulden",
                "trait": "Ren tillit / Ljusbärare / Kravlös trygghet"
        },
        {
                "id": "C8",
                "filename": "c8.jpg",
                "name": "C8: Näcken / Den melankoliske förföraren",
                "trait": "Melankolisk magnetism / Emotionell avgrund / Farlig längtan"
        },
        {
                "id": "C9",
                "filename": "c9.jpg",
                "name": "C9: Valkyrian / Beskyddaren",
                "trait": "Suverän makt / Ädel distans / Orubblig trygghet"
        },
        {
                "id": "C10",
                "filename": "c10.jpg",
                "name": "C10: Skogsväktaren / Urkraften",
                "trait": "Primalt lugn / Arkaisk ro / Tidlös stabilitet"
        },
        {
                "id": "C11",
                "filename": "c11.jpg",
                "name": "C11: Månskensväsenet / Gåtan",
                "trait": "Hypnotisk kyla / Nattlig dragningskraft / Slöjad närvaro"
        }
]
      },
      D: {
        badge: "Rond D: Det övernaturliga spektrumet (12 arketyper)",
        title: "Hajar du till när förväntan krockar med uttryck?",
        desc: "Bergtrollets gråtande ömhet, orkens tår, rovdjursälvan och demonens vardagströtthet.",
        cards: [
        {
                "id": "D1",
                "filename": "d1.jpg",
                "name": "D1: Bergtrollets ömhet",
                "trait": "Grov trollfysionomi möter bottenlös, rörande hjärtevärme"
        },
        {
                "id": "D2",
                "filename": "d2.jpg",
                "name": "D2: Den skurna älvan",
                "trait": "Älva med grova ärr & en kylig rovdjursblick"
        },
        {
                "id": "D3",
                "filename": "d3.jpg",
                "name": "D3: Vättens melankoli",
                "trait": "Knotig underjordisk varelse fylld av existentiell tyst visdom"
        },
        {
                "id": "D4",
                "filename": "d4.jpg",
                "name": "D4: Skogsråets tomrum",
                "trait": "Perfekt yttre skönhet / Iskall uncanny-valley tomhet"
        },
        {
                "id": "D5",
                "filename": "d5.jpg",
                "name": "D5: Den helige gargoylen",
                "trait": "Stenväktare med brett leende av ren faderlig beskyddarinstinkt"
        },
        {
                "id": "D6",
                "filename": "d6.jpg",
                "name": "D6: Sirenen under ytan",
                "trait": "Amfibiska bleka drag smälter samman med sensuell intimitet"
        },
        {
                "id": "D7",
                "filename": "d7.jpg",
                "name": "D7: Orksoldatens hemliga tår",
                "trait": "Brutal stridsärrad krigare med en tår av djup sårbarhet"
        },
        {
                "id": "D8",
                "filename": "d8.jpg",
                "name": "D8: Sjökungens melankoli",
                "trait": "Fjällmönstrad aristokrat med uråldrig dämpad sorg"
        },
        {
                "id": "D9",
                "filename": "d9.jpg",
                "name": "D9: Skogsspegelns bedrägeri",
                "trait": "Flytande kvicksilverskinn / Känslokall men oemotståndlig"
        },
        {
                "id": "D10",
                "filename": "d10.jpg",
                "name": "D10: Demonens trötta gäspning",
                "trait": "Mörka horn möter en uttråkad vardaglighet som vill ha kaffe"
        },
        {
                "id": "D11",
                "filename": "d11.jpg",
                "name": "D11: Vildmarkens dotter (Vargen)",
                "trait": "Fina vargdrag med ett intensivt, lojalt flock-leende"
        },
        {
                "id": "D12",
                "filename": "d12.jpg",
                "name": "D12: Stjärnfararens leende",
                "trait": "Främmande utomjordiska proportioner med gränslös kosmisk värme"
        }
]
      }
    };

    let activeRoundKey = "A";
    let labDeck = [...ARCHETYPE_DECKS.A.cards];
    let customUploadedCards = [];
    let labIndex = 0;
    let swipeTelemetryHistory = [];
    let eliminatedIds = new Set();
    let selfSelectedOrder = [];

    let cardShownTimestamp = 0;
    let touchStartTimestamp = 0;
    let labDragging = false;
    let labStartX = 0;
    let labStartY = 0;
    let labCurrX = 0;
    let labCurrY = 0;
    let directionChanges = 0;
    let lastQuadrant = null;

    let supabaseBucketSynced = false;

    async function syncSupabaseArketyper() {
      if (supabaseBucketSynced) return;
      const bucketBase = SUPABASE_URL + "/storage/v1/object/public/arketyper/";
      const prefixesToCheck = ["", "Untitled folder"];
      const allDecks = ["ONBOARDING", "A", "B", "C", "D"];
      let totalMatched = 0;

      for (let pIdx = 0; pIdx < prefixesToCheck.length; pIdx++) {
        const prefix = prefixesToCheck[pIdx];
        try {
          const res = await fetch(SUPABASE_URL + "/storage/v1/object/list/arketyper", {
            method: "POST",
            headers: {
              "apikey": SUPABASE_ANON_KEY,
              "Authorization": "Bearer " + SUPABASE_ANON_KEY,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ prefix: prefix, limit: 300, offset: 0 })
          });
          if (!res.ok) continue;
          const items = await res.json();
          if (!Array.isArray(items)) continue;

          items.forEach(fileObj => {
            if (!fileObj || !fileObj.name || fileObj.name === ".emptyFolderPlaceholder") return;
            const cleanBase = fileObj.name.replace(/\.[^/.]+$/, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
            const normId = cleanBase.replace(/^([A-Z])0+(\d+)$/, "$1$2");
            const folderPath = prefix ? (encodeURIComponent(prefix) + "/") : "";
            const fullUrl = bucketBase + folderPath + encodeURIComponent(fileObj.name);

            allDecks.forEach(dKey => {
              if (!ARCHETYPE_DECKS[dKey]) return;
              ARCHETYPE_DECKS[dKey].cards.forEach(card => {
                if (card.id.toUpperCase() === normId && !card.blobUrl) {
                  card.resolvedUrl = fullUrl;
                  totalMatched++;
                }
              });
            });
          });
        } catch (err) {
          console.warn("Supabase Storage listning varning:", err);
        }
      }

      if (totalMatched > 0) {
        supabaseBucketSynced = true;
        const statusSpan = document.getElementById("local-files-status");
        if (statusSpan) {
          statusSpan.style.color = "#6ee7b7";
          statusSpan.textContent = "✅ " + totalMatched + " arketypbilder hittades automatiskt i Supabase Storage (arketyper)!";
        }
      }
    }

    function openSwipeLab() {
      syncSupabaseArketyper();
      document.body.classList.remove("swipe-locked");
      switchView("view-swipe-lab");
      document.getElementById("swipe-step-intro").style.display = "block";
      document.getElementById("swipe-step-arena").classList.remove("active");
      document.getElementById("swipe-step-elimination").style.display = "none";
      document.getElementById("swipe-step-self").style.display = "none";
    }

    function startLockedSwipeSession() {
      if (getModuleAttempts("swipe_test") >= 1) {
        alert("Du har redan genomfört 360°-vektorswipen (endast 1 försök gäller för detta test).");
        return;
      }
      swipeTelemetryHistory = [];
      eliminatedIds.clear();
      selfSelectedOrder = [];
      document.getElementById("swipe-step-intro").style.display = "none";
      document.getElementById("swipe-step-elimination").style.display = "none";
      document.getElementById("swipe-step-self").style.display = "none";
      document.getElementById("swipe-step-arena").classList.add("active");
      document.body.classList.add("swipe-locked");
      setSwipeRound("ONBOARDING");
    }

    function closeLockedSwipeToIntro() {
      document.body.classList.remove("swipe-locked");
      document.getElementById("swipe-step-arena").classList.remove("active");
      document.getElementById("swipe-step-elimination").style.display = "none";
      document.getElementById("swipe-step-self").style.display = "none";
      document.getElementById("swipe-step-intro").style.display = "block";
    }

    function exitSwipeLab() {
      document.body.classList.remove("swipe-locked");
      document.getElementById("swipe-step-arena").classList.remove("active");
      if (enteredFromTaxiMenu) {
        switchView("view-taxi-menu");
      } else if (sessionData && document.getElementById("profile-text").innerText.trim()) {
        switchView("view-hub");
      } else {
        switchView("view-auth");
      }
    }

    function setSwipeRound(roundKey) {
      activeRoundKey = roundKey;
      const cfg = ARCHETYPE_DECKS[roundKey] || ARCHETYPE_DECKS.A;
      document.getElementById("swipe-round-badge").innerText = cfg.badge;
      document.getElementById("swipe-phase-title").innerText = cfg.title;
      document.getElementById("swipe-phase-desc").innerText = cfg.desc;

      labDeck = customUploadedCards.length > 0 ? [...customUploadedCards] : [...cfg.cards];
      labIndex = 0;
      const activeEl = document.getElementById("lab-card-active");
      const nextEl = document.getElementById("lab-card-next");
      activeEl.style.display = "block";
      nextEl.style.display = "block";
      loadLabCard(0);
    }

    function loadLabCard(idx) {
      const activeEl = document.getElementById("lab-card-active");
      const pill = document.getElementById("lab-emotion-pill");
      const speedPill = document.getElementById("lab-speed-pill");

      if (idx >= labDeck.length) {
        if (activeRoundKey === "ONBOARDING") {
          setSwipeRound("A");
          return;
        } else if (activeRoundKey === "A") {
          setSwipeRound("B");
          return;
        } else if (activeRoundKey === "B") {
          setSwipeRound("C");
          return;
        } else if (activeRoundKey === "C") {
          setSwipeRound("D");
          return;
        } else {
          openForcedElimination();
          return;
        }
      }

      const item = labDeck[idx];
      document.getElementById("lab-card-title").innerText = item.name;
      document.getElementById("lab-card-trait").innerText = item.trait;
      document.getElementById("lab-card-counter").innerText = (idx + 1) + " / " + labDeck.length;

      activeEl.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
      activeEl.style.transform = "translate3d(0,0,0) rotate(0deg)";
      activeEl.style.boxShadow = "0 12px 30px rgba(0,0,0,0.55)";
      pill.classList.remove("visible");
      speedPill.innerText = "⏱️ Mäter reaktionstid...";

      cardShownTimestamp = performance.now();
      directionChanges = 0;
      lastQuadrant = null;

      const imgEl = document.getElementById("lab-card-img");
      const fbEl = document.getElementById("lab-card-fallback");
      const fbFile = document.getElementById("lab-fallback-file");

      if (item.blobUrl || item.resolvedUrl) {
        imgEl.onload = null;
        imgEl.onerror = null;
        imgEl.src = item.blobUrl || item.resolvedUrl;
        imgEl.style.display = "block";
        fbEl.style.display = "none";
      } else {
        const baseName = item.filename.replace(/\.[^/.]+$/, "");
        const low = baseName.toLowerCase();
        const up = baseName.toUpperCase();
        const padLow = low.replace(/^([a-z])(\d)$/, "$10$2");
        const padUnderLow = low.replace(/^([a-z])(\d+)$/, "$1_$2");
        const padZeroUnderLow = low.replace(/^([a-z])(\d)$/, "$1_0$2");
        const padZeroUnderUp = up.replace(/^([A-Z])(\d)$/, "$1_0$2");

        const rawCandidates = [];
        const bases = [low, up, padLow, padUnderLow, padZeroUnderLow, padZeroUnderUp];
        const exts = [".jfif", ".jpg", ".jpeg", ".png", ".webp", ".JFIF", ".JPG", ".JPEG", ".PNG", ".WEBP"];
        const folders = [
          SUPABASE_URL + "/storage/v1/object/public/arketyper/",
          SUPABASE_URL + "/storage/v1/object/public/arketyper/Untitled%20folder/",
          "",
          "images/",
          "bilder/",
          "img/",
          "assets/"
        ];

        folders.forEach(folder => {
          bases.forEach(b => {
            exts.forEach(ext => {
              rawCandidates.push(folder + b + ext);
            });
          });
        });

        const candidates = Array.from(new Set(rawCandidates));
        let attemptIdx = 0;

        imgEl.style.display = "none";
        fbEl.style.display = "flex";
        fbFile.innerText = "Laddar " + item.id.toLowerCase() + "...";

        function tryNextCandidate() {
          if (attemptIdx >= candidates.length) {
            imgEl.style.display = "none";
            fbEl.style.display = "flex";
            fbFile.innerText = item.filename + " (Hittades ej)";
            return;
          }
          const nextUrl = candidates[attemptIdx++];
          imgEl.onload = () => {
            item.resolvedUrl = nextUrl;
            imgEl.style.display = "block";
            fbEl.style.display = "none";
          };
          imgEl.onerror = () => {
            tryNextCandidate();
          };
          imgEl.src = nextUrl;
        }
        tryNextCandidate();
      }
    }

    function compute360Vector(dx, dy) {
      const dist = Math.hypot(dx, dy);
      const intensity = Math.min(dist / 150, 1.0);
      const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;

      let label = "";
      let hue = 0;
      let positivePool = false;

      if (angle >= 245 && angle < 295) {
        label = "🌱 Ren Tillit & Trygghet (Norr)";
        hue = 135;
        positivePool = true;
      } else if (angle >= 295 && angle < 340) {
        label = "💛 Trygg Förälskelse / Partnerpotential (Nordost)";
        hue = 45;
        positivePool = true;
      } else if (angle >= 340 || angle < 25) {
        label = "🔥 Stark Kemi & Attraktion (Öster)";
        hue = 10;
        positivePool = true;
      } else if (angle >= 25 && angle < 70) {
        label = "⚡ Farlig Attraktion / 'Isdrottning' (Sydost)";
        hue = 325;
        positivePool = true;
      } else if (angle >= 70 && angle < 115) {
        label = "⚠️ Obehag / Varningssignal (Söder)";
        hue = 275;
        positivePool = false;
      } else if (angle >= 115 && angle < 160) {
        label = "🧊 Instinktiv Avsmak / Nej (Sydväst)";
        hue = 240;
        positivePool = false;
      } else if (angle >= 160 && angle < 205) {
        label = "❄️ Neutral / Ingen Gnista (Väster)";
        hue = 205;
        positivePool = false;
      } else {
        label = "🤝 Trygg Vänzon / Kollega (Nordväst)";
        hue = 170;
        positivePool = true;
      }

      return { dist, intensity, angle, label, hue, positivePool };
    }

    function initSwipeListeners() {
      const cardEl = document.getElementById("lab-card-active");
      const pill = document.getElementById("lab-emotion-pill");
      const speedPill = document.getElementById("lab-speed-pill");
      if (!cardEl) return;

      function startDrag(e) {
        if (labIndex >= labDeck.length) return;
        labDragging = true;
        touchStartTimestamp = performance.now();
        const pt = e.touches ? e.touches[0] : e;
        labStartX = pt.clientX;
        labStartY = pt.clientY;
        cardEl.style.transition = "none";
      }

      function moveDrag(e) {
        if (!labDragging) return;
        if (e.cancelable) e.preventDefault();
        const pt = e.touches ? e.touches[0] : e;
        labCurrX = pt.clientX - labStartX;
        labCurrY = pt.clientY - labStartY;

        const info = compute360Vector(labCurrX, labCurrY);
        const rot = labCurrX / 18;
        cardEl.style.transform = "translate3d(" + labCurrX + "px, " + labCurrY + "px, 0) rotate(" + rot + "deg)";

        if (info.dist > 28) {
          const quad = Math.floor(info.angle / 90);
          if (lastQuadrant !== null && lastQuadrant !== quad) {
            directionChanges++;
          }
          lastQuadrant = quad;

          const elapsedDrag = Math.max(1, performance.now() - touchStartTimestamp);
          const liveSpeed = (info.dist / elapsedDrag).toFixed(2);
          speedPill.innerText = "⚡ " + liveSpeed + " px/ms | Vinkel: " + Math.round(info.angle) + "°";

          const alpha = Math.min(info.intensity * 0.85, 0.8);
          const blur = Math.round(16 + info.intensity * 26);
          cardEl.style.boxShadow = "0 10px " + blur + "px hsla(" + info.hue + ", 90%, 55%, " + alpha + ")";
          pill.innerText = info.label;
          pill.style.borderColor = "hsl(" + info.hue + ", 90%, 55%)";
          pill.classList.add("visible");
        } else {
          cardEl.style.boxShadow = "0 12px 30px rgba(0,0,0,0.55)";
          pill.classList.remove("visible");
        }
      }

      function endDrag() {
        if (!labDragging) return;
        labDragging = false;
        const info = compute360Vector(labCurrX, labCurrY);

        if (info.dist > 100) {
          const now = performance.now();
          const decisionLatencyMs = Math.round(touchStartTimestamp - cardShownTimestamp);
          const dragDurationMs = Math.max(1, Math.round(now - touchStartTimestamp));
          const velocityPxPerMs = Number((info.dist / dragDurationMs).toFixed(2));

          let confidenceStyle = "BALANCED";
          if (velocityPxPerMs >= 1.2 && decisionLatencyMs < 900 && directionChanges === 0) {
            confidenceStyle = "BLIXTSNABB_IMPULS (Reptilhjärna/Säker)";
          } else if (decisionLatencyMs > 2200 || directionChanges >= 2 || velocityPxPerMs < 0.35) {
            confidenceStyle = "TVEKANDE_AMBIVALENT (Inre konflikt)";
          }

          const rad = info.angle * Math.PI / 180;
          const flyX = Math.cos(rad) * 600;
          const flyY = Math.sin(rad) * 600;

          cardEl.style.transition = "transform 0.32s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.32s ease";
          cardEl.style.transform = "translate3d(" + flyX + "px, " + flyY + "px, 0) rotate(" + (flyX / 15) + "deg)";
          cardEl.style.opacity = "0";

          const currentItem = labDeck[labIndex];
          const record = {
            round: activeRoundKey,
            id: currentItem.id,
            name: currentItem.name,
            trait: currentItem.trait,
            filename: currentItem.filename,
            blobUrl: currentItem.blobUrl || currentItem.resolvedUrl || null,
            angle: Math.round(info.angle),
            emotion: info.label,
            positivePool: info.positivePool,
            decisionLatencyMs: decisionLatencyMs,
            dragDurationMs: dragDurationMs,
            velocityPxPerMs: velocityPxPerMs,
            directionChanges: directionChanges,
            confidenceStyle: confidenceStyle
          };

          swipeTelemetryHistory.push(record);
          logSwipeTelemetryUI(record);

          setTimeout(() => {
            labIndex++;
            cardEl.style.opacity = "1";
            loadLabCard(labIndex);
          }, 280);
        } else {
          cardEl.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease";
          cardEl.style.transform = "translate3d(0,0,0) rotate(0deg)";
          cardEl.style.boxShadow = "0 12px 30px rgba(0,0,0,0.55)";
          pill.classList.remove("visible");
        }

        labCurrX = 0;
        labCurrY = 0;
      }

      cardEl.addEventListener("touchstart", startDrag, { passive: true });
      window.addEventListener("touchmove", moveDrag, { passive: false });
      window.addEventListener("touchend", endDrag);
      cardEl.addEventListener("mousedown", startDrag);
      window.addEventListener("mousemove", moveDrag);
      window.addEventListener("mouseup", endDrag);
    }

    function logSwipeTelemetryUI(rec) {
      const logBox = document.getElementById("lab-telemetry-log");
      const countEl = document.getElementById("lab-telemetry-count");
      countEl.innerText = swipeTelemetryHistory.length + " svep loggade";

      if (swipeTelemetryHistory.length === 1) logBox.innerHTML = "";
      const row = document.createElement("div");
      row.style.cssText = "padding:5px 8px; background:#161b22; border-radius:4px; border-left:3px solid #38bdf8;";
      row.innerHTML = "<strong>" + rec.id + "</strong> (" + rec.trait + ")<br>" +
        "↳ Riktning: " + rec.emotion + " (" + rec.angle + "°)<br>" +
        "↳ Betänketid: <strong>" + rec.decisionLatencyMs + " ms</strong> | Hastighet: <strong>" + rec.velocityPxPerMs + " px/ms</strong> | Status: <span style='color:#fde68a;'>" + rec.confidenceStyle + "</span>";
      logBox.insertBefore(row, logBox.firstChild);
    }

    function openForcedElimination() {
      document.body.classList.remove("swipe-locked");
      document.getElementById("swipe-step-intro").style.display = "none";
      document.getElementById("swipe-step-arena").classList.remove("active");
      document.getElementById("swipe-step-self").style.display = "none";
      document.getElementById("swipe-step-elimination").style.display = "block";
      document.getElementById("swipe-round-badge").innerText = "Steg 2 av 3: Tvingad gallring";
      document.getElementById("swipe-phase-title").innerText = "Gallra bort 3 av dina positiva val";
      document.getElementById("swipe-phase-desc").innerText = "Vilka uttryck prioriterar du bort när du inte får behålla alla?";

      eliminatedIds.clear();
      const grid = document.getElementById("elimination-grid");
      grid.innerHTML = "";

      let positiveItems = swipeTelemetryHistory.filter(r => r.positivePool);
      if (positiveItems.length === 0) {
        positiveItems = [...ARCHETYPE_DECKS.A.cards, ...ARCHETYPE_DECKS.B.cards];
      }

      const targetRemove = Math.min(3, Math.max(1, positiveItems.length - 1));
      document.getElementById("elim-counter-text").innerText = "Valda att gallra bort: 0 av " + targetRemove;

      positiveItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "grid-item-card";
        div.innerHTML = '<div style="height:100px; background:#090d13; display:flex; align-items:center; justify-content:center; overflow:hidden;">' +
          ('<img src="' + (item.blobUrl || item.resolvedUrl || (SUPABASE_URL + '/storage/v1/object/public/arketyper/' + item.id.toLowerCase() + '.jfif')) + '" onerror="const sb=\'' + SUPABASE_URL + '/storage/v1/object/public/arketyper/' + item.id.toLowerCase() + '\'; if(!this.dataset.t1){this.dataset.t1=1;this.src=sb+\'.jpg\';}else if(!this.dataset.t2){this.dataset.t2=1;this.src=sb+\'.png\';}else if(!this.dataset.t3){this.dataset.t3=1;this.src=sb+\'.webp\';}else if(!this.dataset.t4){this.dataset.t4=1;this.src=\'' + item.id.toLowerCase() + '.jfif\';}else if(!this.dataset.t5){this.dataset.t5=1;this.src=\'' + item.id.toLowerCase() + '.jpg\';}else{this.style.display=\'none\';this.parentNode.innerHTML=\'<span style=font-size:1.6rem;>👤</span>\';}" style="width:100%; height:100%; object-fit:cover;">') +
          '</div>' +
          '<div style="padding:8px;">' +
          '<strong style="font-size:0.8rem; color:#fff; display:block;">' + item.name + '</strong>' +
          '<span style="font-size:0.7rem; color:#38bdf8;">' + item.trait + '</span>' +
          '</div>';

        div.addEventListener("click", () => {
          if (eliminatedIds.has(item.id)) {
            eliminatedIds.delete(item.id);
            div.classList.remove("eliminated");
            const badge = div.querySelector(".grid-elim-badge");
            if (badge) badge.remove();
          } else {
            if (eliminatedIds.size >= targetRemove) return;
            eliminatedIds.add(item.id);
            div.classList.add("eliminated");
            const b = document.createElement("div");
            b.className = "grid-elim-badge";
            b.innerText = "BORTVALD";
            div.appendChild(b);
          }
          document.getElementById("elim-counter-text").innerText = "Valda att gallra bort: " + eliminatedIds.size + " av " + targetRemove;
        });

        grid.appendChild(div);
      });
    }

    function openSelfArchetypeStep() {
      document.body.classList.remove("swipe-locked");
      document.getElementById("swipe-step-intro").style.display = "none";
      document.getElementById("swipe-step-arena").classList.remove("active");
      document.getElementById("swipe-step-elimination").style.display = "none";
      document.getElementById("swipe-step-self").style.display = "block";
      document.getElementById("swipe-round-badge").innerText = "Steg 3 av 3: Din Självbild & Energi";
      document.getElementById("swipe-phase-title").innerText = "Vilket ansiktsuttryck identifierar du dig själv mest med?";
      document.getElementById("swipe-phase-desc").innerText = "Välj 1:a, 2:a och 3:e plats för det uttryck och den utstrålning som ligger närmast dig själv.";

      selfSelectedOrder = [];
      const grid = document.getElementById("self-archetype-grid");
      grid.innerHTML = "";

      const allPool = customUploadedCards.length > 0
        ? [...customUploadedCards]
        : [...ARCHETYPE_DECKS.A.cards, ...ARCHETYPE_DECKS.B.cards, ...ARCHETYPE_DECKS.C.cards, ...ARCHETYPE_DECKS.D.cards];

      function refreshSelfBadges() {
        document.getElementById("self-counter-text").innerText =
          "Dina valda självbilds-arketyper: " + selfSelectedOrder.length + " av 3" +
          (selfSelectedOrder.length > 0 ? " (" + selfSelectedOrder.map((x, i) => "#" + (i + 1) + " " + x.id).join(", ") + ")" : "");

        grid.querySelectorAll(".grid-item-card").forEach(cardEl => {
          const cid = cardEl.getAttribute("data-id");
          const idx = selfSelectedOrder.findIndex(x => x.id === cid);
          const oldBadge = cardEl.querySelector(".grid-rank-badge");
          if (oldBadge) oldBadge.remove();

          if (idx !== -1) {
            cardEl.classList.add("self-selected");
            const b = document.createElement("div");
            b.className = "grid-rank-badge";
            b.innerText = "#" + (idx + 1);
            cardEl.appendChild(b);
          } else {
            cardEl.classList.remove("self-selected");
          }
        });
      }

      allPool.forEach(item => {
        const div = document.createElement("div");
        div.className = "grid-item-card";
        div.setAttribute("data-id", item.id);
        div.innerHTML = '<div style="height:100px; background:#090d13; display:flex; align-items:center; justify-content:center; overflow:hidden;">' +
          ('<img src="' + (item.blobUrl || item.resolvedUrl || (SUPABASE_URL + '/storage/v1/object/public/arketyper/' + item.id.toLowerCase() + '.jfif')) + '" onerror="const sb=\'' + SUPABASE_URL + '/storage/v1/object/public/arketyper/' + item.id.toLowerCase() + '\'; if(!this.dataset.t1){this.dataset.t1=1;this.src=sb+\'.jpg\';}else if(!this.dataset.t2){this.dataset.t2=1;this.src=sb+\'.png\';}else if(!this.dataset.t3){this.dataset.t3=1;this.src=sb+\'.webp\';}else if(!this.dataset.t4){this.dataset.t4=1;this.src=\'' + item.id.toLowerCase() + '.jfif\';}else if(!this.dataset.t5){this.dataset.t5=1;this.src=\'' + item.id.toLowerCase() + '.jpg\';}else{this.style.display=\'none\';this.parentNode.innerHTML=\'<span style=font-size:1.6rem;>👤</span>\';}" style="width:100%; height:100%; object-fit:cover;">') +
          '</div>' +
          '<div style="padding:8px;">' +
          '<strong style="font-size:0.8rem; color:#fff; display:block;">' + item.name + '</strong>' +
          '<span style="font-size:0.7rem; color:#fde68a;">' + item.trait + '</span>' +
          '</div>';

        div.addEventListener("click", () => {
          const existingIdx = selfSelectedOrder.findIndex(x => x.id === item.id);
          if (existingIdx !== -1) {
            selfSelectedOrder.splice(existingIdx, 1);
          } else {
            if (selfSelectedOrder.length >= 3) return;
            selfSelectedOrder.push(item);
          }
          refreshSelfBadges();
        });

        grid.appendChild(div);
      });
    }

    async function analyzeSwipeAndSelfWithArgon() {
      if (getModuleAttempts("swipe_test") >= 1) {
        alert("Du har redan slutfört och förbrukat ditt 1 försök på 360°-vektorswipen.");
        return;
      }
      incrementModuleAttempts("swipe_test");
      const outEl = document.getElementById("swipe-argon-output");
      const btn = document.getElementById("btn-run-swipe-argon");
      outEl.style.display = "block";
      outEl.innerText = "Argon 4.0 analyserar dina 360°-vektorer, din svephastighet (millisekunder), dina bortgallrade kort och din valda självbild...";
      btn.disabled = true;

      const summaryPayload = {
        swipes: swipeTelemetryHistory.map(s => ({
          id: s.id,
          trait: s.trait,
          emotionDirection: s.emotion,
          angle: s.angle,
          decisionLatencyMs: s.decisionLatencyMs,
          velocityPxPerMs: s.velocityPxPerMs,
          confidenceStyle: s.confidenceStyle,
          eliminatedInForcedChoice: eliminatedIds.has(s.id)
        })),
        selfIdentificationTop3: selfSelectedOrder.map((x, idx) => ({
          rank: idx + 1,
          id: x.id,
          trait: x.trait
        }))
      };

      const systemPrompt = "Du är Argon 4.0, expert på omedveten relationsdynamik och beteendepsykologi.\n" +
        "Analysera användarens data från 360°-vektorswipen (där både riktning, betänketid i ms och svephastighet i px/ms har mätts), vilka kort som rök i den tvingade gallringen, samt användarens 3 valda självbilds-arketyper.\n\n" +
        "Ge en knivskarp, fascinerande återkoppling på SVENSKA under 4 korta rubriker:\n" +
        "1. Impuls vs Tvekan (Vad svephastigheten och betänketiden avslöjar om vad nervsystemet reagerar blixtsnabbt på kontra var det finns ambivalens)\n" +
        "2. Klyftan mellan Tillit och Farlig Attraktion (Mönster i 360°-kompassen och vad som överlevde gallringen)\n" +
        "3. Självbild vs Dragningskraft (Söker personen en spegelbild av sin egen utstrålning eller en komplementär motpol?)\n" +
        "4. Korsmatchnings-nyckel (Vilken typ av kandidatprofil som kommer ge starkast ömsesidig gnista OCH trygghet).\n" +
        "Max 280 ord.";

      try {
        const reply = await callGeminiDirect("argon", systemPrompt, [
          { role: "user", parts: [{ text: JSON.stringify(summaryPayload, null, 2) }] }
        ]);
        outEl.innerText = reply;
        const saEl = document.getElementById("swipe-standalone-actions");
        if (saEl) saEl.style.display = "flex";

        const existingProf = document.getElementById("profile-text").innerText.trim();
        if (existingProf && sessionData) {
          const combined = attachCompletedModulesStamp(existingProf + "\n\n--- VISUELL KOMPASS & SJÄLVBILD (ARGON 4.0) ---\n" + reply);
          document.getElementById("profile-text").innerText = stripModulesStampForDisplay(combined);
          await supabaseRequest('/rest/v1/profiler?user_id=eq.' + sessionData.user.id, 'PATCH', {
            profil_text: combined
          }, sessionData.access_token);
        }
      } catch (err) {
        enqueueArgonJob({
          type: "swipe_profile",
          label: "360° Vektorswipe & Självbildsanalys",
          systemPrompt: systemPrompt,
          contents: [{ role: "user", parts: [{ text: JSON.stringify(summaryPayload, null, 2) }] }]
        });
        outEl.innerText = "⏳ STRIKT ARGON-KÖ AKTIVERAD (" + err.message + ")\n\n" +
          "Vi kompromissar inte med enklare AI-modeller. Dina 360°-vektorer, millisekunder och din självbild är nu säkert sparade i kö-motorn!\n" +
          "• Systemet försöker nå Argon 4.0 automatiskt var 10:e minut i bakgrunden.\n" +
          "• Du kan tryggt stänga webbläsaren nu – analysen slutförs och läggs till i din profil så fort Argon svarar.";
      } finally {
        btn.disabled = false;
      }
    }

    window.openSwipeLab = openSwipeLab;
    window.startLockedSwipeSession = startLockedSwipeSession;
    window.closeLockedSwipeToIntro = closeLockedSwipeToIntro;
    window.exitSwipeLab = exitSwipeLab;
    window.setSwipeRound = setSwipeRound;
    window.openForcedElimination = openForcedElimination;
    window.openSelfArchetypeStep = openSelfArchetypeStep;
    window.analyzeSwipeAndSelfWithArgon = analyzeSwipeAndSelfWithArgon;
    window.setAppLanguage = setAppLanguage;


