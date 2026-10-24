// =========================================================================
// 7.5. SOMATISK & TAKTIL PROJEKTION (2-STEGS RADIALHJUL) + DJÄVULSTESTET
// =========================================================================

const SOMATIC_BUCKET = "stimuli";
let somaticBucketMap = {}; // mappar basnamn (t.ex. "b01", "h1", "ba1") -> full public URL

const SOMATIC_WHEELS = {
  BODY: {
    step1Title: "FORM",
    step2Title: "FÄRG",
    forms: [
      {
        id: "FORM_CIRCLE", label: "Cirkel", vec: [0.85, -0.75, -0.60],
        svg: '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="12" fill="none" stroke="#fcd34d" stroke-width="2.6"/></svg>'
      },
      {
        id: "FORM_ORGANIC_WAVE", label: "Våg", vec: [0.90, 0.25, -0.85],
        svg: '<svg viewBox="0 0 36 36"><path d="M4 20 C11 8, 17 28, 24 15 C28 9, 31 18, 33 14" fill="none" stroke="#fcd34d" stroke-width="2.6" stroke-linecap="round"/></svg>'
      },
      {
        id: "FORM_SQUARE", label: "Kub", vec: [0.15, -0.25, 0.90],
        svg: '<svg viewBox="0 0 36 36"><rect x="8" y="8" width="20" height="20" rx="2" fill="none" stroke="#fcd34d" stroke-width="2.6"/></svg>'
      },
      {
        id: "FORM_TRIANGLE", label: "Triangel", vec: [0.20, 0.80, 0.55],
        svg: '<svg viewBox="0 0 36 36"><polygon points="18,6 30,28 6,28" fill="none" stroke="#fcd34d" stroke-width="2.6" stroke-linejoin="round"/></svg>'
      },
      {
        id: "FORM_STAR_BURST", label: "Tagg", vec: [-0.85, 0.95, 0.30],
        svg: '<svg viewBox="0 0 36 36"><polygon points="18,4 22,14 32,12 24,20 29,30 18,24 7,30 12,20 4,12 14,14" fill="none" stroke="#fcd34d" stroke-width="2.2" stroke-linejoin="round"/></svg>'
      },
      {
        id: "FORM_LINEAR_AXIS", label: "Pelare", vec: [-0.15, -0.65, 0.80],
        svg: '<svg viewBox="0 0 36 36"><line x1="14" y1="6" x2="14" y2="30" stroke="#fcd34d" stroke-width="2.6"/><line x1="22" y1="6" x2="22" y2="30" stroke="#fcd34d" stroke-width="2.6"/></svg>'
      }
    ],
    colors: [
      { id: "COLOR_CRIMSON_EARTH", label: "Terrakotta", hex: "#B83A2C", vec: [0.85, 0.85, -0.30] },
      { id: "COLOR_WARM_OCHRE", label: "Solockra", hex: "#D99B38", vec: [0.75, 0.45, -0.20] },
      { id: "COLOR_SOFT_PEACH", label: "Persika", hex: "#E8A598", vec: [0.92, -0.35, -0.75] },
      { id: "COLOR_EARTH_MOSS", label: "Mossa", hex: "#4A5338", vec: [0.65, -0.80, 0.45] },
      { id: "COLOR_STEEL_GRAPHITE", label: "Grafit", hex: "#5A626A", vec: [-0.25, -0.45, 0.85] },
      { id: "COLOR_COBALT_ICE", label: "Isblå", hex: "#3B6E9C", vec: [-0.60, 0.20, 0.70] }
    ]
  },
  TACTILE: {
    step1Title: "TEXTUR",
    step2Title: "VÄRME",
    forms: [
      {
        id: "TEX_VELVET", label: "Sammet", vec: [0.88, -0.70, -0.65],
        svg: '<svg viewBox="0 0 36 36"><rect x="7" y="10" width="22" height="16" rx="8" fill="none" stroke="#fcd34d" stroke-width="2.5"/><circle cx="14" cy="18" r="1.5" fill="#fcd34d"/><circle cx="22" cy="18" r="1.5" fill="#fcd34d"/></svg>'
      },
      {
        id: "TEX_SILK", label: "Silkesvåg", vec: [0.92, 0.20, -0.85],
        svg: '<svg viewBox="0 0 36 36"><path d="M6 14 Q18 6, 30 14 M6 22 Q18 14, 30 22" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>'
      },
      {
        id: "TEX_WOOD", label: "Träådring", vec: [0.55, -0.45, 0.75],
        svg: '<svg viewBox="0 0 36 36"><ellipse cx="18" cy="18" rx="11" ry="7" fill="none" stroke="#fcd34d" stroke-width="2.2"/><ellipse cx="18" cy="18" rx="5" ry="3" fill="none" stroke="#fcd34d" stroke-width="2"/></svg>'
      },
      {
        id: "TEX_KNOT", label: "Flätknut", vec: [0.25, 0.82, 0.65],
        svg: '<svg viewBox="0 0 36 36"><path d="M8 8 L28 28 M28 8 L8 28 M18 5 L18 31" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>'
      },
      {
        id: "TEX_ICE", label: "Sprucken is", vec: [-0.88, 0.90, 0.40],
        svg: '<svg viewBox="0 0 36 36"><path d="M8 6 L18 17 L13 24 L26 30 M27 8 L18 17" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>'
      },
      {
        id: "TEX_BASALT", label: "Basaltsten", vec: [-0.10, -0.50, 0.90],
        svg: '<svg viewBox="0 0 36 36"><polygon points="10,8 25,7 30,19 22,29 8,26 6,16" fill="none" stroke="#fcd34d" stroke-width="2.4"/></svg>'
      }
    ],
    colors: [
      { id: "THERM_PULSE_RED", label: "Pulsröd", hex: "#C84B31", vec: [0.85, 0.88, -0.35] },
      { id: "THERM_HONEY", label: "Honung", hex: "#E6B35A", vec: [0.82, 0.35, -0.40] },
      { id: "THERM_ROSE_QUARTZ", label: "Rosékvarts", hex: "#DFA69E", vec: [0.90, -0.40, -0.75] },
      { id: "THERM_WET_CLAY", label: "Våt lera", hex: "#5A4638", vec: [0.68, -0.78, 0.55] },
      { id: "THERM_LIMESTONE", label: "Kalksten", hex: "#9CA3AF", vec: [-0.15, -0.55, 0.80] },
      { id: "THERM_FROST_STEEL", label: "Rimfrost", hex: "#608299", vec: [-0.70, 0.30, 0.65] }
    ]
  }
};

function buildSomaticCatalog() {
  const bodyAnchors = [
    { file: "ba1", code: "ANCHOR_PLEASURE", module: "BODY", isAnchor: true, anchorType: "PLEASURE", title: "Sensorisk Lust & Njutning", sub: "Moget bär mot mjuka läppar — taktil aptit" },
    { file: "ba2", code: "ANCHOR_SAFETY", module: "BODY", isAnchor: true, anchorType: "SAFETY", title: "Somatisk Vila & Trygghet", sub: "Sovande väsen på solvarm ullpläd" },
    { file: "ba3", code: "ANCHOR_THREAT", module: "BODY", isAnchor: true, anchorType: "THREAT", title: "Friktion, Kyla & Hot", sub: "Rostig taggtråd ur sprucken råbetong" },
    { file: "ba4", code: "ANCHOR_NEUTRAL", module: "BODY", isAnchor: true, anchorType: "NEUTRAL", title: "Neutral Struktur & Ordning", sub: "Symmetriska kalkstensblock i jämnt ljus" }
  ];

  const bodyBatches = [
    { g: "F", vol: 1, vCode: "SLEND", label: "Kvinna · Smal" },
    { g: "M", vol: 1, vCode: "SLEND", label: "Man · Smal" },
    { g: "F", vol: 2, vCode: "REG",   label: "Kvinna · Normal" },
    { g: "M", vol: 2, vCode: "REG",   label: "Man · Normal" },
    { g: "F", vol: 3, vCode: "CURV",  label: "Kvinna · Fyllig/Kurvig" },
    { g: "M", vol: 3, vCode: "CURV",  label: "Man · Fyllig/Kraftig" },
    { g: "F", vol: 4, vCode: "HEAVY", label: "Kvinna · Tung/Massiv" },
    { g: "M", vol: 4, vCode: "HEAVY", label: "Man · Tung/Massiv" }
  ];
  const muscTypes = [
    { m: 1, mCode: "SOFT", label: "Mjuk" },
    { m: 5, mCode: "MUSC", label: "Muskulös" }
  ];
  const artStyles = [
    { sCode: "BIO", label: "Biomorfisk skulptur" },
    { sCode: "CUB", label: "Kubism" },
    { sCode: "SAN", label: "Klassisk rödkrita" },
    { sCode: "EXP", label: "Expressionism" }
  ];

  const bodyCards = [];
  let bIdx = 1;
  bodyBatches.forEach((b, batchIdx) => {
    muscTypes.forEach(m => {
      artStyles.forEach(s => {
        const numStr = String(bIdx).padStart(2, "0");
        bodyCards.push({
          file: "b" + numStr,
          code: "BODY_" + b.g + "_" + b.vCode + "_" + m.mCode + "_" + s.sCode,
          module: "BODY",
          isAnchor: false,
          batch: batchIdx + 1,
          gender: b.g,
          volume: b.vol,
          muscle: m.m,
          style: s.sCode,
          title: "Arketyp #" + numStr + " (" + s.label + ")",
          sub: b.label + " · " + m.label
        });
        bIdx++;
      });
    });
  });

  const tactileAnchors = [
    { file: "ta1", code: "ANCHOR_TACTILE_PLEASURE", module: "TACTILE", isAnchor: true, anchorType: "PLEASURE", title: "Taktil Njutning & Värme", sub: "Varm gyllene honung över röd sammet & flodsten" },
    { file: "ta2", code: "ANCHOR_TACTILE_SAFETY", module: "TACTILE", isAnchor: true, anchorType: "SAFETY", title: "Jordad Bärkraft & Trygghet", sub: "Solvarm skogsmossa möter grovstickad merinoull" },
    { file: "ta3", code: "ANCHOR_TACTILE_THREAT", module: "TACTILE", isAnchor: true, anchorType: "THREAT", title: "Taktil Smärta & Kyla", sub: "Frostbitna glasskärvor och rostig metall i is" },
    { file: "ta4", code: "ANCHOR_TACTILE_NEUTRAL", module: "TACTILE", isAnchor: true, anchorType: "NEUTRAL", title: "Neutral Bruksyta", sub: "Släthyvlad askträskiva och torr matt kalksten" }
  ];

  const hfSpecs = [
    { g: "F", act: 1, sc: 1, den: 1, code: "FEM_PAS_SMALL_SLEND", desc: "Feminin · Passiv · Liten · Smal" },
    { g: "F", act: 1, sc: 5, den: 5, code: "FEM_PAS_LARGE_THICK", desc: "Feminin · Passiv · Stor · Fyllig" },
    { g: "F", act: 5, sc: 1, den: 5, code: "FEM_ACT_SMALL_THICK", desc: "Feminin · Aktiv · Liten · Fyllig" },
    { g: "F", act: 5, sc: 5, den: 1, code: "FEM_ACT_LARGE_SLEND", desc: "Feminin · Aktiv · Stor · Senig" },
    { g: "M", act: 1, sc: 1, den: 5, code: "MASC_PAS_SMALL_THICK", desc: "Maskulin · Passiv · Kompakt · Bred" },
    { g: "M", act: 1, sc: 5, den: 1, code: "MASC_PAS_LARGE_SLEND", desc: "Maskulin · Passiv · Stor · Långfingrad" },
    { g: "M", act: 5, sc: 1, den: 1, code: "MASC_ACT_SMALL_SLEND", desc: "Maskulin · Aktiv · Kompakt · Senig" },
    { g: "M", act: 5, sc: 5, den: 5, code: "MASC_ACT_LARGE_THICK", desc: "Maskulin · Aktiv · Massiv · Grov" }
  ];

  const tactileCards = [];
  hfSpecs.forEach((sp, i) => {
    tactileCards.push({
      file: "h" + (i + 1),
      code: "HAND_0" + (i + 1) + "_" + sp.code,
      module: "TACTILE",
      isAnchor: false,
      part: "HAND",
      gender: sp.g,
      activity: sp.act,
      scale: sp.sc,
      density: sp.den,
      title: "Handstudie #" + (i + 1) + " (Rödkrita)",
      sub: sp.desc
    });
  });

  hfSpecs.forEach((sp, i) => {
    tactileCards.push({
      file: "f" + (i + 1),
      code: "FOOT_0" + (i + 1) + "_" + sp.code,
      module: "TACTILE",
      isAnchor: false,
      part: "FOOT",
      gender: sp.g,
      activity: sp.act,
      scale: sp.sc,
      density: sp.den,
      title: "Fotstudie #" + (i + 1) + " (Rödkrita)",
      sub: sp.desc
    });
  });

  return { bodyAnchors, bodyCards, tactileAnchors, tactileCards };
}

const SOMATIC_CATALOG = buildSomaticCatalog();

// =========================================================================
// 12 SKARPA OFF-GUARD "DJÄVULSTEST"-FRÅGOR (DELAS MELLAN SVAJP & ROLLSPEL)
// =========================================================================
const DEVIL_QUESTIONS_POOL = [
  {
    id: "DEVIL_01_CANCEL",
    q: "En person du tycker om ställer in en efterlängtad träff med kort varsel för att hen 'inte orkar'. Vad är din allra första, ofiltrerade reflex inombords?",
    options: [
      { type: "HALO", text: "Jag känner enbart ren omsorg och vill direkt fråga hur jag kan stötta." },
      { type: "AUTH", text: "En kort stöt av irritation och besvikelse, innan jag sekunden efter förstår läget." },
      { type: "AVOID", text: "Jag rycker på axlarna och stänger av känslan direkt – det rör mig inte." },
      { type: "PASSIVE", text: "Jag skriver 'helt lugnt!', men blir lite kort i tonen nästa gång vi hörs." }
    ]
  },
  {
    id: "DEVIL_02_ENVY",
    q: "Någon i din bekantskapskrets som ofta skryter och tar stor plats misslyckas plötsligt med ett stort projekt. Vad händer i dig under första sekunden?",
    options: [
      { type: "HALO", text: "Jag känner bara genuint medlidande och hoppas att personen inte tar det hårt." },
      { type: "AUTH", text: "En mikrosekund av skadeglädje ('rätt åt hen'), innan mitt vuxna förnuft tar över." },
      { type: "AVOID", text: "Ingenting alls – andras motgångar eller framgångar berör mig noll." }
    ]
  },
  {
    id: "DEVIL_03_HURT_CAUSE",
    q: "När du ser tillbaka på ett tillfälle då du genuint sårade någon som stod dig nära: vad var den ärliga orsaken?",
    options: [
      { type: "HALO", text: "Jag ville bara väl och personen missförstod mina goda avsikter helt." },
      { type: "AUTH", text: "Jag var trött, pressad eller självisk och satte min egen bekvämlighet först just då." },
      { type: "PASSIVE", text: "Jag blev orättvist provocerad först och tvingades försvara mig." }
    ]
  },
  {
    id: "DEVIL_04_PRIDE",
    q: "Någon ifrågasätter din kompetens eller intelligens helt orättvist inför andra. Hur reagerar du på insidan?",
    options: [
      { type: "HALO", text: "Jag förblir fullkomligt lugn och känner mest empati för personens egen osäkerhet." },
      { type: "AUTH", text: "Det hugger till rejält i stoltheten och jag får puls – vill antingen bita ifrån eller gå därifrån." },
      { type: "PASSIVE", text: "Jag ler och håller med utåt, men ältar händelsen tyst i flera dagar efteråt." }
    ]
  },
  {
    id: "DEVIL_05_TRUTH_DILEMMA",
    q: "Du måste välja mellan två obekväma alternativ en fredagskväll med en partner:",
    options: [
      { type: "AUTH", text: "Att säga en obekväm sanning som riskerar att såra min partner och förstöra kvällens stämning." },
      { type: "PASSIVE", text: "Att dra en mjuk vit nödlögn för att bevara husfriden och slippa en tung diskussion." },
      { type: "HALO", text: "Jag hamnar aldrig i den situationen eftersom jag alltid formulerar sanningen så att alla blir glada." }
    ]
  },
  {
    id: "DEVIL_06_FRIEND_CALL",
    q: "En vän som ofta kräver mycket energi ringer sent på kvällen när du precis lagt dig i soffan helt slutkörd. Vad gör du?",
    options: [
      { type: "HALO", text: "Jag svarar alltid med värme direkt – en vän i behov går före min egen trötthet alla dagar i veckan." },
      { type: "AUTH", text: "Jag tittar på skärmen, suckar tyst och låter det ringa ut med planen att höra av mig imorgon." },
      { type: "PASSIVE", text: "Jag svarar men låter så pass trött och kortfattad att hen snabbt förstår vinken." }
    ]
  },
  {
    id: "DEVIL_07_PARTNER_FLAW",
    q: "Vilken typ av svaghet hos en partner är svårast för dig att inte bli inombords irriterad på i längden?",
    options: [
      { type: "HALO", text: "Ingen alls – älskar man någon på riktigt accepterar man alla sidor utan att bli irriterad." },
      { type: "AUTH", text: "Om personen blir passiv, obeslutsam eller lägger över allt praktiskt ansvar på mig." },
      { type: "AUTH", text: "Om personen är överdrivet kritisk, rastlös eller aldrig kan slappna av i nuet." }
    ]
  },
  {
    id: "DEVIL_08_APOLOGY",
    q: "När ett gräl har låst sig och du vet att du har 30 % av skulden och din partner har 70 % – vad händer oftast?",
    options: [
      { type: "HALO", text: "Jag tar direkt på mig hela ansvaret utan minsta motstånd för att läka stämningen." },
      { type: "AUTH", text: "Det tar emot i egot att be om ursäkt först när den andra gjorde mer fel, men jag försöker till slut." },
      { type: "AVOID", text: "Jag väntar ut den andra tills hen ber om ursäkt först, annars får det vara tyst." }
    ]
  },
  {
    id: "DEVIL_09_JUDGE_FRIEND",
    q: "En vän erkänner att hen ibland överdriver sina framgångar lite för att slippa känna sig underlägsen i sällskap. Hur ser du på det?",
    options: [
      { type: "HALO", text: "Jag skulle aldrig själv känna behov av att hävda mig, men jag förlåter naturligtvis min vän." },
      { type: "AUTH", text: "Fullt mänskligt – jag har själv skarvat eller putsats på sanningen när osäkerheten slagit till." },
      { type: "AVOID", text: "Det är ett tecken på svag karaktär och jag tappar respekten direkt." }
    ]
  },
  {
    id: "DEVIL_10_LISTENING",
    q: "De flesta tappar ibland fokus när en partner pratar länge om något detaljrikt som inte intresserar en. Vad gör du då?",
    options: [
      { type: "HALO", text: "Jag lyssnar alltid med 100 % genuint engagemang oavsett ämne, eftersom det är min partner." },
      { type: "AUTH", text: "Jag nickar och säger 'mm', men märker plötsligt att tankarna har vandrat iväg till annat." },
      { type: "AUTH", text: "Jag avbryter försiktigt eller byter spår för att jag inte orkar låtsas hänga med." }
    ]
  },
  {
    id: "DEVIL_11_GRATITUDE",
    q: "Du har ansträngt dig rejält i flera timmar för att ordna något fint hemma, men din partner kliver in utan att ens märka det. Vad är din första impuls?",
    options: [
      { type: "HALO", text: "Det spelar ingen roll alls – glädjen i att ge utan motkrav är mer än nog för mig." },
      { type: "AUTH", text: "Jag känner ett tydligt sting av att känna mig osedd och vill nästan påpeka vad jag gjort." },
      { type: "PASSIVE", text: "Jag säger inget men slutar anstränga mig nästa vecka." }
    ]
  },
  {
    id: "DEVIL_12_MIRROR_CHECK",
    q: "Om du måste välja vad som skaver mest i en nära relation på sikt:",
    options: [
      { type: "AUTH", text: "En partner som är så mån om harmoni att hen aldrig vågar säga vad hen egentligen tycker." },
      { type: "AUTH", text: "En partner som är så skoningslöst ärlig att småsaker ofta blir till onödiga nålstick." },
      { type: "HALO", text: "Med rätt kommunikation uppstår aldrig någon av dessa friktioner i mina relationer." }
    ]
  }
];

// Global behållare för alla Off-Guard-svar (från Somatisk Lab, 360° Swipe och Rollspel)
window.globalDevilResponses = [];
try {
  const savedDevil = localStorage.getItem("rp_devil_responses_v1");
  if (savedDevil) window.globalDevilResponses = JSON.parse(savedDevil) || [];
} catch (e) {}

function saveGlobalDevilResponses() {
  try {
    localStorage.setItem("rp_devil_responses_v1", JSON.stringify(window.globalDevilResponses || []));
  } catch (e) {}
  updateHubClarityBadge();
}

function computeGlobalClarityMetrics(customList) {
  const list = customList || window.globalDevilResponses || [];
  if (list.length === 0) {
    return {
      totalAnswered: 0,
      haloRatio: 0,
      authRatio: 1,
      profileClarityPct: 100,
      avgLatencyMs: 0,
      statusLabel: "Ännu ej testad (100% utgångsvärde)"
    };
  }
  const haloCount = list.filter(r => r.type === "HALO").length;
  const authCount = list.filter(r => r.type === "AUTH").length;
  const fastHaloCount = list.filter(r => r.type === "HALO" && r.latencyMs < 2400).length;
  const avgLat = Math.round(list.reduce((acc, r) => acc + (r.latencyMs || 2500), 0) / list.length);

  const haloRatio = Number((haloCount / list.length).toFixed(2));
  const authRatio = Number((authCount / list.length).toFixed(2));

  let clarity = 100 - Math.round(haloRatio * 65) - (fastHaloCount * 8);
  clarity = Math.max(15, Math.min(100, clarity));

  let statusLabel = "Hög profilskärpa (Autentisk & ofiltrerad)";
  if (clarity < 55) {
    statusLabel = "Låg profilskärpa — Idealiserad bild (behöver mer skärpa i rollspelet)";
  } else if (clarity < 80) {
    statusLabel = "Medelhög skärpa — Viss social anpassning";
  }

  return {
    totalAnswered: list.length,
    haloRatio,
    authRatio,
    profileClarityPct: clarity,
    avgLatencyMs: avgLat,
    statusLabel
  };
}
window.computeGlobalClarityMetrics = computeGlobalClarityMetrics;

function updateHubClarityBadge() {
  const badgeEl = document.getElementById("hub-clarity-badge");
  if (!badgeEl) return;
  const m = computeGlobalClarityMetrics();
  if (m.totalAnswered === 0) {
    badgeEl.textContent = "⚡ Profilskärpa: Väntar på Off-Guard-frågor";
  } else {
    badgeEl.textContent = "⚡ Profilskärpa: " + m.profileClarityPct + "% (" + m.totalAnswered + " svar)";
  }
}

// Global funktion för att skjuta in en Off-Guard-fråga var som helst i plattformen
let activeGlobalDevilCallback = null;
let activeGlobalDevilQuestion = null;
let activeGlobalDevilContext = "SWIPE";
let globalDevilShownAt = 0;

function triggerGlobalOffGuardDevil(qObj, contextLabel, onComplete) {
  const modal = document.getElementById("offguard-devil-modal");
  if (!modal || !qObj) {
    if (typeof onComplete === "function") onComplete();
    return;
  }

  activeGlobalDevilQuestion = qObj;
  activeGlobalDevilContext = contextLabel || "OFF_GUARD";
  activeGlobalDevilCallback = onComplete || null;

  const ctxTag = document.getElementById("offguard-context-tag");
  if (ctxTag) ctxTag.textContent = contextLabel || "Snabb impuls";

  const qText = document.getElementById("offguard-question-text");
  if (qText) qText.textContent = qObj.q;

  const optsBox = document.getElementById("offguard-options-box");
  if (optsBox) {
    optsBox.innerHTML = "";
    const shuffled = [...qObj.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "somatic-offguard-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => {
        const latencyMs = Math.round(performance.now() - globalDevilShownAt);
        const rec = {
          id: activeGlobalDevilQuestion.id,
          question: activeGlobalDevilQuestion.q,
          chosenText: opt.text,
          type: opt.type,
          context: activeGlobalDevilContext,
          latencyMs: latencyMs,
          ts: Date.now()
        };
        // Ersätt om samma fråga besvarats tidigare, annars lägg till
        const existingIdx = window.globalDevilResponses.findIndex(x => x.id === rec.id);
        if (existingIdx !== -1) window.globalDevilResponses[existingIdx] = rec;
        else window.globalDevilResponses.push(rec);

        saveGlobalDevilResponses();
        if (typeof incrementModuleAttempts === "function" && getModuleAttempts("devil_test") === 0 && window.globalDevilResponses.length >= 3) {
          incrementModuleAttempts("devil_test");
        }

        modal.classList.remove("active");
        const cb = activeGlobalDevilCallback;
        activeGlobalDevilCallback = null;
        if (typeof cb === "function") cb(rec);
      });
      optsBox.appendChild(btn);
    });
  }

  globalDevilShownAt = performance.now();
  modal.classList.add("active");
}
window.triggerGlobalOffGuardDevil = triggerGlobalOffGuardDevil;

function getNextUnansweredDevilQuestion(fallbackIndex) {
  const answeredIds = new Set((window.globalDevilResponses || []).map(r => r.id));
  const unanswered = DEVIL_QUESTIONS_POOL.filter(q => !answeredIds.has(q.id));
  if (unanswered.length > 0) return unanswered[0];
  return DEVIL_QUESTIONS_POOL[(fallbackIndex || 0) % DEVIL_QUESTIONS_POOL.length];
}
window.getNextUnansweredDevilQuestion = getNextUnansweredDevilQuestion;

// =========================================================================
// SUPABASE BUCKET AUTO-SYNK FÖR 'stimuli' (ALLA 88 BILDER)
// =========================================================================
async function syncSupabaseStimuliBucket() {
  const statusEl = document.getElementById("somatic-bucket-status");
  try {
    const res = await fetch(SUPABASE_URL + "/storage/v1/object/list/" + SOMATIC_BUCKET, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prefix: "", limit: 200, offset: 0 })
    });
    if (!res.ok) return;
    const items = await res.json();
    if (!Array.isArray(items)) return;

    let count = 0;
    const baseUrl = SUPABASE_URL + "/storage/v1/object/public/" + SOMATIC_BUCKET + "/";
    items.forEach(obj => {
      if (!obj || !obj.name || obj.name === ".emptyFolderPlaceholder") return;
      const base = obj.name.replace(/\.[^/.]+$/, "").toLowerCase();
      somaticBucketMap[base] = baseUrl + encodeURIComponent(obj.name);
      // Stöd även b1 -> b01 normalisering
      const padded = base.replace(/^b(\d)$/, "b0$1");
      somaticBucketMap[padded] = baseUrl + encodeURIComponent(obj.name);
      count++;
    });

    if (statusEl) {
      if (count > 0) {
        statusEl.style.color = "#6ee7b7";
        statusEl.innerHTML = "✅ <strong>" + count + "</strong> testbilder hittades automatiskt i Supabase-bucketen <code>stimuli</code>!";
      } else {
        statusEl.style.color = "#fde68a";
        statusEl.innerHTML = "ℹ️ Bucketen <code>stimuli</code> är tom eller ej skapad än (visar konstnärliga SVG-förlagor tills du laddat upp bilderna).";
      }
    }
  } catch (e) {
    console.warn("Kunde inte lista stimuli-bucket:", e);
  }
}
window.syncSupabaseStimuliBucket = syncSupabaseStimuliBucket;

// =========================================================================
// SOMATISK & TAKTIL RADIAL-SESSION
// =========================================================================
let somaticActiveDeck = [];
let somaticCurrentIdx = 0;
let somaticCardShownAt = 0;
let somaticWheelStep = 1;
let somaticTempForm = null;
let somaticAnchors = {
  BODY: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null },
  TACTILE: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null }
};
let somaticSwipeLog = [];
let somaticScheduledDevils = {};

function openSomaticLab() {
  syncSupabaseStimuliBucket();
  document.body.classList.remove("swipe-locked");
  switchView("view-somatic-lab");
  document.getElementById("somatic-step-intro").style.display = "block";
  document.getElementById("somatic-step-arena").style.display = "none";
  document.getElementById("somatic-step-report").style.display = "none";
  if (typeof refreshAttemptsUI === "function") refreshAttemptsUI();
}

function exitSomaticLab() {
  document.body.classList.remove("swipe-locked");
  if (typeof enteredFromTaxiMenu !== "undefined" && enteredFromTaxiMenu) {
    switchView("view-taxi-menu");
  } else if (sessionData && document.getElementById("profile-text") && document.getElementById("profile-text").innerText.trim()) {
    switchView("view-hub");
  } else {
    switchView("view-auth");
  }
}

function abortSomaticToIntro() {
  document.getElementById("somatic-step-arena").style.display = "none";
  document.getElementById("somatic-step-report").style.display = "none";
  document.getElementById("somatic-step-intro").style.display = "block";
}

function buildSomaticDeck(scope) {
  let deck = [];
  somaticScheduledDevils = {};

  if (scope === "quick_all") {
    deck.push(...SOMATIC_CATALOG.bodyAnchors);
    for (let b = 1; b <= 8; b++) {
      const batchCards = SOMATIC_CATALOG.bodyCards.filter(c => c.batch === b);
      deck.push(batchCards[b % batchCards.length]);
    }
    deck.push(...SOMATIC_CATALOG.tactileAnchors);
    deck.push(
      SOMATIC_CATALOG.tactileCards[0],
      SOMATIC_CATALOG.tactileCards[1],
      SOMATIC_CATALOG.tactileCards[4],
      SOMATIC_CATALOG.tactileCards[7],
      SOMATIC_CATALOG.tactileCards[8],
      SOMATIC_CATALOG.tactileCards[9],
      SOMATIC_CATALOG.tactileCards[12],
      SOMATIC_CATALOG.tactileCards[15]
    );
    somaticScheduledDevils = {
      6: DEVIL_QUESTIONS_POOL[0],
      11: DEVIL_QUESTIONS_POOL[1],
      16: DEVIL_QUESTIONS_POOL[4],
      20: DEVIL_QUESTIONS_POOL[6],
      23: DEVIL_QUESTIONS_POOL[9]
    };
  } else if (scope === "full_all") {
    deck = [
      ...SOMATIC_CATALOG.bodyAnchors,
      ...SOMATIC_CATALOG.bodyCards,
      ...SOMATIC_CATALOG.tactileAnchors,
      ...SOMATIC_CATALOG.tactileCards
    ];
    [10, 22, 34, 46, 58, 70, 78, 84].forEach((cp, idx) => {
      somaticScheduledDevils[cp] = DEVIL_QUESTIONS_POOL[idx];
    });
  } else if (scope === "body_only") {
    deck = [...SOMATIC_CATALOG.bodyAnchors, ...SOMATIC_CATALOG.bodyCards];
    [10, 24, 38, 52, 64].forEach((cp, idx) => {
      somaticScheduledDevils[cp] = DEVIL_QUESTIONS_POOL[idx];
    });
  } else {
    deck = [...SOMATIC_CATALOG.tactileAnchors, ...SOMATIC_CATALOG.tactileCards];
    [6, 11, 15, 18].forEach((cp, idx) => {
      somaticScheduledDevils[cp] = DEVIL_QUESTIONS_POOL[idx + 4];
    });
  }

  return deck;
}

function startSomaticLabSession() {
  if (sessionData && getModuleAttempts("somatic_test") >= 1) {
    alert("Du har redan genomfört Somatisk & Taktil Projektion i din profil (1 försök gäller). Be Admin nollställa räknaren om du blev avbruten.");
    return;
  }

  const scopeSel = document.getElementById("somatic-scope-select");
  const scope = scopeSel ? scopeSel.value : "quick_all";
  somaticActiveDeck = buildSomaticDeck(scope);
  somaticCurrentIdx = 0;
  somaticSwipeLog = [];
  somaticAnchors = {
    BODY: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null },
    TACTILE: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null }
  };

  document.getElementById("somatic-step-intro").style.display = "none";
  document.getElementById("somatic-step-report").style.display = "none";
  document.getElementById("somatic-step-arena").style.display = "block";

  const cl = computeGlobalClarityMetrics();
  document.getElementById("somatic-tel-clarity").textContent = cl.profileClarityPct + "%";
  renderSomaticCard();
}

function getSomaticFallbackSvg(card) {
  if (card.isAnchor) {
    if (card.anchorType === "PLEASURE") {
      return '<svg viewBox="0 0 240 300" width="190" height="240">' +
        '<defs><radialGradient id="sgPl" cx="45%" cy="40%" r="55%"><stop offset="0%" stop-color="#f87171"/><stop offset="60%" stop-color="#991b1b"/><stop offset="100%" stop-color="#450a0a"/></radialGradient></defs>' +
        '<path d="M55 120 Q120 85 185 120 Q120 155 55 120 Z" fill="#b91c1c" opacity="0.5"/>' +
        '<path d="M120 75 C165 75, 175 145, 120 215 C65 145, 75 75, 120 75 Z" fill="url(#sgPl)"/>' +
        '<circle cx="105" cy="125" r="2.2" fill="#fde047"/><circle cx="135" cy="130" r="2.2" fill="#fde047"/><circle cx="120" cy="158" r="2.2" fill="#fde047"/></svg>';
    }
    if (card.anchorType === "SAFETY") {
      return '<svg viewBox="0 0 240 300" width="190" height="240">' +
        '<defs><radialGradient id="sgSf" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde68a"/><stop offset="70%" stop-color="#b45309"/><stop offset="100%" stop-color="#3f2e21"/></radialGradient></defs>' +
        '<ellipse cx="120" cy="175" rx="82" ry="48" fill="#4a5338" opacity="0.55"/>' +
        '<circle cx="120" cy="150" r="54" fill="url(#sgSf)"/>' +
        '<path d="M88 145 Q120 175 152 145" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/></svg>';
    }
    if (card.anchorType === "THREAT") {
      return '<svg viewBox="0 0 240 300" width="190" height="240">' +
        '<path d="M25 80 L215 220 M25 210 L215 90 M40 150 L200 150" stroke="#9ca3af" stroke-width="3.5"/>' +
        '<polygon points="80,105 95,75 102,115 70,125" fill="#ef4444"/>' +
        '<polygon points="145,135 168,110 160,158 132,160" fill="#dc2626"/></svg>';
    }
    return '<svg viewBox="0 0 240 300" width="190" height="240">' +
      '<rect x="55" y="70" width="60" height="60" fill="#374151" stroke="#9ca3af" stroke-width="1.5"/>' +
      '<rect x="125" y="70" width="60" height="60" fill="#4b5563" stroke="#9ca3af" stroke-width="1.5"/>' +
      '<rect x="55" y="140" width="60" height="60" fill="#4b5563" stroke="#9ca3af" stroke-width="1.5"/>' +
      '<rect x="125" y="140" width="60" height="60" fill="#374151" stroke="#9ca3af" stroke-width="1.5"/></svg>';
  }

  if (card.module === "BODY") {
    const w = 36 + card.volume * 16;
    const shoulder = card.gender === "M" ? w * 1.18 : w * 0.92;
    const hip = card.gender === "F" ? w * 1.18 : w * 0.92;
    const waist = card.muscle === 5 ? w * 0.72 : w * 0.95;
    const strokeCol = card.style === "SAN" ? "#d97706" : (card.style === "CUB" ? "#60a5fa" : "#e5e7eb");
    const fillCol = card.muscle === 5 ? "rgba(180, 83, 9, 0.35)" : "rgba(217, 119, 6, 0.22)";

    return '<svg viewBox="0 0 240 300" width="190" height="240">' +
      '<path d="M ' + (120 - shoulder) + ' 75 Q ' + (120 - waist) + ' 145 ' + (120 - hip) + ' 225 L ' + (120 + hip) + ' 225 Q ' + (120 + waist) + ' 145 ' + (120 + shoulder) + ' 75 Z" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<line x1="120" y1="68" x2="120" y2="235" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4"/></svg>';
  }

  const strokeW = card.density === 5 ? 4.2 : 2.0;
  const scaleNum = card.scale === 5 ? 1.18 : 0.82;
  return '<svg viewBox="0 0 240 300" width="190" height="240">' +
    '<g transform="translate(120,150) scale(' + scaleNum + ') translate(-120,-150)">' +
    '<rect x="65" y="55" width="110" height="180" rx="8" fill="#fdf8f0" opacity="0.08"/>' +
    '<path d="M85 210 C80 165, 75 110, 92 85 C98 115, 102 135, 104 80 C112 115, 118 135, 122 78 C130 115, 136 135, 142 88 C152 120, 158 145, 165 118 C168 160, 155 195, 145 215 Z" fill="rgba(184, 58, 44, 0.28)" stroke="#d97706" stroke-width="' + strokeW + '" stroke-linejoin="round"/></g></svg>';
}

function loadSomaticVisual(card) {
  const imgEl = document.getElementById("somatic-stimulus-img");
  const fbEl = document.getElementById("somatic-fallback-container");
  const filePill = document.getElementById("somatic-file-pill");

  const baseKey = card.file.toLowerCase();
  filePill.textContent = baseKey + ".jpg";

  if (somaticBucketMap[baseKey]) {
    imgEl.onload = () => {
      fbEl.style.display = "none";
      imgEl.style.display = "block";
    };
    imgEl.onerror = () => {
      imgEl.style.display = "none";
      fbEl.style.display = "flex";
      fbEl.innerHTML = getSomaticFallbackSvg(card) +
        '<div style="font-size:0.75rem; color:#94a3b8; margin-top:6px;">Konstnärlig SVG-reserv (<code>' + baseKey + '</code>)</div>';
    };
    imgEl.src = somaticBucketMap[baseKey];
    return;
  }

  const exts = ["jpg", "png", "webp", "jpeg", "jfif", "JPG", "PNG"];
  let attempt = 0;

  function tryNextExt() {
    if (attempt >= exts.length) {
      imgEl.style.display = "none";
      fbEl.style.display = "flex";
      fbEl.innerHTML = getSomaticFallbackSvg(card) +
        '<div style="font-size:0.75rem; color:#94a3b8; margin-top:6px;">Visar SVG-förlaga tills <code>' + baseKey + '.jpg</code> ligger i bucket <code>stimuli</code></div>';
      return;
    }
    const ext = exts[attempt++];
    const candidateUrl = SUPABASE_URL + "/storage/v1/object/public/" + SOMATIC_BUCKET + "/" + baseKey + "." + ext;
    imgEl.onload = () => {
      somaticBucketMap[baseKey] = candidateUrl;
      filePill.textContent = baseKey + "." + ext;
      fbEl.style.display = "none";
      imgEl.style.display = "block";
    };
    imgEl.onerror = () => {
      tryNextExt();
    };
    imgEl.src = candidateUrl;
  }

  tryNextExt();
}

function renderSomaticCard() {
  if (somaticCurrentIdx >= somaticActiveDeck.length) {
    showSomaticSynthesisStep();
    return;
  }

  const card = somaticActiveDeck[somaticCurrentIdx];
  document.getElementById("somatic-progress-counter").textContent = "Kort " + (somaticCurrentIdx + 1) + " av " + somaticActiveDeck.length;
  document.getElementById("somatic-phase-badge").textContent = card.isAnchor ? "KALIBRERING" : (card.module === "BODY" ? "KROPPSMATRIS" : "HAND & FOT");
  document.getElementById("somatic-module-pill").textContent = card.module === "BODY" ? "MODUL 1: KROPP (FORM + FÄRG)" : "MODUL 2: HAND/FOT (TEXTUR + VÄRME)";
  document.getElementById("somatic-card-tag").textContent = card.isAnchor ? "KALIBRERINGSANKARE" : "PROJEKTIV STIMULI";
  document.getElementById("somatic-card-title").textContent = card.title;
  document.getElementById("somatic-card-sub").textContent = card.sub;
  document.getElementById("somatic-card-code").textContent = card.code;

  loadSomaticVisual(card);
  closeSomaticWheel();
  somaticCardShownAt = performance.now();
}

function renderSomaticWheelNodes(step) {
  const card = somaticActiveDeck[somaticCurrentIdx];
  if (!card) return;
  const wheelSpec = SOMATIC_WHEELS[card.module];
  const items = step === 1 ? wheelSpec.forms : wheelSpec.colors;

  document.getElementById("somatic-wheel-step-lbl").textContent = step === 1 ? "STEG 1" : "STEG 2";
  document.getElementById("somatic-wheel-step-title").textContent = step === 1 ? wheelSpec.step1Title : wheelSpec.step2Title;

  const nodesEl = document.getElementById("somatic-wheel-nodes");
  nodesEl.innerHTML = "";
  const radius = 102;
  const center = 136;

  items.forEach((item, idx) => {
    const angleDeg = idx * 60 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);

    const node = document.createElement("div");
    node.className = "somatic-wheel-node";
    node.style.left = x + "px";
    node.style.top = y + "px";
    node.dataset.index = idx;

    if (step === 1) {
      node.innerHTML = item.svg + '<span class="somatic-node-label">' + item.label + '</span>';
    } else {
      node.style.background = item.hex;
      node.innerHTML = '<span class="somatic-node-label">' + item.label + '</span>';
    }

    node.addEventListener("click", (e) => {
      e.stopPropagation();
      commitSomaticWheelChoice(idx);
    });

    nodesEl.appendChild(node);
  });
}

function openSomaticWheel() {
  somaticWheelStep = 1;
  somaticTempForm = null;
  renderSomaticWheelNodes(1);
  const ov = document.getElementById("somatic-wheel-overlay");
  if (ov) ov.classList.add("active");
}

function closeSomaticWheel() {
  const ov = document.getElementById("somatic-wheel-overlay");
  if (ov) ov.classList.remove("active");
}

function commitSomaticWheelChoice(itemIdx) {
  const card = somaticActiveDeck[somaticCurrentIdx];
  if (!card) return;
  const wheelSpec = SOMATIC_WHEELS[card.module];

  if (somaticWheelStep === 1) {
    somaticTempForm = wheelSpec.forms[itemIdx];
    somaticWheelStep = 2;
    renderSomaticWheelNodes(2);
  } else {
    const selectedColor = wheelSpec.colors[itemIdx];
    const latencyMs = Math.round(performance.now() - somaticCardShownAt);
    closeSomaticWheel();
    recordSomaticCardSwipe(card, somaticTempForm, selectedColor, latencyMs);
  }
}

let somaticHighlightedIdx = null;

function initSomaticWheelListeners() {
  const vp = document.getElementById("somatic-viewport");
  const ov = document.getElementById("somatic-wheel-overlay");
  const wc = document.getElementById("somatic-wheel-container");
  const nodesEl = document.getElementById("somatic-wheel-nodes");
  if (!vp || !ov || !wc || !nodesEl) return;

  vp.addEventListener("pointerdown", () => {
    if (!ov.classList.contains("active")) {
      openSomaticWheel();
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!ov.classList.contains("active")) return;
    const rect = wc.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    const nodes = nodesEl.querySelectorAll(".somatic-wheel-node");
    nodes.forEach(n => n.classList.remove("highlighted"));

    if (dist > 36) {
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      const sector = Math.round(deg / 60) % 6;
      somaticHighlightedIdx = sector;
      if (nodes[sector]) nodes[sector].classList.add("highlighted");
    } else {
      somaticHighlightedIdx = null;
    }
  });

  window.addEventListener("pointerup", () => {
    if (!ov.classList.contains("active")) return;
    if (somaticHighlightedIdx !== null) {
      const chosen = somaticHighlightedIdx;
      somaticHighlightedIdx = null;
      commitSomaticWheelChoice(chosen);
    }
  });
}

function somaticCombineVec(f, c) {
  return [
    (f.vec[0] + c.vec[0]) / 2,
    (f.vec[1] + c.vec[1]) / 2,
    (f.vec[2] + c.vec[2]) / 2
  ];
}

function somaticEuclidean(v1, v2) {
  if (!v1 || !v2) return 1.2;
  const d0 = v1[0] - v2[0];
  const d1 = v1[1] - v2[1];
  const d2 = v1[2] - v2[2];
  return Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2);
}

function recordSomaticCardSwipe(card, formObj, colorObj, latencyMs) {
  const vec = somaticCombineVec(formObj, colorObj);

  if (card.isAnchor) {
    somaticAnchors[card.module][card.anchorType] = vec;
    document.getElementById("somatic-tel-lat").textContent = latencyMs + " ms";
    document.getElementById("somatic-tel-log").textContent =
      "Kalibrerade " + card.code + ": " + formObj.label + " + " + colorObj.label + " (" + latencyMs + " ms)";
  } else {
    const modA = somaticAnchors[card.module];
    const distPleasure = somaticEuclidean(vec, modA.PLEASURE || [0.85, 0.5, -0.5]);
    const distSafety = somaticEuclidean(vec, modA.SAFETY || [0.85, -0.7, -0.5]);

    const pleasureAffinity = Math.max(0, Math.min(1, 1 - distPleasure / 2.4));
    const safetyAffinity = Math.max(0, Math.min(1, 1 - distSafety / 2.4));

    somaticSwipeLog.push({
      code: card.code,
      file: card.file,
      module: card.module,
      form: formObj.id,
      formLabel: formObj.label,
      color: colorObj.id,
      colorLabel: colorObj.label,
      latencyMs: latencyMs,
      pleasureAffinity: Number(pleasureAffinity.toFixed(3)),
      safetyAffinity: Number(safetyAffinity.toFixed(3)),
      meta: card
    });

    document.getElementById("somatic-tel-lat").textContent = latencyMs + " ms";
    document.getElementById("somatic-tel-pleasure").textContent = Math.round(pleasureAffinity * 100) + "%";
    document.getElementById("somatic-tel-safety").textContent = Math.round(safetyAffinity * 100) + "%";
    document.getElementById("somatic-tel-log").textContent =
      "Registrerade " + card.file + ": " + formObj.label + " + " + colorObj.label + " ➔ Lust-närhet " + Math.round(pleasureAffinity * 100) + "%";
  }

  const finishedCardCount = somaticCurrentIdx + 1;
  somaticCurrentIdx++;

  if (somaticScheduledDevils[finishedCardCount]) {
    triggerGlobalOffGuardDevil(
      somaticScheduledDevils[finishedCardCount],
      "Off-Guard i Somatiskt Flöde",
      () => {
        const cl = computeGlobalClarityMetrics();
        document.getElementById("somatic-tel-clarity").textContent = cl.profileClarityPct + "%";
        renderSomaticCard();
      }
    );
  } else {
    renderSomaticCard();
  }
}

function buildSomaticThreeLayerSynthesis() {
  const bodySwipes = somaticSwipeLog.filter(r => r.module === "BODY");
  const tacSwipes = somaticSwipeLog.filter(r => r.module === "TACTILE");

  let wVol = 2.5, wMusc = 3.0, topBodyStyle = "BIO";
  if (bodySwipes.length > 0) {
    let sumW = 0, sumVol = 0, sumMusc = 0;
    const styleScores = {};
    bodySwipes.forEach(s => {
      const w = Math.pow(s.pleasureAffinity + 0.1, 2);
      sumW += w;
      sumVol += s.meta.volume * w;
      sumMusc += s.meta.muscle * w;
      styleScores[s.meta.style] = (styleScores[s.meta.style] || 0) + w;
    });
    wVol = Number((sumVol / sumW).toFixed(2));
    wMusc = Number((sumMusc / sumW).toFixed(2));
    topBodyStyle = Object.keys(styleScores).sort((a, b) => styleScores[b] - styleScores[a])[0] || "BIO";
  }

  let wAct = 3.0, wScale = 3.0, wDen = 3.0;
  if (tacSwipes.length > 0) {
    let sumW = 0, sumAct = 0, sumSc = 0, sumDen = 0;
    tacSwipes.forEach(s => {
      const w = (s.pleasureAffinity + s.safetyAffinity) / 2 + 0.1;
      sumW += w;
      sumAct += s.meta.activity * w;
      sumSc += s.meta.scale * w;
      sumDen += s.meta.density * w;
    });
    wAct = Number((sumAct / sumW).toFixed(2));
    wScale = Number((sumSc / sumW).toFixed(2));
    wDen = Number((sumDen / sumW).toFixed(2));
  }

  const clarity = computeGlobalClarityMetrics();

  return {
    session_code: (sessionData && sessionData.user) ? sessionData.user.id : ("ANON-" + Math.random().toString(36).substring(2, 8).toUpperCase()),
    test_mode: document.getElementById("somatic-scope-select") ? document.getElementById("somatic-scope-select").value : "quick_all",
    body_synthesis: {
      preferred_volume_1_to_4: wVol,
      preferred_muscle_1_to_5: wMusc,
      dominant_art_resonance: topBodyStyle,
      sample_count: bodySwipes.length
    },
    tactile_synthesis: {
      activity_axis_1_pas_5_act: wAct,
      scale_axis_1_small_5_large: wScale,
      density_axis_1_slend_5_thick: wDen,
      sample_count: tacSwipes.length
    },
    clarity_metrics: clarity
  };
}

function showSomaticSynthesisStep() {
  document.getElementById("somatic-step-intro").style.display = "none";
  document.getElementById("somatic-step-arena").style.display = "none";
  document.getElementById("somatic-step-report").style.display = "block";

  const syn = buildSomaticThreeLayerSynthesis();
  const volDesc = syn.body_synthesis.preferred_volume_1_to_4 < 2.1 ? "Slank / Lätt" :
                  (syn.body_synthesis.preferred_volume_1_to_4 > 3.0 ? "Fyllig / Tungt grundad" : "Balanserad / Normal");
  const muscDesc = syn.body_synthesis.preferred_muscle_1_to_5 > 3.1 ? "Muskulös / Spänd tonus" : "Mjuk / Eftergivlig tonus";
  const actDesc = syn.tactile_synthesis.activity_axis_1_pas_5_act > 3.0 ? "Aktiv & Handlingskraftig" : "Passiv & Vilande";
  const scaleDesc = syn.tactile_synthesis.scale_axis_1_small_5_large > 3.0 ? "Stor & Skyddande skala" : "Liten & Finkänslig skala";
  const denDesc = syn.tactile_synthesis.density_axis_1_slend_5_thick > 3.0 ? "Fyllig & Varm densitet" : "Smal & Senig struktur";

  const box = document.getElementById("somatic-report-layers");
  box.innerHTML =
    '<div class="somatic-layer-box">' +
      '<div class="somatic-layer-title">Lager 1: Somatisk Polaritet (Kroppsmatris — ' + syn.body_synthesis.sample_count + ' kort)</div>' +
      '<div class="somatic-metric-grid">' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Volymresonans (1–4)</div><div class="somatic-metric-val">' + syn.body_synthesis.preferred_volume_1_to_4 + ' (' + volDesc + ')</div></div>' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Muskeltonus (1–5)</div><div class="somatic-metric-val">' + syn.body_synthesis.preferred_muscle_1_to_5 + ' (' + muscDesc + ')</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="somatic-layer-box">' +
      '<div class="somatic-layer-title">Lager 2: Taktil &amp; Kinestetisk Polaritet (Händer &amp; Fötter — ' + syn.tactile_synthesis.sample_count + ' kort)</div>' +
      '<div class="somatic-metric-grid">' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Rörelseenergi (1–5)</div><div class="somatic-metric-val">' + syn.tactile_synthesis.activity_axis_1_pas_5_act + ' (' + actDesc + ')</div></div>' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Skala &amp; Densitet</div><div class="somatic-metric-val">' + syn.tactile_synthesis.scale_axis_1_small_5_large + ' (' + scaleDesc + ' · ' + denDesc + ')</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="somatic-layer-box">' +
      '<div class="somatic-layer-title">Lager 3: Djävulstestet (Off-Guard Profilskärpa)</div>' +
      '<div class="somatic-metric-grid">' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Profilskärpa</div><div class="somatic-metric-val">' + syn.clarity_metrics.profileClarityPct + '%</div></div>' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Helgonkvot (Halo Ratio)</div><div class="somatic-metric-val">' + Math.round(syn.clarity_metrics.haloRatio * 100) + '% (' + syn.clarity_metrics.avgLatencyMs + ' ms)</div></div>' +
      '</div>' +
      '<div style="font-size:0.82rem; color:#cbd5e1; margin-top:8px;">Bedömning: <strong style="color:#fde68a;">' + syn.clarity_metrics.statusLabel + '</strong></div>' +
    '</div>';
}

async function analyzeSomaticAndTactileWithArgon() {
  if (sessionData && getModuleAttempts("somatic_test") >= 1) {
    alert("Du har redan slutfört och sparat Somatisk & Taktil Projektion i din profil.");
    return;
  }
  if (sessionData) incrementModuleAttempts("somatic_test");

  const outEl = document.getElementById("somatic-argon-output");
  const btn = document.getElementById("btn-run-somatic-argon");
  outEl.style.display = "block";
  outEl.innerText = "Argon 4.0 analyserar dina synestetiska vektorer (Kroppsmatris, Händer/Fötter och Off-Guard Profilskärpa)...";
  btn.disabled = true;

  const synthesis = buildSomaticThreeLayerSynthesis();

  // Spara den anonymiserade vektorsyntesen i argon_somatic_profiles om tabellen finns
  try {
    await supabaseRequest("/rest/v1/argon_somatic_profiles", "POST", synthesis, sessionData ? sessionData.access_token : null);
  } catch (e) {
    console.warn("Notering: argon_somatic_profiles kunde ej skrivas (kör sql-skriptet vid behov):", e.message);
  }

  const systemPrompt = "Du är Argon 4.0, expert på synestetisk projektion, taktil neuropsykologi och relationsdynamik.\n" +
    "Användaren har genomfört vårt tre-lagers test:\n" +
    "- Lager 1: Somatisk Kroppsmatris (2-stegs radialval av geometrisk form + färg, viktat mot användarens egna kalibrerade lust- och trygghetsankare).\n" +
    "- Lager 2: Taktil Hand- och Fotstudie (2-stegs radialval av yttextur + termisk värme för passiva vs aktiva, små vs stora och smala vs fylliga händer/fötter).\n" +
    "- Lager 3: Off-Guard 'Djävulstest' (snabba mikrodilemman mitt i bildflödet som mäter Profilskärpa vs social fasad/Halo Ratio).\n\n" +
    "VIKTIG PRINCIP: Håll isär dessa lager i din tolkning! Blanda inte ihop fysisk/taktil gnista med moraliska värderingar, och kalla aldrig användaren för 'lögnare' under Lager 3 – beskriv det istället som hur skarp eller idealiserad bilden är.\n\n" +
    "Ge en varm, psykologiskt skarp och fascinerande spegling på SVENSKA under exakt dessa 4 rubriker:\n" +
    "1. Somatisk Resonans & Fysisk Närvaro (Vad personens nervsystem dras till och lugnas av i kroppslig volym, mjukhet kontra muskeltonus)\n" +
    "2. Taktil & Kinestetisk Polaritet (Vad hand- och fotvalen avslöjar om behovet av aktiv handlingskraft/skydd kontra vilande mottaglighet och ömhet)\n" +
    "3. Off-Guard Profilskärpa & Självdistans (Vad svarstider och val i Djävulstestet säger om hur ofiltrerat eller idealiserat personen presenterar sig)\n" +
    "4. Betydelse för Matchning (Hur den somatiska/taktila gnistan samspelar med – eller utmanar – det personen söker i en långsiktig relation).\n" +
    "Max 300 ord.";

  try {
    const reply = await callGeminiDirect("argon", systemPrompt, [
      { role: "user", parts: [{ text: JSON.stringify(synthesis, null, 2) }] }
    ]);
    outEl.innerText = reply;

    const actionsEl = document.getElementById("somatic-standalone-actions");
    if (actionsEl) actionsEl.style.display = "flex";

    const existingProf = document.getElementById("profile-text") ? document.getElementById("profile-text").innerText.trim() : "";
    if (existingProf && sessionData && sessionData.user) {
      const combined = attachCompletedModulesStamp(
        existingProf + "\n\n--- SOMATISK & TAKTIL POLARITET + PROFILSKÄRPA (ARGON 4.0) ---\n" + reply
      );
      document.getElementById("profile-text").innerText = stripModulesStampForDisplay(combined);
      await supabaseRequest("/rest/v1/profiler?user_id=eq." + sessionData.user.id, "PATCH", {
        profil_text: combined
      }, sessionData.access_token);
    }
  } catch (err) {
    enqueueArgonJob({
      type: "somatic_profile",
      label: "Somatisk & Taktil Projektion + Profilskärpa",
      systemPrompt: systemPrompt,
      contents: [{ role: "user", parts: [{ text: JSON.stringify(synthesis, null, 2) }] }]
    });
    outEl.innerText = "⏳ STRIKT ARGON-KÖ AKTIVERAD (" + err.message + ")\n\n" +
      "Dina tre separerade lager (Kroppsmatris, Händer/Fötter och Off-Guard Profilskärpa) är nu säkrade i kö-motorn!\n" +
      "• Systemet försöker nå Argon 4.0 automatiskt var 10:e minut i bakgrunden.\n" +
      "• Analysen läggs till i din profil så fort Argon svarar.";
  } finally {
    btn.disabled = false;
  }
}

function downloadSomaticJsonReport() {
  const data = buildSomaticThreeLayerSynthesis();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "relationspiloten_somatisk_syntes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.openSomaticLab = openSomaticLab;
window.exitSomaticLab = exitSomaticLab;
window.abortSomaticToIntro = abortSomaticToIntro;
window.startSomaticLabSession = startSomaticLabSession;
window.analyzeSomaticAndTactileWithArgon = analyzeSomaticAndTactileWithArgon;
window.downloadSomaticJsonReport = downloadSomaticJsonReport;
window.initSomaticWheelListeners = initSomaticWheelListeners;
window.updateHubClarityBadge = updateHubClarityBadge;
