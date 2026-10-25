// =========================================================================
// 7.5. SOMATISK & TAKTIL PROJEKTION (2-STEGS RADIALHJUL) + DJÄVULSTESTET
// =========================================================================

const SOMATIC_BUCKET = "stimuli";
let somaticBucketMap = {}; // mappar basnamn (t.ex. "b01", "h1", "ba1") -> full public URL

const SOMATIC_WHEELS = {
  // 6 ortogonala, icke-överlappande poler som undviker bokstavlig konststilsmatchning
  // (t.ex. ingen "Kub" som krockar med Kubism och inga "Terrakotta/Rödkrita"-dubletter)
  BODY: {
    step1Title: "FORMKRAFT",
    step2Title: "FÄRGKLANG",
    forms: [
      {
        id: "FORM_CIRCLE", label: "Cirkel (Ro)", vec: [0.90, -0.80, -0.55],
        svg: '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="11.5" fill="none" stroke="#fcd34d" stroke-width="2.6"/><circle cx="18" cy="18" r="3" fill="#fcd34d" opacity="0.6"/></svg>'
      },
      {
        id: "FORM_ORGANIC_WAVE", label: "Våg (Flöde)", vec: [0.85, 0.20, -0.85],
        svg: '<svg viewBox="0 0 36 36"><path d="M4 16 C10 7, 16 25, 22 14 C26 8, 30 18, 33 13" fill="none" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/><path d="M4 23 C10 14, 16 32, 22 21 C26 15, 30 25, 33 20" fill="none" stroke="#fcd34d" stroke-width="2.0" opacity="0.75" stroke-linecap="round"/></svg>'
      },
      {
        id: "FORM_SPIRAL", label: "Spiral (Drag)", vec: [0.90, 0.90, 0.05],
        svg: '<svg viewBox="0 0 36 36"><path d="M18 18 m0 0 a2 2 0 1 0 4 0 a5 5 0 1 0 -9 0 a8.5 8.5 0 1 0 16 0 a12 12 0 1 0 -23 0" fill="none" stroke="#fcd34d" stroke-width="2.3" stroke-linecap="round"/></svg>'
      },
      {
        id: "FORM_ARCH", label: "Valv (Tyngd)", vec: [0.60, 0.10, 0.90],
        svg: '<svg viewBox="0 0 36 36"><path d="M6 28 C6 11, 30 11, 30 28 Z" fill="none" stroke="#fcd34d" stroke-width="2.6" stroke-linejoin="round"/><line x1="4" y1="28" x2="32" y2="28" stroke="#fcd34d" stroke-width="2.8" stroke-linecap="round"/></svg>'
      },
      {
        id: "FORM_HORIZON", label: "Horisont (Sval)", vec: [-0.25, -0.85, 0.25],
        svg: '<svg viewBox="0 0 36 36"><line x1="4" y1="18" x2="32" y2="18" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="24" x2="26" y2="24" stroke="#fcd34d" stroke-width="1.8" opacity="0.6" stroke-linecap="round"/></svg>'
      },
      {
        id: "FORM_SHARD", label: "Skärva (Taggar)", vec: [-0.90, 0.90, 0.40],
        svg: '<svg viewBox="0 0 36 36"><polyline points="5,26 13,8 18,22 25,6 31,28" fill="none" stroke="#fcd34d" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>'
      }
    ],
    colors: [
      { id: "COLOR_RUBY_SPARK", label: "Rubin", hex: "#D62839", vec: [0.90, 0.90, 0.05] },
      { id: "COLOR_WARM_AMBER", label: "Bärnsten", hex: "#F4A261", vec: [0.85, 0.20, -0.85] },
      { id: "COLOR_SAGE_CALM", label: "Salvia", hex: "#2A9D8F", vec: [0.90, -0.80, -0.55] },
      { id: "COLOR_DEEP_FOREST", label: "Skogsro", hex: "#3A5A40", vec: [0.60, 0.10, 0.90] },
      { id: "COLOR_COOL_MIST", label: "Silverdimma", hex: "#6C7A89", vec: [-0.25, -0.85, 0.25] },
      { id: "COLOR_ELECTRIC_VIOLET", label: "Nattviol", hex: "#7209B7", vec: [-0.90, 0.90, 0.40] }
    ]
  },
  TACTILE: {
    step1Title: "KÄNSEL",
    step2Title: "TEMPERATUR",
    forms: [
      {
        id: "TEX_EMBRACE", label: "Dunbädd", vec: [0.90, -0.80, -0.55],
        svg: '<svg viewBox="0 0 36 36"><path d="M8 24 C5 24, 4 18, 9 16 C10 10, 19 9, 22 14 C27 13, 31 18, 28 24 Z" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linejoin="round"/></svg>'
      },
      {
        id: "TEX_CARESS", label: "Smekning", vec: [0.85, 0.20, -0.85],
        svg: '<svg viewBox="0 0 36 36"><path d="M5 15 Q18 7, 31 15 M5 22 Q18 14, 31 22" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>'
      },
      {
        id: "TEX_PULSE", label: "Pulsvåg", vec: [0.90, 0.90, 0.05],
        svg: '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="3.5" fill="#fcd34d"/><circle cx="18" cy="18" r="8" fill="none" stroke="#fcd34d" stroke-width="2.2"/><circle cx="18" cy="18" r="13" fill="none" stroke="#fcd34d" stroke-width="1.6" opacity="0.7"/></svg>'
      },
      {
        id: "TEX_ANCHOR_GRIP", label: "Kraftgrepp", vec: [0.60, 0.10, 0.90],
        svg: '<svg viewBox="0 0 36 36"><path d="M8 12 L28 24 M28 12 L8 24 M18 6 L18 30" fill="none" stroke="#fcd34d" stroke-width="2.6" stroke-linecap="round"/></svg>'
      },
      {
        id: "TEX_SMOOTH_GLASS", label: "Spegelglas", vec: [-0.25, -0.85, 0.25],
        svg: '<svg viewBox="0 0 36 36"><rect x="7" y="13" width="22" height="10" rx="5" fill="none" stroke="#fcd34d" stroke-width="2.2"/><line x1="12" y1="16" x2="20" y2="16" stroke="#fcd34d" stroke-width="1.6" stroke-linecap="round"/></svg>'
      },
      {
        id: "TEX_THORN_ICE", label: "Taggfrost", vec: [-0.90, 0.90, 0.40],
        svg: '<svg viewBox="0 0 36 36"><path d="M7 27 L15 9 L20 23 L27 8 L30 27" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
    ],
    colors: [
      { id: "THERM_PULSE_EMBER", label: "Glöd", hex: "#E63946", vec: [0.90, 0.90, 0.05] },
      { id: "THERM_SUN_SKIN", label: "Solvärme", hex: "#F4A261", vec: [0.85, 0.20, -0.85] },
      { id: "THERM_MOSS_REST", label: "Mossa", hex: "#40916C", vec: [0.90, -0.80, -0.55] },
      { id: "THERM_DEEP_BARK", label: "Cederträ", hex: "#6C584C", vec: [0.60, 0.10, 0.90] },
      { id: "THERM_MIST_SLATE", label: "Sval skiffer", hex: "#64748B", vec: [-0.25, -0.85, 0.25] },
      { id: "THERM_NIGHT_FROST", label: "Nattfrost", hex: "#5E548E", vec: [-0.90, 0.90, 0.40] }
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

    const audioKeys = ["bed1", "bed2", "bed3", "bed4", "v1", "v2", "v3", "v4"];
    const foundAudio = audioKeys.filter(k => !!somaticBucketMap[k]).length;
    if (statusEl) {
      if (count > 0) {
        statusEl.style.color = "#6ee7b7";
        statusEl.innerHTML = "✅ <strong>" + count + "</strong> filer i Supabase-bucketen <code>stimuli</code> (varav <strong>" + foundAudio + " / 8</strong> psykoakustiska ljudspår <code>bed1–v4</code>)!";
      } else {
        statusEl.style.color = "#fde68a";
        statusEl.innerHTML = "ℹ️ Bucketen <code>stimuli</code> är tom eller ej skapad än (visar konstnärliga SVG-förlagor och synkroniserad Cue-Sheet-tidslinje tills filerna laddats upp).";
      }
    }
  } catch (e) {
    console.warn("Kunde inte lista stimuli-bucket:", e);
  }
}
window.syncSupabaseStimuliBucket = syncSupabaseStimuliBucket;

// =========================================================================
// SOMATISK & TAKTIL RADIAL-SESSION (ALLTID ALLA 88 BILDER + MELLANSKÄRM VID 68->69)
// =========================================================================
let somaticActiveDeck = [];
let somaticCurrentIdx = 0;
let somaticCardShownAt = 0;
let somaticWheelStep = 1;
let somaticTempForm = null;
let somaticTactileIntroShown = false;
let somaticAnchors = {
  BODY: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null },
  TACTILE: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null }
};
let somaticSwipeLog = [];
let somaticScheduledDevils = {};

function openSomaticLab() {
  if (typeof stopCrmTrackingTimers === "function") stopCrmTrackingTimers();
  syncSupabaseStimuliBucket();
  document.body.classList.remove("swipe-locked");
  switchView("view-somatic-lab");
  document.getElementById("somatic-step-intro").style.display = "block";
  document.getElementById("somatic-step-arena").style.display = "none";
  const trEl = document.getElementById("somatic-step-transition");
  if (trEl) trEl.style.display = "none";
  const crmIntro = document.getElementById("somatic-step-crm-intro");
  if (crmIntro) crmIntro.style.display = "none";
  const crmArena = document.getElementById("somatic-step-crm-arena");
  if (crmArena) crmArena.style.display = "none";
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
  if (typeof stopCrmTrackingTimers === "function") stopCrmTrackingTimers();
  document.getElementById("somatic-step-arena").style.display = "none";
  const trEl = document.getElementById("somatic-step-transition");
  if (trEl) trEl.style.display = "none";
  const crmIntro = document.getElementById("somatic-step-crm-intro");
  if (crmIntro) crmIntro.style.display = "none";
  const crmArena = document.getElementById("somatic-step-crm-arena");
  if (crmArena) crmArena.style.display = "none";
  document.getElementById("somatic-step-report").style.display = "none";
  document.getElementById("somatic-step-intro").style.display = "block";
}

function buildSomaticDeck() {
  // Kör alltid samtliga 88 bilder i sekvens:
  // Kort 1–4: Kroppsankare (ba1–ba4)
  // Kort 5–68: 64 Kroppsarketyper (b01–b64)
  // [Mellanskärm: Förklaring inför Händer & Fötter]
  // Kort 69–72: Taktila ankare (ta1–ta4)
  // Kort 73–88: 16 Händer & Fötter (h1–h8, f1–f8)
  const deck = [
    ...SOMATIC_CATALOG.bodyAnchors,
    ...SOMATIC_CATALOG.bodyCards,
    ...SOMATIC_CATALOG.tactileAnchors,
    ...SOMATIC_CATALOG.tactileCards
  ];

  somaticScheduledDevils = {};
  const checkpoints = [10, 22, 34, 46, 58, 66, 76, 84];
  checkpoints.forEach((cp, idx) => {
    if (DEVIL_QUESTIONS_POOL[idx]) {
      somaticScheduledDevils[cp] = DEVIL_QUESTIONS_POOL[idx];
    }
  });

  return deck;
}

async function startSomaticLabSession() {
  if (sessionData && getModuleAttempts("somatic_test") >= 1) {
    alert("Du har redan genomfört Somatisk & Taktil Projektion i din profil (1 försök gäller). Be Admin nollställa räknaren om du blev avbruten.");
    return;
  }

  somaticActiveDeck = buildSomaticDeck();
  somaticCurrentIdx = 0;
  somaticSwipeLog = [];
  somaticTactileIntroShown = false;
  crmTrackLogs = {};
  crmCurrentTrackIdx = 0;
  somaticAnchors = {
    BODY: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null },
    TACTILE: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null }
  };

  document.getElementById("somatic-step-intro").style.display = "none";
  const trEl = document.getElementById("somatic-step-transition");
  if (trEl) trEl.style.display = "none";
  document.getElementById("somatic-step-report").style.display = "none";
  document.getElementById("somatic-step-arena").style.display = "block";

  // Kontrollera mot Supabase INNAN somatiska bildserien startar om Färg/Form-stegen ska köras (om < 2 ggr)
  await maybeTriggerColorFormMoodCheck('Inför Somatisk & Taktil Projektion', () => {
    renderSomaticCard();
  });
}

function continueToTactilePhase() {
  somaticTactileIntroShown = true;
  const trEl = document.getElementById("somatic-step-transition");
  if (trEl) trEl.style.display = "none";
  document.getElementById("somatic-step-arena").style.display = "block";
  renderSomaticCard();
}

function getSomaticFallbackSvg(card) {
  if (card.isAnchor) {
    if (card.anchorType === "PLEASURE") {
      return '<svg viewBox="0 0 240 300" width="210" height="260">' +
        '<defs><radialGradient id="sgPl" cx="45%" cy="40%" r="55%"><stop offset="0%" stop-color="#f87171"/><stop offset="60%" stop-color="#991b1b"/><stop offset="100%" stop-color="#450a0a"/></radialGradient></defs>' +
        '<path d="M55 120 Q120 85 185 120 Q120 155 55 120 Z" fill="#b91c1c" opacity="0.5"/>' +
        '<path d="M120 75 C165 75, 175 145, 120 215 C65 145, 75 75, 120 75 Z" fill="url(#sgPl)"/>' +
        '<circle cx="105" cy="125" r="2.2" fill="#fde047"/><circle cx="135" cy="130" r="2.2" fill="#fde047"/><circle cx="120" cy="158" r="2.2" fill="#fde047"/></svg>';
    }
    if (card.anchorType === "SAFETY") {
      return '<svg viewBox="0 0 240 300" width="210" height="260">' +
        '<defs><radialGradient id="sgSf" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde68a"/><stop offset="70%" stop-color="#b45309"/><stop offset="100%" stop-color="#3f2e21"/></radialGradient></defs>' +
        '<ellipse cx="120" cy="175" rx="82" ry="48" fill="#4a5338" opacity="0.55"/>' +
        '<circle cx="120" cy="150" r="54" fill="url(#sgSf)"/>' +
        '<path d="M88 145 Q120 175 152 145" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/></svg>';
    }
    if (card.anchorType === "THREAT") {
      return '<svg viewBox="0 0 240 300" width="210" height="260">' +
        '<path d="M25 80 L215 220 M25 210 L215 90 M40 150 L200 150" stroke="#9ca3af" stroke-width="3.5"/>' +
        '<polygon points="80,105 95,75 102,115 70,125" fill="#ef4444"/>' +
        '<polygon points="145,135 168,110 160,158 132,160" fill="#dc2626"/></svg>';
    }
    return '<svg viewBox="0 0 240 300" width="210" height="260">' +
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

    return '<svg viewBox="0 0 240 300" width="210" height="260">' +
      '<path d="M ' + (120 - shoulder) + ' 75 Q ' + (120 - waist) + ' 145 ' + (120 - hip) + ' 225 L ' + (120 + hip) + ' 225 Q ' + (120 + waist) + ' 145 ' + (120 + shoulder) + ' 75 Z" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<line x1="120" y1="68" x2="120" y2="235" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4"/></svg>';
  }

  const strokeW = card.density === 5 ? 4.2 : 2.0;
  const scaleNum = card.scale === 5 ? 1.18 : 0.82;
  return '<svg viewBox="0 0 240 300" width="210" height="260">' +
    '<g transform="translate(120,150) scale(' + scaleNum + ') translate(-120,-150)">' +
    '<rect x="65" y="55" width="110" height="180" rx="8" fill="#fdf8f0" opacity="0.08"/>' +
    '<path d="M85 210 C80 165, 75 110, 92 85 C98 115, 102 135, 104 80 C112 115, 118 135, 122 78 C130 115, 136 135, 142 88 C152 120, 158 145, 165 118 C168 160, 155 195, 145 215 Z" fill="rgba(184, 58, 44, 0.28)" stroke="#d97706" stroke-width="' + strokeW + '" stroke-linejoin="round"/></g></svg>';
}

function loadSomaticVisual(card) {
  const imgEl = document.getElementById("somatic-stimulus-img");
  const fbEl = document.getElementById("somatic-fallback-container");

  const baseKey = card.file.toLowerCase();

  if (somaticBucketMap[baseKey]) {
    imgEl.onload = () => {
      fbEl.style.display = "none";
      imgEl.style.display = "block";
    };
    imgEl.onerror = () => {
      imgEl.style.display = "none";
      fbEl.style.display = "flex";
      fbEl.innerHTML = getSomaticFallbackSvg(card);
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
      fbEl.innerHTML = getSomaticFallbackSvg(card);
      return;
    }
    const ext = exts[attempt++];
    const candidateUrl = SUPABASE_URL + "/storage/v1/object/public/" + SOMATIC_BUCKET + "/" + baseKey + "." + ext;
    imgEl.onload = () => {
      somaticBucketMap[baseKey] = candidateUrl;
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
    openCrmIntroStep();
    return;
  }

  const card = somaticActiveDeck[somaticCurrentIdx];

  // När användaren precis har avslutat alla 68 kroppsbilder och ska börja på del 2 (Händer & Fötter):
  // Visa den förklarande mellanskärmen först!
  if (card.module === "TACTILE" && !somaticTactileIntroShown) {
    closeSomaticWheel();
    document.getElementById("somatic-step-arena").style.display = "none";
    const trEl = document.getElementById("somatic-step-transition");
    if (trEl) {
      trEl.style.display = "block";
      return;
    }
  }

  const counterEl = document.getElementById("somatic-progress-counter");
  if (counterEl) {
    counterEl.textContent = (somaticCurrentIdx + 1) + " / " + somaticActiveDeck.length;
  }

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
  } else {
    const modA = somaticAnchors[card.module];
    const distPleasure = somaticEuclidean(vec, modA.PLEASURE || [0.90, 0.90, 0.05]);
    const distSafety = somaticEuclidean(vec, modA.SAFETY || [0.90, -0.80, -0.55]);

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
  }

  const finishedCardCount = somaticCurrentIdx + 1;
  somaticCurrentIdx++;

  if (somaticScheduledDevils[finishedCardCount]) {
    triggerGlobalOffGuardDevil(
      somaticScheduledDevils[finishedCardCount],
      "Snabb impuls",
      () => {
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
  const crmSyn = (typeof buildPsychoacousticCrmSynthesis === "function") ? buildPsychoacousticCrmSynthesis() : null;

  return {
    session_code: (sessionData && sessionData.user) ? sessionData.user.id : ("ANON-" + Math.random().toString(36).substring(2, 8).toUpperCase()),
    test_mode: "full_88_plus_crm_8",
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
    psychoacoustic_crm_synthesis: crmSyn,
    clarity_metrics: clarity,
    mood_symbol_compass: getMoodLadderSynthesisForArgon()
  };
}

function showSomaticSynthesisStep() {
  if (typeof stopCrmTrackingTimers === "function") stopCrmTrackingTimers();
  document.getElementById("somatic-step-intro").style.display = "none";
  document.getElementById("somatic-step-arena").style.display = "none";
  const trEl = document.getElementById("somatic-step-transition");
  if (trEl) trEl.style.display = "none";
  const crmIntro = document.getElementById("somatic-step-crm-intro");
  if (crmIntro) crmIntro.style.display = "none";
  const crmArena = document.getElementById("somatic-step-crm-arena");
  if (crmArena) crmArena.style.display = "none";
  document.getElementById("somatic-step-report").style.display = "block";

  const syn = buildSomaticThreeLayerSynthesis();
  const volDesc = syn.body_synthesis.preferred_volume_1_to_4 < 2.1 ? "Slank / Lätt" :
                  (syn.body_synthesis.preferred_volume_1_to_4 > 3.0 ? "Fyllig / Tungt grundad" : "Balanserad / Normal");
  const muscDesc = syn.body_synthesis.preferred_muscle_1_to_5 > 3.1 ? "Muskulös / Spänd tonus" : "Mjuk / Eftergivlig tonus";
  const actDesc = syn.tactile_synthesis.activity_axis_1_pas_5_act > 3.0 ? "Aktiv & Handlingskraftig" : "Passiv & Vilande";
  const scaleDesc = syn.tactile_synthesis.scale_axis_1_small_5_large > 3.0 ? "Stor & Skyddande skala" : "Liten & Finkänslig skala";
  const denDesc = syn.tactile_synthesis.density_axis_1_slend_5_thick > 3.0 ? "Fyllig & Varm densitet" : "Smal & Senig struktur";

  const crm = syn.psychoacoustic_crm_synthesis || {
    total_crm_samples: 0,
    dominant_bed_world: "bed1",
    dominant_voice_archetype: "VOICE_DEEP_CHEST",
    climax_approach_vs_withdrawal: 0,
    vulnerability_intimacy_resonance: 0
  };
  const climaxDesc = crm.climax_approach_vs_withdrawal >= 0.15
    ? "Dras in i dramatoppar & intensiv puls"
    : (crm.climax_approach_vs_withdrawal <= -0.15 ? "Söker sval distans vid högt tryck" : "Balanserad respons i crescendon");
  const vulnDesc = crm.vulnerability_intimacy_resonance >= 0.15
    ? "Stannar kvar i hudnära sårbarhet"
    : "Vaksam vid avklädda tystnader";

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
    '<div class="somatic-layer-box" style="border-color:#38bdf8;">' +
      '<div class="somatic-layer-title" style="color:#38bdf8;">Lager 3: Psykoakustisk Continuous Affect Tracking (CRM — ' + crm.total_crm_samples + ' mätpunkter över bed1–v4)</div>' +
      '<div class="somatic-metric-grid">' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Starkast Ljudvärld &amp; Röstarketyp</div><div class="somatic-metric-val">' + crm.dominant_bed_world + ' · ' + crm.dominant_voice_archetype + '</div></div>' +
        '<div class="somatic-metric-item"><div class="somatic-metric-lbl">Dramatoppar &amp; Viskande Sårbarhet</div><div class="somatic-metric-val">' + climaxDesc + ' · ' + vulnDesc + '</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="somatic-layer-box">' +
      '<div class="somatic-layer-title">Lager 4: Djävulstestet (Off-Guard Profilskärpa)</div>' +
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
  if (sessionData) {
    incrementModuleAttempts("somatic_test");
    const crmCheck = (typeof buildPsychoacousticCrmSynthesis === "function") ? buildPsychoacousticCrmSynthesis() : null;
    if (crmCheck && crmCheck.total_crm_samples > 0) {
      incrementModuleAttempts("crm_test");
    }
  }

  const outEl = document.getElementById("somatic-argon-output");
  const btn = document.getElementById("btn-run-somatic-argon");
  outEl.style.display = "block";
  outEl.innerText = "Argon 4.0 analyserar dina synestetiska vektorer (Kroppsmatris, Händer/Fötter och Off-Guard Profilskärpa)...";
  btn.disabled = true;

  const synthesis = buildSomaticThreeLayerSynthesis();

  try {
    await supabaseRequest("/rest/v1/argon_somatic_profiles", "POST", synthesis, sessionData ? sessionData.access_token : null);
  } catch (e) {
    console.warn("Notering: argon_somatic_profiles kunde ej skrivas (kör sql-skriptet vid behov):", e.message);
  }

  const systemPrompt = "Du är Argon 4.0, expert på synestetisk projektion, taktil neuropsykologi, psykoakustisk Continuous Affect Tracking (CRM) och relationsdynamik.\n" +
    "Användaren har genomfört vårt 4-lagers test:\n" +
    "- Lager 1: Somatisk Kroppsmatris (2-stegs radialval av formkraft + färgklang över 68 kort, viktat mot kalibrerade lust- och trygghetsankare).\n" +
    "- Lager 2: Taktil Hand- och Fotstudie (2-stegs radialval av känsel + temperatur över 20 kort för passiva vs aktiva, små vs stora och smala vs fylliga händer/fötter).\n" +
    "- Lager 3: Psykoakustisk Continuous Affect Tracking (CRM) för ljudvärldar (bed1–bed4) och vokalarketyper (v1: VOICE_DEEP_CHEST, v2: VOICE_AIRY_WHISPER, v3: VOICE_CLEAR_LUMINOUS, v4: VOICE_RASPY_INTENSE), där användarens rörelsekurva korrelerats mot hela cue-sheetet (stråkentréer, drop-stop tystnader, dramatoppar och nakna viskande epiloger).\n" +
    "- Lager 4: Off-Guard 'Djävulstest' (snabba mikrodilemman som mäter Profilskärpa vs social fasad/Halo Ratio).\n\n" +
    "VIKTIG PRINCIP: Håll isär dessa lager i din tolkning! Kalla aldrig användaren för 'lögnare' under Lager 4 – beskriv det som hur skarp eller idealiserad självbilden är.\n\n" +
    "Ge en varm, psykologiskt skarp och fascinerande spegling på SVENSKA under exakt dessa 5 rubriker:\n" +
    "1. Somatisk Resonans & Fysisk Närvaro (Vad personens nervsystem dras till och lugnas av i kroppslig volym, mjukhet kontra muskeltonus)\n" +
    "2. Taktil & Kinestetisk Polaritet (Vad hand- och fotvalen avslöjar om behovet av aktiv handlingskraft/skydd kontra vilande mottaglighet och ömhet)\n" +
    "3. Psykoakustisk CRM & Vokal Kemi (Hur personens rörelsekurva reagerar på ljudvärldarna bed1–bed4 och röstarketyperna v1–v4 under dramatoppar, plötsliga tystnader och hudnära sårbarhet)\n" +
    "4. Off-Guard Profilskärpa & Självdistans (Vad svarstider och val i Djävulstestet säger om hur ofiltrerat eller idealiserat personen presenterar sig)\n" +
    "5. Betydelse för Matchning (Hur den somatiska, taktila och vokala gnistan samspelar med – eller utmanar – det personen söker i en långsiktig relation).\n" +
    "Max 360 ord.";

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
window.continueToTactilePhase = continueToTactilePhase;
window.analyzeSomaticAndTactileWithArgon = analyzeSomaticAndTactileWithArgon;
window.downloadSomaticJsonReport = downloadSomaticJsonReport;
window.initSomaticWheelListeners = initSomaticWheelListeners;
window.updateHubClarityBadge = updateHubClarityBadge;



// =========================================================================
// SUBJEKTIV FÄRG- & FORMSTEGE (BRA VS DÅLIGT HUMÖR + TEST-RETEST KOHERENS)
// MED AUTOMATISK SUPABASE-FÖRKONTROLL INNAN VARJE MOMENT (MAX 2 GÅNGER)
// =========================================================================

const MOOD_LADDER_STEPS = [
  {
    key: "colors_good_mood",
    kind: "COLORS",
    badge: "🎨 Symbolkompass — Steg 1 av 4",
    title: "En dag när du är på strålande humör",
    desc: "Du vaknar med energi, nyfikenhet och inre styrka. Klicka på färgerna i ordning från #1 (Mest tilltalande / bäst känsla) ner till #6 (Minst tilltalande)."
  },
  {
    key: "colors_bad_mood",
    kind: "COLORS",
    badge: "🌧️ Symbolkompass — Steg 2 av 4",
    title: "En dag när du är dränerad eller på dåligt humör",
    desc: "Du är trött, pressad eller ur balans. Hur ser din färgstege ut nu? Klicka i ordning från #1 (Ger mest lindring/stöd just då) ner till #6 (Skaver mest)."
  },
  {
    key: "forms_good_mood",
    kind: "FORMS",
    badge: "📐 Symbolkompass — Steg 3 av 4",
    title: "Former en dag när du är på bra humör",
    desc: "När du känner dig trygg, lekfull och på gott humör: klicka på formerna i ordning från #1 (Mest tilltalande) ner till #6 (Minst tilltalande)."
  },
  {
    key: "forms_bad_mood",
    kind: "FORMS",
    badge: "⚡ Symbolkompass — Steg 4 av 4",
    title: "Former en dag när du är på dåligt humör",
    desc: "När du är stressad, irriterad eller utmattad: klicka på formerna i ordning från #1 (Känns bäst att luta sig mot) ner till #6 (Känns mest frånstötande)."
  }
];

let activeMoodLadderStepIdx = 0;
let activeMoodLadderOrder = [];
let activeMoodLadderSessionData = {};
let activeMoodLadderCallback = null;
let activeMoodLadderContext = "";
let activeMoodLadderStepStartTime = 0;

function getLocalMoodLadderData() {
  try {
    const uid = (sessionData && sessionData.user && sessionData.user.id) ? sessionData.user.id : (currentAlias || "guest");
    const raw = localStorage.getItem("rp_mood_ladder_v1_" + uid);
    return raw ? JSON.parse(raw) : { count: 0, runs: [], synthesis: null };
  } catch (e) {
    return { count: 0, runs: [], synthesis: null };
  }
}

function saveLocalMoodLadderData(obj) {
  try {
    const uid = (sessionData && sessionData.user && sessionData.user.id) ? sessionData.user.id : (currentAlias || "guest");
    localStorage.setItem("rp_mood_ladder_v1_" + uid, JSON.stringify(obj || { count: 0, runs: [] }));
  } catch (e) {}
}

// Spearman rangkorrelation mellan två 6-elementslistor av ID:n (-1.00 till +1.00)
function computeRankCorrelation(orderA, orderB) {
  if (!Array.isArray(orderA) || !Array.isArray(orderB) || orderA.length !== 6 || orderB.length !== 6) return null;
  let sumD2 = 0;
  orderA.forEach((id, idxA) => {
    const idxB = orderB.indexOf(id);
    if (idxB !== -1) {
      const d = idxA - idxB;
      sumD2 += d * d;
    }
  });
  // rho = 1 - (6 * sum(d^2)) / (n*(n^2 - 1)), där n=6 => n*(n^2-1) = 210
  const rho = 1 - (6 * sumD2) / 210;
  return Number(rho.toFixed(2));
}

function buildMoodLadderSynthesis(runs) {
  if (!Array.isArray(runs) || runs.length === 0) return null;

  const r1 = runs[0];
  const colorShiftR1 = computeRankCorrelation(r1.colors_good_mood, r1.colors_bad_mood);
  const formShiftR1 = computeRankCorrelation(r1.forms_good_mood, r1.forms_bad_mood);

  let testRetestCoherence = null;
  let coherenceVerdict = "Endast 1 mätpunkt genomförd hittills (väntar på runda 2 för koherenscheck)";

  if (runs.length >= 2) {
    const r2 = runs[runs.length - 1];
    const cGood = computeRankCorrelation(r1.colors_good_mood, r2.colors_good_mood);
    const cBad = computeRankCorrelation(r1.colors_bad_mood, r2.colors_bad_mood);
    const fGood = computeRankCorrelation(r1.forms_good_mood, r2.forms_good_mood);
    const fBad = computeRankCorrelation(r1.forms_bad_mood, r2.forms_bad_mood);

    const avgRho = Number(((cGood + cBad + fGood + fBad) / 4).toFixed(2));
    // Omvandla rho (-1..1) till 0..100% koherensindex
    const coherencePct = Math.max(0, Math.min(100, Math.round(((avgRho + 1) / 2) * 100)));

    if (avgRho >= 0.55) {
      coherenceVerdict = "HÖG KOHERENS (" + coherencePct + "%, r=" + avgRho + ") — Genuin och stabil inre symbolkompass över tid.";
    } else if (avgRho >= 0.20) {
      coherenceVerdict = "MEDELHÖG KOHERENS (" + coherencePct + "%, r=" + avgRho + ") — Delvis stabil men dagsformsberoende.";
    } else {
      coherenceVerdict = "LÅG KOHERENS / SLUMPMÄSSIG (" + coherencePct + "%, r=" + avgRho + ") — Varning: Användaren har sannolikt klickat slumpmässigt utan förankring.";
    }

    testRetestCoherence = {
      spearman_avg_r: avgRho,
      coherence_pct: coherencePct,
      details: { color_good_r: cGood, color_bad_r: cBad, form_good_r: fGood, form_bad_r: fBad },
      verdict: coherenceVerdict
    };
  }

  const latest = runs[runs.length - 1];
  return {
    completed_runs_count: runs.length,
    latest_good_mood_top2_colors: (latest.colors_good_mood || []).slice(0, 2),
    latest_bad_mood_top2_colors: (latest.colors_bad_mood || []).slice(0, 2),
    latest_good_mood_top2_forms: (latest.forms_good_mood || []).slice(0, 2),
    latest_bad_mood_top2_forms: (latest.forms_bad_mood || []).slice(0, 2),
    mood_state_shift: {
      color_good_vs_bad_r: colorShiftR1,
      form_good_vs_bad_r: formShiftR1,
      interpretation: (colorShiftR1 !== null && colorShiftR1 < 0.25)
        ? "Stark tillståndsväxling: Personen söker helt andra färger/intryck för tröst vid dåligt humör än vid bra humör."
        : "Stabil bas: Personen föredrar liknande estetik oavsett humör."
    },
    test_retest_coherence: testRetestCoherence
  };
}

// KONTROLLERAR MED SUPABASE INNAN ETT MOMENT KÖRS!
// Returnerar exakt hur många gånger färg/formstegen har genomförts (0, 1 eller >=2)
async function checkSupabaseMoodLadderStatus() {
  let localObj = getLocalMoodLadderData();
  if (!sessionData || !sessionData.user) {
    return localObj.count || 0;
  }

  try {
    const rows = await supabaseRequest(
      "/rest/v1/profiler?user_id=eq." + sessionData.user.id + "&select=forsok_data",
      "GET",
      null,
      sessionData.access_token
    );
    if (rows && rows.length > 0 && rows[0].forsok_data && typeof rows[0].forsok_data === "object") {
      const fData = rows[0].forsok_data;
      const serverResetTs = Number(fData.admin_reset_ts || 0);
      const localResetTs = Number(localObj.admin_reset_ts || 0);

      // Om Admin har nollställt räknaren i Supabase raderas gammal historik
      if (serverResetTs > localResetTs && Number(fData.color_form_mood_test || 0) === 0) {
        localObj = { count: 0, runs: [], synthesis: null, admin_reset_ts: serverResetTs };
        saveLocalMoodLadderData(localObj);
        return 0;
      }

      const srvCount = Number(fData.color_form_mood_test || 0);
      const srvRuns = Array.isArray(fData.mood_ladder_runs) ? fData.mood_ladder_runs : [];

      if (srvRuns.length >= (localObj.runs || []).length) {
        localObj.runs = srvRuns;
        localObj.count = Math.max(srvCount, srvRuns.length);
        localObj.synthesis = fData.mood_ladder_synthesis || buildMoodLadderSynthesis(localObj.runs);
        saveLocalMoodLadderData(localObj);
      }
      return localObj.count || 0;
    }
  } catch (err) {
    console.warn("Supabase förkontroll av färg/formstege föll tillbaka på lokal cache:", err.message);
  }
  return localObj.count || 0;
}
window.checkSupabaseMoodLadderStatus = checkSupabaseMoodLadderStatus;

async function maybeTriggerColorFormMoodCheck(contextLabel, onComplete) {
  const doneCount = await checkSupabaseMoodLadderStatus();

  // Om användaren redan har gjort testet 2 gånger i Supabase: hoppa över direkt!
  if (doneCount >= 2) {
    if (typeof onComplete === "function") onComplete({ skipped: true, reason: "already_completed_twice", count: doneCount });
    return;
  }

  openMoodLadderModal(doneCount + 1, contextLabel, onComplete);
}
window.maybeTriggerColorFormMoodCheck = maybeTriggerColorFormMoodCheck;

function openMoodLadderModal(runNumber, contextLabel, onComplete) {
  const modal = document.getElementById("mood-ladder-modal");
  if (!modal) {
    if (typeof onComplete === "function") onComplete();
    return;
  }

  activeMoodLadderStepIdx = 0;
  activeMoodLadderOrder = [];
  activeMoodLadderSessionData = {
    run_number: runNumber,
    context: contextLabel || "CHECKPOINT",
    timestamp: new Date().toISOString(),
    step_latencies_ms: {}
  };
  activeMoodLadderContext = contextLabel || "CHECKPOINT";
  activeMoodLadderCallback = onComplete || null;

  renderMoodLadderCurrentStep();
  modal.classList.add("active");
}

function renderMoodLadderCurrentStep() {
  const stepSpec = MOOD_LADDER_STEPS[activeMoodLadderStepIdx];
  if (!stepSpec) return;

  activeMoodLadderOrder = [];
  activeMoodLadderStepStartTime = performance.now();

  const localObj = getLocalMoodLadderData();
  const runNum = (localObj.count || 0) + 1;

  document.getElementById("mood-ladder-badge").textContent =
    (runNum === 1 ? "🎨 Kalibrering #1: " : "🔄 Koherenscheck #2: ") + stepSpec.badge;
  document.getElementById("mood-ladder-step-counter").textContent =
    "Steg " + (activeMoodLadderStepIdx + 1) + " / 4";
  document.getElementById("mood-ladder-title").textContent = stepSpec.title;
  document.getElementById("mood-ladder-desc").textContent = stepSpec.desc;

  const itemsPool = stepSpec.kind === "COLORS"
    ? SOMATIC_WHEELS.BODY.colors
    : SOMATIC_WHEELS.BODY.forms;

  const grid = document.getElementById("mood-ladder-grid");
  grid.innerHTML = "";

  itemsPool.forEach(item => {
    const div = document.createElement("div");
    div.className = "mood-ladder-item";
    div.setAttribute("data-id", item.id);

    const swatch = document.createElement("div");
    swatch.className = "mood-swatch";
    if (stepSpec.kind === "COLORS") {
      swatch.style.background = item.hex;
    } else {
      swatch.style.background = "#11151f";
      swatch.innerHTML = item.svg;
    }

    const lblWrap = document.createElement("div");
    lblWrap.innerHTML = '<strong style="font-size:0.84rem; color:#fff; display:block;">' + item.label + '</strong>';

    const rankPill = document.createElement("div");
    rankPill.className = "mood-rank-pill";
    rankPill.textContent = "-";

    div.appendChild(swatch);
    div.appendChild(lblWrap);
    div.appendChild(rankPill);

    div.addEventListener("click", () => {
      const existingPos = activeMoodLadderOrder.indexOf(item.id);
      if (existingPos !== -1) {
        activeMoodLadderOrder.splice(existingPos, 1);
      } else {
        if (activeMoodLadderOrder.length < 6) {
          activeMoodLadderOrder.push(item.id);
        }
      }
      refreshMoodLadderGridUI();
    });

    grid.appendChild(div);
  });

  refreshMoodLadderGridUI();
}

function refreshMoodLadderGridUI() {
  const grid = document.getElementById("mood-ladder-grid");
  if (!grid) return;

  grid.querySelectorAll(".mood-ladder-item").forEach(el => {
    const id = el.getAttribute("data-id");
    const pos = activeMoodLadderOrder.indexOf(id);
    const pill = el.querySelector(".mood-rank-pill");
    if (pos !== -1) {
      el.classList.add("ranked");
      if (pill) pill.textContent = "#" + (pos + 1);
    } else {
      el.classList.remove("ranked");
      if (pill) pill.textContent = "-";
    }
  });

  const btn = document.getElementById("btn-mood-ladder-next");
  if (btn) {
    const count = activeMoodLadderOrder.length;
    btn.disabled = (count < 6);
    btn.textContent = count < 6
      ? "Välj ordning (" + count + "/6 valda)"
      : (activeMoodLadderStepIdx < 3 ? "Nästa steg ➔" : "✅ Slutför & Spara till Supabase");
  }
}

function resetCurrentMoodLadderStep() {
  activeMoodLadderOrder = [];
  refreshMoodLadderGridUI();
}
window.resetCurrentMoodLadderStep = resetCurrentMoodLadderStep;

async function commitCurrentMoodLadderStep() {
  if (activeMoodLadderOrder.length < 6) return;
  const stepSpec = MOOD_LADDER_STEPS[activeMoodLadderStepIdx];
  const elapsedMs = Math.round(performance.now() - activeMoodLadderStepStartTime);

  activeMoodLadderSessionData[stepSpec.key] = [...activeMoodLadderOrder];
  activeMoodLadderSessionData.step_latencies_ms[stepSpec.key] = elapsedMs;

  if (activeMoodLadderStepIdx < MOOD_LADDER_STEPS.length - 1) {
    activeMoodLadderStepIdx++;
    renderMoodLadderCurrentStep();
    return;
  }

  // Alla 4 steg klara! Spara och synka direkt med Supabase
  const btn = document.getElementById("btn-mood-ladder-next");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sparar i Supabase...";
  }

  const localObj = getLocalMoodLadderData();
  if (!Array.isArray(localObj.runs)) localObj.runs = [];
  localObj.runs.push(activeMoodLadderSessionData);
  localObj.count = localObj.runs.length;
  localObj.synthesis = buildMoodLadderSynthesis(localObj.runs);
  saveLocalMoodLadderData(localObj);

  // Synka med attemptsMap & Supabase forsok_data så att alla enheter och moduler ser det direkt
  const map = getAttemptsMap();
  map.color_form_mood_test = localObj.count;
  map.mood_ladder_runs = localObj.runs;
  map.mood_ladder_synthesis = localObj.synthesis;
  saveAttemptsMapLocal(map);
  await pushAttemptsToSupabase(map);
  if (typeof refreshAttemptsUI === "function") refreshAttemptsUI();

  document.getElementById("mood-ladder-modal").classList.remove("active");
  const cb = activeMoodLadderCallback;
  activeMoodLadderCallback = null;
  if (typeof cb === "function") cb(localObj.synthesis);
}
window.commitCurrentMoodLadderStep = commitCurrentMoodLadderStep;

function getMoodLadderSynthesisForArgon() {
  const localObj = getLocalMoodLadderData();
  if (localObj && localObj.synthesis) return localObj.synthesis;
  const map = getAttemptsMap();
  if (map && map.mood_ladder_synthesis) return map.mood_ladder_synthesis;
  return null;
}
window.getMoodLadderSynthesisForArgon = getMoodLadderSynthesisForArgon;



// =========================================================================
// CONTINUOUS AFFECT TRACKING (CRM) — FULLSTÄNDIGT PSYKOAKUSTISKT CUE-SHEET
// Korrelerar användarens kontinuerliga rörelsekurva (4 Hz) med samtliga 8
// ljudspår (bed1–bed4 & v1–v4) från 0:00 till respektive spårs slutsekund.
// =========================================================================

const PSYCHOACOUSTIC_CUE_SHEET = {
  beds: {
    bed1: {
      id: "bed1",
      file: "bed1.mp3",
      category: "BED",
      title: "bed1.mp3 — Akustisk & Organisk (Nylongitarr, Cello & Stråkar)",
      duration_sec: 122,
      character: "Intim kammarmusik i A-moll som växer från ensam nylongitarr till en djupt emotionell dialog mellan cello och violin, med en dramatisk andningspaus före avslutningen.",
      cues: [
        { start: 0, end: 15, phase: "INTRO_GUITAR", valence: "SAFE", color: "#22c55e", event: "Fridfullt gitarrintro: Långsamma, brutna ackord på ensam nylonsträngad gitarr med tydliga, organiska greppbrädesljud och mjuk rumsklang.", trigger: "Jordad trygghet & sänkt puls (Grön): Nervsystemet kalibreras i en varm, kravlös och intim akustisk miljö." },
        { start: 15, end: 36, phase: "ARPEGGIO_FLOW", valence: "SAFE", color: "#4ade80", event: "Rytmiskt fingerspel: Gitarren övergår i ett mer sammanhängande, rullande arpeggio-mönster med melankolisk men vilsam harmonik.", trigger: "Kontemplativt flöde: Skapar förutsägbarhet och rytmisk ro." },
        { start: 36, end: 54, phase: "STRINGS_ENTRY_EMOTIONAL", valence: "WARM_SPARK", color: "#f59e0b", event: "BRYTPUNKT 1 (Stråkentré): En soloviolin och cello kliver in med en lång, klagande och djupt uttrycksfull legato-melodi med rikt vibrato ovanpå gitarren.", trigger: "Emotionell öppning & sårbarhet (Grön/Röd): Övergång från neutral vila till stark hjärtresonans, längtan och empati." },
        { start: 54, end: 69, phase: "INTERLUDE_BORDUN", valence: "GROUNDED", color: "#10b981", event: "Nedtonat mellanspel: Stråkarna drar sig tillbaka till lågmälda, varma borduntoner i botten medan gitarrens plockande åter hamnar i fokus.", trigger: "Återhämtning & eftertanke: Rum för lyssnaren att bearbeta stråkarnas första känslovåg." },
        { start: 69, end: 79, phase: "INTERLUDE_CELLO_BUILD", valence: "GROUNDED", color: "#059669", event: "Mörk celloresonans: Cellon tar över melodin i sitt lägre register med tät bröstklang, innan den klättrar uppåt i registret.", trigger: "Tyngd & allvar: Väckande av djupare somatisk förankring." },
        { start: 79, end: 99, phase: "CLIMAX_STRING_DIALOGUE", valence: "HIGH_PASSION", color: "#ef4444", event: "DRAMATOPP (Full stråkdialog): Kraftfullt crescendo där violin och cello flätas samman i sitt högsta och mest intensiva register med maximal dynamik och passionerat vibrato.", trigger: "Hög affektiv laddning / Kemi & Puls (Röd): Starkaste emotionella trycket i spåret; testar om lyssnaren dras in i dramat eller ryggar undan." },
        { start: 99, end: 107, phase: "SPARSE_GUITAR_DROP", valence: "VULNERABLE_PAUSE", color: "#a855f7", event: "BRYTPUNKT 2 (Akustiskt vakuum): Stråkarna tystnar tvärt. Endast fyra helt nakna, långsamma och dröjande gitarrackord hörs i tystnaden.", trigger: "Plötslig nakenhet & vaksamhet: Kontrasten efter crescendot skapar en intim, nästan skör stillhet." },
        { start: 107, end: 122, phase: "CELLO_CODA_RESOLUTION", valence: "SAFE", color: "#22c55e", event: "Coda & Upplösning: En ensam, djup celloton smyger in på lägsta strängen, stiger långsamt upp i en sista försonande fras med stråkarna och klingar ut i tystnad.", trigger: "Djup försoning & avspänning (Grön): Fullständig parasympatisk landning." }
      ]
    },
    bed2: {
      id: "bed2",
      file: "bed2.mp3",
      category: "BED",
      title: "bed2.mp3 — Atmosfärisk, Lo-Fi & Kinematisk (Synthpads, Beat & Stråklyft)",
      duration_sec: 144,
      character: "En resa i tre tydliga akter – från tyngdlös ambient och mjukt piano, via en rytmisk downtempo-puls, till en storslagen kinematisk orkesterkulmination.",
      cues: [
        { start: 0, end: 23, phase: "AMBIENT_PADS_INTRO", valence: "FLOATING_CALM", color: "#38bdf8", event: "Ambient gryning: Ett mjukt sus följt av svävande, varma synthpads och enstaka, glest placerade pianotoner med långt reverb. Ingen puls eller rytm.", trigger: "Drömsk trygghet & mental rymd (Grön/Blå): Total kravlöshet, svävande lugn." },
        { start: 23, end: 54, phase: "LOFI_BEAT_ENTRY", valence: "GROUNDED_RHYTHM", color: "#22c55e", event: "BRYTPUNKT 1 (Beatet kliver in): Ett mjukt, dämpat lo-fi/downtempo-trumbeat och en varm sub-bas etablerar en trygg puls medan pianot spelar en sammanhängande melodi.", trigger: "Rytmisk förankring & fokus: Nervsystemet får en stadig, gungande struktur att luta sig mot." },
        { start: 54, end: 71, phase: "HARMONIC_BUILD", valence: "ANTICIPATION", color: "#f59e0b", event: "Harmonisk fördjupning: En mjuk motmelodi och tätare ackordmattor lägger sig över beatet; en diskret uppbyggnad (riser) hörs mot slutet av frasen.", trigger: "Växande förväntan: Ökad vakenhet och nyfikenhet inför skiftet." },
        { start: 71, end: 102, phase: "CINEMATIC_STRINGS_CLIMAX_1", valence: "EUPHORIC_EXPANSION", color: "#ef4444", event: "DRAMATOPP 1 (Kinematiskt stråklyft): Stora, svepande stråkar kliver in med full bredd ovanpå trumpulsen och lyfter melodin till en hoppfull, filmisk höjdpunkt.", trigger: "Eufori, värme & expansion (Röd/Grön): Stark känsla av lyft, framåtrörelse och emotionell vidd." },
        { start: 102, end: 131, phase: "HIGH_REGISTER_CLIMAX_2", valence: "HIGH_VITALITY", color: "#f97316", event: "DRAMATOPP 2 (Högsta övertonsregistret): Stråkarna klättrar ytterligare en oktav med glittrande pianofigurer innan arrangemanget stegvis börjar glesas ut.", trigger: "Kvarhållen hög vitalitet: Mäter uthållighet i positiv affekt." },
        { start: 131, end: 144, phase: "AMBIENT_FADEOUT", valence: "SAFE", color: "#22c55e", event: "Outro & Uttoning: Trummor och bas försvinner helt efter en mjuk cymbal-swell. Endast den varma synthmattan svävar kvar och tonar ut.", trigger: "Mjuk utandning & ro: Återgång till det tidlösa lugnet från introt." }
      ]
    },
    bed3: {
      id: "bed3",
      file: "bed3.mp3",
      category: "BED",
      title: "bed3.mp3 — Rytmisk Lo-Fi & Neosoul (Rhodes, Elgitarr & Vinyl-groove)",
      duration_sec: 122,
      character: "Varmt, gungande neosoul/lo-fi-spår med jazziga septimaackord, följsam elgitarr, ett oväntat tvärstopp i mitten och ett helt fristående, drömskt solo-outro.",
      cues: [
        { start: 0, end: 14, phase: "RHODES_VINYL_INTRO", valence: "COZY_SAFE", color: "#22c55e", event: "Lo-Fi Groove Intro: Varma Fender Rhodes-ackord, mjukt vinylknaster och ett avslappnat trumbeat med tydlig kantslagspuls (rimshot).", trigger: "Omedelbar mysfaktor & avslappnad tillit (Grön): Kravlös, varm vardagskemi." },
        { start: 14, end: 28, phase: "RHODES_VINYL_GROOVE", valence: "COZY_SAFE", color: "#4ade80", event: "Bas & Melodiska inspel: En rund, melodisk elbas lägger sig i fickan av beatet tillsammans med ljusa, lekfulla elpianotoner.", trigger: "Fysiskt gung & välbehag: Stimulerar subtil rörelse och social värme." },
        { start: 28, end: 54, phase: "SOUL_GUITAR_AND_PADS", valence: "WARM_CHEMISTRY", color: "#f59e0b", event: "BRYTPUNKT 1 (Soul-gitarr & Vokal-pads): En ren, varm elgitarr spelar intima jazz/soul-licks, uppbackad av mjuka, ordlösa vokal-liknande ackordmattor i bakgrunden.", trigger: "Sensuell värme & flörtig kemi (Röd/Grön): Ökad intimitet och lekfull dragningskraft." },
        { start: 54, end: 56, phase: "SUDDEN_SILENCE_STOP", valence: "ALERT_SURPRISE", color: "#a855f7", event: "BRYTPUNKT 2 (Total tystnad / Drop-stop): Musiken stannar tvärt i nästan två sekunder innan en ensam pianoupptakt hörs.", trigger: "Mikro-chock / Vaksamhet: Testar hur snabbt användarens finger reagerar på ett oväntat avbrott i tryggheten." },
        { start: 56, end: 85, phase: "FULL_GROOVE_RETURN", valence: "RHYTHMIC_PULSE", color: "#ef4444", event: "Återkomst med fullare arrangemang: Beatet slår till igen, nu med ett mer framträdande akustiskt/elektriskt piano i tät växelverkan med elgitarren.", trigger: "Återvunnen trygghet & förhöjd puls (Röd): Energin och drivet är snäppet starkare än före pausen." },
        { start: 85, end: 97, phase: "CHIME_TRANSITION", valence: "COOLING", color: "#60a5fa", event: "Nedtrappning av beatet: Trummorna rullar av med en glittrande klockspel/chime-effekt och lämnar scenen.", trigger: "Övergång till stillhet: Puls och tempo släpper taget." },
        { start: 97, end: 122, phase: "RUBATO_SOLO_EPILOGUE", valence: "INTROSPECTIVE_CALM", color: "#38bdf8", event: "BRYTPUNKT 3 (Rubato Solo-Epilog): Beatet är helt borta. Kvar finns bara ett fritt, drömskt och naket Rhodes/harpa-liknande solo som långsamt klingar ut i stora ackord.", trigger: "Introspektion & djup kvällsro (Grön/Blå): Från rytmiskt umgänge till stillsam närhet." }
      ]
    },
    bed4: {
      id: "bed4",
      file: "bed4.mp3",
      category: "BED",
      title: "bed4.mp3 — Minimalistiskt Felt Piano & Subtil Puls",
      duration_sec: 122,
      character: "Avskalat, nära inspelat filtat piano (felt piano) med hörbar mekanik, som växlar mellan stillsam ensamhet, varsam hjärtslagspuls och lyriska toppar.",
      cues: [
        { start: 0, end: 21, phase: "SPARSE_FELT_PIANO", valence: "INTIMATE_VULNERABLE", color: "#38bdf8", event: "Naket intro: Långsamma, dämpade ackord på ett filtat piano. Man hör tydligt träet, pedalen och hammarnas mjuka anslag mot strängarna.", trigger: "Total uppriktighet & skör närhet (Grön/Blå): Inget filter; väcker ömhet och eftertänksamhet." },
        { start: 21, end: 46, phase: "HEARTBEAT_PULSE_ARPEGGIO", valence: "SAFE_MOTION", color: "#22c55e", event: "BRYTPUNKT 1 (Hjärtslagspuls & Arpeggio): Ett rullande vänsterhandsarpeggio startar, ackompanjerat av en mycket mjuk, dämpad bastrumma/puls och en varm stråkbotten.", trigger: "Trygg framåtrörelse: Som en lugn vandring eller ett stabilt hjärtslag under huden." },
        { start: 46, end: 65, phase: "LYRICAL_MIDDLE_SECTION", valence: "CONTEMPLATIVE", color: "#60a5fa", event: "Melodisk öppning (Mellanakt): Slagverket tystnar. Pianot spelar mer öppna, lyriska och sökande ackord med varm klangbotten.", trigger: "Vemod & emotionell öppenhet: Känsla av ett förtroligt samtal i förtroende." },
        { start: 65, end: 84, phase: "UPPER_REGISTER_CASCADES", valence: "WARM_SPARK", color: "#ef4444", event: "DRAMATOPP (Kaskader i diskanten): Pianot blommar ut i snabba, rinnande sextondelsfigurer i det ljusa registret med rikare dynamik och varm stråksupport.", trigger: "Emotionell värme & hoppfull gnista (Röd/Grön): Högsta intensiteten i stycket; ljust och levande." },
        { start: 84, end: 102, phase: "GENTLE_RETURN", valence: "SAFE", color: "#4ade80", event: "Återhållen reflektion: Intensiteten lägger sig tillbaka i lugnare ackordföljder i mellanregistret.", trigger: "Stabilisering & lugn: Känslan landar mjukt." },
        { start: 102, end: 122, phase: "HIGH_MUSICBOX_OUTRO", valence: "PURE_CALM", color: "#22c55e", event: "Kristallklart avslut: Melodin flyttar upp i pianots allra högsta, speldose-liknande diskantregister innan ett sista utsträckt arpeggio tonar ut i tystnad.", trigger: "Renhet, oskuld & stilla frid (Grön): Lätt, svävande avslutning." }
      ]
    }
  },
  voices: {
    v1: {
      id: "v1",
      file: "v1.mp3",
      category: "VOICE",
      archetypeCode: "VOICE_DEEP_CHEST",
      title: "v1.mp3 — Djup, Resonant Bröstklang (VOICE_DEEP_CHEST)",
      duration_sec: 102,
      character: "Helt a cappella. Djup manlig bas/baryton-ensemble som bygger på en rytmisk vokal basgång (”dum-dum”) och växlar mellan intim solosång och mäktig koralharmoni.",
      cues: [
        { start: 0, end: 11, phase: "BASS_PULSE_HUMMING", valence: "SOMATIC_GROUNDING", color: "#22c55e", event: "Sub-vokal baspuls: Djup basstämma sätter en stadig rytmisk grund (”bum-bum”) i lägsta registret tillsammans med mjukt brummande på ”mm”.", trigger: "Fysisk basresonans & förankring (Grön): De låga frekvenserna känns fysiskt i bröstkorgen; stabilt och tryggt." },
        { start: 11, end: 21, phase: "BARITONE_MELODY", valence: "WARM_AUTHORITY", color: "#10b981", event: "Baryton-melodi: En varm solobaryton kliver in med en glidande, mjuk melodilinje på ”mm/ooh” över baspulsen.", trigger: "Varm auktoritet & närvaro: Lugnande, faderlig/beskyddande energi." },
        { start: 21, end: 31, phase: "OPEN_AAH_AND_BREATH_STOP", valence: "INTIMATE_PROXIMITY", color: "#f59e0b", event: "BRYTPUNKT 1 (Öppning på ”Aah” + Andningspaus): Rösten öppnar upp vokalen till ett fylligt, varmt ”Aah”. Vid 0:29–0:31 inträffar ett helt tyst andningsstopp.", trigger: "Ökad intimitet & uppmärksamhet: Övergången från sluten mun (”mm”) till öppen vokal (”aah”) upplevs som att personen vänder sig rakt mot lyssnaren." },
        { start: 31, end: 46, phase: "CHOIR_HARMONY_SWELL", valence: "ENVELOPING_SAFETY", color: "#22c55e", event: "Flerspårig manskör (”Ooh/Aah”): Flera djupa stämmor sluter upp i rika, sakrala dur/moll-klanger med varm rumsklang.", trigger: "Omslutande trygghet & rymd (Grön): Känsla av att bli buren av en varm klangvägg." },
        { start: 46, end: 61, phase: "SOLO_TENOR_INFLECTION", valence: "TENDER_VULNERABILITY", color: "#38bdf8", event: "Intim solovändning: Kören backar och solorösten sjunger en mer sökande, lätt vemodig slinga som klättrar upp i en ljusare överton vid 0:54.", trigger: "Emotionell nyans & sårbarhet i styrkan: Visar mjukhet bakom den djupa rösten." },
        { start: 61, end: 85, phase: "CHORAL_CATHEDRAL_CLIMAX", valence: "POWER_RESONANCE", color: "#ef4444", event: "DRAMATOPP (Mäktig Koral-kulmination): Rytmpulsen upphör och hela ensemblen brister ut i långa, kraftfulla och vibrerande koralackord på ”Ooh” och ”Aah” (starkast vid 1:12–1:24).", trigger: "Hög vördnad, kraft & intensitet (Röd/Grön): Mäter om lyssnaren dras till kraftfull, resonant pondus eller upplever det som överväldigande." },
        { start: 85, end: 102, phase: "BASS_PULSE_FADE_HUM", valence: "DEEP_REST", color: "#22c55e", event: "Nedtoning till viskande brumning: Baspulsen återvänder kort i lägre tempo, varpå en ensam stämma sjunker ner i ett allt tystare, utdraget ”mmm” som dör ut.", trigger: "Total avspänning & vila: Nervsystemet vaggas ner till vilopuls." }
      ]
    },
    v2: {
      id: "v2",
      file: "v2.mp3",
      category: "VOICE",
      archetypeCode: "VOICE_AIRY_WHISPER",
      title: "v2.mp3 — Luftig, Intim Viskning & Kinematisk Sårbarhet (VOICE_AIRY_WHISPER)",
      duration_sec: 107,
      character: "Extremt nära kvinnlig röst med hög luftkvot och tydliga andetag, som pendlar mellan sköraste intimitet och två enorma, eteriska känslostormar.",
      cues: [
        { start: 0, end: 28, phase: "CLOSE_MIC_BREATHY_WHISPER", valence: "SKIN_CLOSE_INTIMACY", color: "#22c55e", event: "Hudnära andning & ”Ooh”: Kvinnlig röst extremt nära mikrofonen (proximity-effekt). Tydliga, sårbara inandningar inför varje mjuk ”ooh”-fras över glesa pianotoner.", trigger: "Intim sårbarhet & ömhet (Grön/Röd): Låter som någon som viskar direkt vid örat; sänker alla sociala sköldar direkt." },
        { start: 28, end: 46, phase: "ETHEREAL_SWELL_CLIMAX_1", valence: "EMOTIONAL_SURGE", color: "#ef4444", event: "DRAMATOPP 1 (Eterisk eruption): Efter ett djupt andetag (0:27) sväller stråkar och vokalharmonier plötsligt ut i ett mäktigt, högt och svävande crescendo på öppet ”Aah”.", trigger: "Stark emotionell våg / Gåshud (Röd): Kontrasten från viskning till full klang ger ett omedelbart sympatiskt påslag i nervsystemet." },
        { start: 46, end: 64, phase: "FLOATING_OOH_INTERLUDE", valence: "DREAMY_SAFE", color: "#38bdf8", event: "Svävande intermezzo: Dynamiken sjunker tillbaka till mjuka, drömska ”ooh”-slingor med stråkmattor som böljar lugnt i bakgrunden.", trigger: "Mjuk återhämtning & drömsk närvaro: Behaglig svävande vila efter första toppen." },
        { start: 64, end: 83, phase: "HIGH_SOPRANO_CLIMAX_2", valence: "PEAK_INTENSITY", color: "#dc2626", event: "DRAMATOPP 2 (Högsta emotionella klimax): Ännu starkare och högre vokal kulmination där sopranstämman når sitt absoluta toppregister med intensivt vibrato och full orkesterklangbotten.", trigger: "Maximal affektiv laddning & längtan (Röd): Testar gränsen mellan hänförelse/passion och emotionell övermättnad." },
        { start: 83, end: 107, phase: "NAKED_WHISPER_EPILOGUE", valence: "RAW_VULNERABILITY", color: "#22c55e", event: "BRYTPUNKT (Total avklädning & Viskande avslut): Alla stråkar försvinner vid 1:23. Kvar är bara rösten, helt naken och nästan bristande av luft och närhet, som viskar-sjunger de sista sköra fraserna in i tystnaden.", trigger: "Total nakenhet & hudnära tillit (Grön): Ett av hela testsvitens mest intima ögonblick; avslöjar om användaren stannar kvar i sårbarheten." }
      ]
    },
    v3: {
      id: "v3",
      file: "v3.mp3",
      category: "VOICE",
      archetypeCode: "VOICE_CLEAR_LUMINOUS",
      title: "v3.mp3 — Ljus, Klar Sopran & Lyrisk Flöjtdialog (VOICE_CLEAR_LUMINOUS)",
      duration_sec: 118,
      character: "Kristallklar, klassiskt skolad sopran (utan minsta heshet eller skrap) i en virtuos och luftig kammardialog med tvärflöjt och rullande flygel.",
      cues: [
        { start: 0, end: 18, phase: "CRYSTAL_SOPRANO_ENTRY", valence: "LUMINOUS_CLARITY", color: "#38bdf8", event: "Glasklar sopranentré: Sopranen inleder direkt med en ren, hög och svävande vokalis på ”Aah” över mjuka pianoarpeggion.", trigger: "Klarhet, lyft & intellektuell skärpa (Grön/Blå): Ren övertonsrik klang som väcker vakenhet och estetik." },
        { start: 18, end: 36, phase: "FLUTE_VOICE_DUET", valence: "PLAYFUL_HARMONY", color: "#22c55e", event: "Duett med tvärflöjt: En träflöjt kliver in och härmar/samspelar med sångerskans melodiska språng i en ljus, lekfull dialog.", trigger: "Lekfullhet & harmonisk balans: Lättsam, luftig och graciös energi." },
        { start: 36, end: 59, phase: "OPERATIC_ASCENT_CLIMAX_1", valence: "HIGH_VITALITY", color: "#ef4444", event: "DRAMATOPP 1 (Operatisk stigning): Rösten och stråkarna bygger upp en lång, dramatisk stigning där sopranen håller ut höga, lysande bröst- och huvudtoner med rik volym.", trigger: "Hög intensitet & kristallin kraft (Röd): Mäter hur nervsystemet reagerar på starka, höga frekvenser (hänförelse kontra skärpa/distans)." },
        { start: 59, end: 79, phase: "PEAK_COLORATURA_CLIMAX_2", valence: "PIERCING_BRILLIANCE", color: "#a855f7", event: "DRAMATOPP 2 (Virtuos koloratur & högsta tonläge): Sångerskan och flöjten möts i sitt allra högsta register (1:05–1:14) med snabba, glittrande ornament innan frasen landar.", trigger: "Kulminerande briljans & spänning (Röd/Lila): De högsta tonerna sätter lyssnarens tolerans för vokalt tryck på prov." },
        { start: 79, end: 97, phase: "LYRICAL_THEME_RETURN", valence: "BALANCED_CALM", color: "#4ade80", event: "Lyrisk återkomst: Efter en kort andningspaus återvänder det mjukare huvudtemat i ett mer dämpat, varmt mellanregister.", trigger: "Avspänning & harmonisk ordning (Grön): Pulsen sjunker tillbaka till behaglig jämvikt." },
        { start: 97, end: 118, phase: "PIANISSIMO_CODA", valence: "SERENE_CLOSURE", color: "#22c55e", event: "Svävande Coda: Tempoväxling nedåt (ritardando). Sångerskan sjunger långa, fjäderlätta toner i pianissimo som smälter samman med ett sista ljust pianoackord.", trigger: "Eterisk ro & klarhet: Ren, viktlös uttoning." }
      ]
    },
    v4: {
      id: "v4",
      file: "v4.mp3",
      category: "VOICE",
      archetypeCode: "VOICE_RASPY_INTENSE",
      title: "v4.mp3 — Hes, Rökig Soul/Jazz-röst med Kontrabas & Stråkstorm (VOICE_RASPY_INTENSE)",
      duration_sec: 118,
      character: "Det mest dynamiskt kontrastrika spåret. Börjar som en rökig, hudnära jazz/blues-improvisation med ensam kontrabas, exploderar i två råa symfoniska känslostormar och har ett helt instrumentalt mellanspel i mitten.",
      cues: [
        { start: 0, end: 25, phase: "SMOKY_FRY_AND_UPRIGHT_BASS", valence: "SENSUAL_GRIT", color: "#f59e0b", event: "Rå, hudnära vokalis & kontrabas: Hörbar inandning följt av en djup, hes och varmt sträv kvinnoröst (”mm-ooh-aah”) med tydlig vocal fry och bluesig glidning, endast ackompanjerad av en plockad kontrabas.", trigger: "Magnetisk, jordad sensualitet (Röd/Grön): Rå, ofiltrerad och organisk närvaro; väcker stark biologisk nyfikenhet." },
        { start: 25, end: 34, phase: "RISING_VOCAL_TENSION", valence: "RISING_PULSE", color: "#f97316", event: "Stigande vokal friktion: Akustisk gitarr smyger in medan rösten klättrar i tonhöjd med mer pressad, hes nerv och växande oro/laddning.", trigger: "Stigande puls & förväntan (Röd): Man känner i kroppen att ett utbrott närmar sig." },
        { start: 34, end: 54, phase: "RAW_BELT_EXPLOSION_1", valence: "RAW_PASSION_FRICTION", color: "#ef4444", event: "DRAMATOPP 1 (Rå vokal explosion): Sångerskan kastar sig upp i ett förtvivlat, passionerat och fullt utsjungande högt register med rå strupfriktion och tungt orkesterstöd.", trigger: "Akut passion / Katarsis / Friktion (Röd/Lila): Enorm emotionell urladdning. Skiljer tydligt mellan dem som dras till rå intensitet och dem som söker skydd." },
        { start: 54, end: 78, phase: "INSTRUMENTAL_JAZZ_TRIO_VOID", valence: "REFLECTIVE_SPACE", color: "#38bdf8", event: "BRYTPUNKT (Instrumentalt mellanspel utan sång): Rösten försvinner helt! Under 24 sekunder hörs endast ett lågmält, melankoliskt samspel mellan piano, akustisk gitarr och vandrande kontrabas.", trigger: "Efterskalv & tomrum (Blå/Grön): Lyssnarens finger avslöjar hur hen hanterar tystnaden efter en urladdning – dröjer sig pulsen kvar eller faller man direkt till ro?" },
        { start: 78, end: 101, phase: "SYMPHONIC_VOCAL_STORM_2", valence: "MAX_DRAMA_INTENSITY", color: "#a855f7", event: "DRAMATOPP 2 (Symfonisk storm & Sopran-rop): Stråkarna sveper in på nytt och rösten återvänder med full kraft i sitt allra högsta, nästan smärtsamt intensiva register med snabba pianoarpeggion.", trigger: "Maximal dramatisk spänning (Röd/Lila): Spårets andra stora emotionella kraftprov." },
        { start: 101, end: 118, phase: "EXHAUSTED_BREATH_WHISPER_END", valence: "POST_STORM_INTIMACY", color: "#22c55e", event: "BRYTPUNKT 2 (Utmattad, viskande försoning): Orkestern klipps bort tvärt vid 1:41. Sångerskan hörs ta ett skälvande, utmattat andetag nära mikrofonen och avslutar med en bräcklig, hes suck (”ooh… aah”) över en sista gitarrklang.", trigger: "Avväpnande sårbarhet efter stormen (Grön): Från rå kraft tillbaka till hudnära, utlämnad mänsklighet." }
      ]
    }
  }
};
window.PSYCHOACOUSTIC_CUE_SHEET = PSYCHOACOUSTIC_CUE_SHEET;

const CRM_TRACK_SEQUENCE = [
  PSYCHOACOUSTIC_CUE_SHEET.beds.bed1,
  PSYCHOACOUSTIC_CUE_SHEET.beds.bed2,
  PSYCHOACOUSTIC_CUE_SHEET.beds.bed3,
  PSYCHOACOUSTIC_CUE_SHEET.beds.bed4,
  PSYCHOACOUSTIC_CUE_SHEET.voices.v1,
  PSYCHOACOUSTIC_CUE_SHEET.voices.v2,
  PSYCHOACOUSTIC_CUE_SHEET.voices.v3,
  PSYCHOACOUSTIC_CUE_SHEET.voices.v4
];

let crmCurrentTrackIdx = 0;
let crmTrackLogs = {};
let crmLiveX = 0;
let crmLiveY = 0;
let crmPointerActive = false;
let crmSampleTimer = null;
let crmSimClockSec = 0;
let crmUsingSimClock = false;
let crmTrailPoints = [];
let crmListenersInitialized = false;

function formatSecToMmSs(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
}

function getCueForTrackTime(trackObj, sec) {
  if (!trackObj || !Array.isArray(trackObj.cues)) return null;
  const t = Math.max(0, Number(sec) || 0);
  for (let i = 0; i < trackObj.cues.length; i++) {
    const c = trackObj.cues[i];
    if (t >= c.start && t <= c.end) return c;
  }
  return trackObj.cues[trackObj.cues.length - 1] || null;
}

function stopCrmTrackingTimers() {
  if (crmSampleTimer) {
    clearInterval(crmSampleTimer);
    crmSampleTimer = null;
  }
  const audioEl = document.getElementById("crm-audio-player");
  if (audioEl) {
    try { audioEl.pause(); } catch (e) {}
  }
  const pad = document.getElementById("crm-pad-wrap");
  if (pad) pad.classList.remove("recording");
  const playBtn = document.getElementById("btn-crm-play-toggle");
  if (playBtn) playBtn.innerHTML = "▶️ Spela &amp; Spåra i realtid";
}

function openCrmIntroStep() {
  closeSomaticWheel();
  document.getElementById("somatic-step-intro").style.display = "none";
  document.getElementById("somatic-step-arena").style.display = "none";
  const trEl = document.getElementById("somatic-step-transition");
  if (trEl) trEl.style.display = "none";
  document.getElementById("somatic-step-report").style.display = "none";
  const crmArena = document.getElementById("somatic-step-crm-arena");
  if (crmArena) crmArena.style.display = "none";
  const crmIntro = document.getElementById("somatic-step-crm-intro");
  if (crmIntro) crmIntro.style.display = "block";
}
window.openCrmIntroStep = openCrmIntroStep;

function startPsychoacousticCrmDirect() {
  if (sessionData && getModuleAttempts("somatic_test") >= 1) {
    alert("Du har redan genomfört Somatisk, Taktil & Psykoakustisk Projektion i din profil (1 försök gäller). Be Admin nollställa räknaren om du blev avbruten.");
    return;
  }
  crmTrackLogs = {};
  crmCurrentTrackIdx = 0;
  openCrmIntroStep();
}
window.startPsychoacousticCrmDirect = startPsychoacousticCrmDirect;

function beginCrmArenaSequence() {
  initCrmPadListeners();
  const crmIntro = document.getElementById("somatic-step-crm-intro");
  if (crmIntro) crmIntro.style.display = "none";
  const crmArena = document.getElementById("somatic-step-crm-arena");
  if (crmArena) crmArena.style.display = "block";
  crmCurrentTrackIdx = 0;
  loadCrmTrack(0);
}
window.beginCrmArenaSequence = beginCrmArenaSequence;

function resolveCrmAudioUrl(trackObj) {
  const baseKey = trackObj.id.toLowerCase();
  if (somaticBucketMap[baseKey]) return somaticBucketMap[baseKey];
  return SUPABASE_URL + "/storage/v1/object/public/" + SOMATIC_BUCKET + "/" + baseKey + ".mp3";
}

function renderCrmTimelineSegments(trackObj) {
  const bar = document.getElementById("crm-timeline-bar");
  if (!bar) return;
  bar.innerHTML = '<div class="crm-playhead" id="crm-playhead" style="left:0%;"></div>';
  const total = trackObj.duration_sec || 120;

  trackObj.cues.forEach((cue, idx) => {
    const seg = document.createElement("div");
    seg.className = "crm-cue-segment";
    seg.id = "crm-cue-seg-" + idx;
    const widthPct = Math.max(1, ((cue.end - cue.start) / total) * 100);
    seg.style.width = widthPct + "%";
    seg.style.background = cue.color || "#38bdf8";
    seg.title = formatSecToMmSs(cue.start) + "–" + formatSecToMmSs(cue.end) + ": " + cue.phase + " (" + cue.valence + ")";
    bar.appendChild(seg);
  });
}

function loadCrmTrack(idx) {
  stopCrmTrackingTimers();
  if (idx >= CRM_TRACK_SEQUENCE.length) {
    finishCrmAndShowReport();
    return;
  }

  crmCurrentTrackIdx = idx;
  const trackObj = CRM_TRACK_SEQUENCE[idx];
  crmSimClockSec = 0;
  crmUsingSimClock = false;
  crmLiveX = 0;
  crmLiveY = 0;
  crmTrailPoints = [];

  if (!crmTrackLogs[trackObj.id]) {
    crmTrackLogs[trackObj.id] = {
      trackId: trackObj.id,
      file: trackObj.file,
      category: trackObj.category,
      archetypeCode: trackObj.archetypeCode || null,
      duration_sec: trackObj.duration_sec,
      samples: []
    };
  }

  const counterEl = document.getElementById("crm-track-counter");
  if (counterEl) counterEl.textContent = "Spår " + (idx + 1) + " / " + CRM_TRACK_SEQUENCE.length;

  const catBadge = document.getElementById("crm-track-category-badge");
  if (catBadge) {
    catBadge.textContent = trackObj.category === "BED"
      ? "🎵 Del 1: Ljudvärld / Bakgrundskomp"
      : ("🎙️ Del 2: Vokalarketyp (" + (trackObj.archetypeCode || trackObj.id) + ")");
  }

  const titleEl = document.getElementById("crm-track-title");
  if (titleEl) titleEl.textContent = trackObj.title;

  const charEl = document.getElementById("crm-track-character");
  if (charEl) charEl.textContent = trackObj.character;

  const timeEl = document.getElementById("crm-time-display");
  if (timeEl) timeEl.textContent = "00:00 / " + formatSecToMmSs(trackObj.duration_sec);

  const phaseEl = document.getElementById("crm-active-phase-pill");
  if (phaseEl) phaseEl.textContent = "Redo: " + trackObj.cues[0].phase;

  const descEl = document.getElementById("crm-active-cue-desc");
  if (descEl) descEl.innerHTML = "<strong>0:00:</strong> " + trackObj.cues[0].event;

  renderCrmTimelineSegments(trackObj);
  updateCrmCursorVisual(0, 0);
  clearCrmTrailCanvas();

  const sampleCountEl = document.getElementById("crm-sample-counter");
  if (sampleCountEl) sampleCountEl.textContent = "0 mätpunkter (4 Hz)";

  const nextBtn = document.getElementById("btn-crm-next-track");
  if (nextBtn) {
    nextBtn.textContent = (idx < CRM_TRACK_SEQUENCE.length - 1)
      ? "Nästa spår (" + CRM_TRACK_SEQUENCE[idx + 1].id + ") ➔"
      : "✅ Slutför CRM & Visa 4-Lagers Syntes ➔";
  }

  const audioEl = document.getElementById("crm-audio-player");
  if (audioEl) {
    audioEl.src = resolveCrmAudioUrl(trackObj);
    audioEl.currentTime = 0;
  }
}

function clearCrmTrailCanvas() {
  const canvas = document.getElementById("crm-trail-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCrmTrailCanvas() {
  const canvas = document.getElementById("crm-trail-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (crmTrailPoints.length < 2) return;

  for (let i = 1; i < crmTrailPoints.length; i++) {
    const p0 = crmTrailPoints[i - 1];
    const p1 = crmTrailPoints[i];
    const alpha = Math.max(0.12, i / crmTrailPoints.length);
    ctx.beginPath();
    ctx.moveTo(p0.px, p0.py);
    ctx.lineTo(p1.px, p1.py);
    ctx.strokeStyle = "rgba(56, 189, 248, " + (alpha * 0.85).toFixed(2) + ")";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

function updateCrmCursorVisual(normX, normY) {
  crmLiveX = Math.max(-1, Math.min(1, Number(normX.toFixed(3))));
  crmLiveY = Math.max(-1, Math.min(1, Number(normY.toFixed(3))));

  const puck = document.getElementById("crm-cursor-puck");
  if (puck) {
    const leftPct = ((crmLiveX + 1) / 2) * 100;
    const topPct = ((1 - crmLiveY) / 2) * 100;
    puck.style.left = leftPct + "%";
    puck.style.top = topPct + "%";
  }

  const coordsEl = document.getElementById("crm-live-coords");
  if (coordsEl) {
    coordsEl.textContent =
      "X (Kemi/Distans): " + (crmLiveX >= 0 ? "+" : "") + crmLiveX.toFixed(2) +
      " | Y (Trygg/Friktion): " + (crmLiveY >= 0 ? "+" : "") + crmLiveY.toFixed(2);
  }

  const canvas = document.getElementById("crm-trail-canvas");
  if (canvas) {
    const px = ((crmLiveX + 1) / 2) * canvas.width;
    const py = ((1 - crmLiveY) / 2) * canvas.height;
    crmTrailPoints.push({ px, py });
    if (crmTrailPoints.length > 75) crmTrailPoints.shift();
    drawCrmTrailCanvas();
  }
}

function sampleCurrentCrmState() {
  const trackObj = CRM_TRACK_SEQUENCE[crmCurrentTrackIdx];
  if (!trackObj) return;

  const audioEl = document.getElementById("crm-audio-player");
  let currSec = crmSimClockSec;
  if (audioEl && !crmUsingSimClock && !audioEl.paused && !isNaN(audioEl.currentTime)) {
    currSec = audioEl.currentTime;
    crmSimClockSec = currSec;
  } else {
    crmSimClockSec = Number((crmSimClockSec + 0.25).toFixed(2));
    currSec = crmSimClockSec;
  }

  if (currSec >= trackObj.duration_sec) {
    stopCrmTrackingTimers();
    const phaseEl = document.getElementById("crm-active-phase-pill");
    if (phaseEl) phaseEl.textContent = "✅ Spår klart (" + formatSecToMmSs(trackObj.duration_sec) + ")";
    return;
  }

  const activeCue = getCueForTrackTime(trackObj, currSec);
  const pct = Math.min(100, (currSec / trackObj.duration_sec) * 100);
  const playhead = document.getElementById("crm-playhead");
  if (playhead) playhead.style.left = pct.toFixed(1) + "%";

  const timeEl = document.getElementById("crm-time-display");
  if (timeEl) timeEl.textContent = formatSecToMmSs(currSec) + " / " + formatSecToMmSs(trackObj.duration_sec);

  if (activeCue) {
    const phaseEl = document.getElementById("crm-active-phase-pill");
    if (phaseEl) {
      phaseEl.textContent = activeCue.phase + " [" + activeCue.valence + "]";
      phaseEl.style.color = activeCue.color || "#fde68a";
    }
    const descEl = document.getElementById("crm-active-cue-desc");
    if (descEl) {
      descEl.innerHTML = "<strong>" + formatSecToMmSs(activeCue.start) + "–" + formatSecToMmSs(activeCue.end) + ":</strong> " +
        activeCue.event + " <span style='color:#fde68a;'>(" + activeCue.trigger + ")</span>";
    }

    trackObj.cues.forEach((c, idx) => {
      const seg = document.getElementById("crm-cue-seg-" + idx);
      if (seg) {
        if (c.phase === activeCue.phase) seg.classList.add("active-cue");
        else seg.classList.remove("active-cue");
      }
    });
  }

  const logEntry = crmTrackLogs[trackObj.id];
  if (logEntry) {
    logEntry.samples.push({
      t_sec: Number(currSec.toFixed(2)),
      x: crmLiveX,
      y: crmLiveY,
      phase: activeCue ? activeCue.phase : "UNKNOWN",
      valence: activeCue ? activeCue.valence : "UNKNOWN"
    });
    const sampleCountEl = document.getElementById("crm-sample-counter");
    if (sampleCountEl) sampleCountEl.textContent = logEntry.samples.length + " mätpunkter (4 Hz)";
  }
}

function startCrmSamplingLoop() {
  if (crmSampleTimer) return;
  const pad = document.getElementById("crm-pad-wrap");
  if (pad) pad.classList.add("recording");
  const playBtn = document.getElementById("btn-crm-play-toggle");
  if (playBtn) playBtn.innerHTML = "⏸️ Pausa spårning";

  const audioEl = document.getElementById("crm-audio-player");
  if (audioEl) {
    audioEl.play().then(() => {
      crmUsingSimClock = false;
    }).catch(() => {
      crmUsingSimClock = true;
    });
  } else {
    crmUsingSimClock = true;
  }

  crmSampleTimer = setInterval(sampleCurrentCrmState, 250);
}

function toggleCrmAudioPlayback() {
  if (crmSampleTimer) {
    stopCrmTrackingTimers();
  } else {
    startCrmSamplingLoop();
  }
}
window.toggleCrmAudioPlayback = toggleCrmAudioPlayback;

function nextCrmTrack() {
  stopCrmTrackingTimers();
  if (crmCurrentTrackIdx < CRM_TRACK_SEQUENCE.length - 1) {
    loadCrmTrack(crmCurrentTrackIdx + 1);
  } else {
    finishCrmAndShowReport();
  }
}
window.nextCrmTrack = nextCrmTrack;

function finishCrmAndShowReport() {
  stopCrmTrackingTimers();
  const crmIntro = document.getElementById("somatic-step-crm-intro");
  if (crmIntro) crmIntro.style.display = "none";
  const crmArena = document.getElementById("somatic-step-crm-arena");
  if (crmArena) crmArena.style.display = "none";
  showSomaticSynthesisStep();
}
window.finishCrmAndShowReport = finishCrmAndShowReport;

function initCrmPadListeners() {
  if (crmListenersInitialized) return;
  const pad = document.getElementById("crm-pad-wrap");
  const puck = document.getElementById("crm-cursor-puck");
  if (!pad) return;
  crmListenersInitialized = true;

  function updateFromPointerEvent(e) {
    const rect = pad.getBoundingClientRect();
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    const normX = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const normY = 1 - ((clientY - rect.top) / Math.max(1, rect.height)) * 2;
    updateCrmCursorVisual(normX, normY);
  }

  pad.addEventListener("pointerdown", (e) => {
    crmPointerActive = true;
    if (puck) puck.classList.add("active-touch");
    updateFromPointerEvent(e);
    if (!crmSampleTimer) {
      startCrmSamplingLoop();
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!crmPointerActive) return;
    updateFromPointerEvent(e);
  });

  window.addEventListener("pointerup", () => {
    if (!crmPointerActive) return;
    crmPointerActive = false;
    if (puck) puck.classList.remove("active-touch");
  });
}
window.initCrmPadListeners = initCrmPadListeners;

function buildPsychoacousticCrmSynthesis() {
  const trackSummaries = {};
  let totalSamples = 0;
  let climaxPassionScores = [];
  let vulnerableStayScores = [];
  let suddenStopDeltaScores = [];
  const voiceArchetypeAffinity = {};
  const bedAffinity = {};

  CRM_TRACK_SEQUENCE.forEach(trackObj => {
    const log = crmTrackLogs[trackObj.id];
    const samples = (log && Array.isArray(log.samples)) ? log.samples : [];
    totalSamples += samples.length;

    const cueBreakdown = trackObj.cues.map(cue => {
      const inCue = samples.filter(s => s.t_sec >= cue.start && s.t_sec <= cue.end);
      let avgX = 0, avgY = 0;
      if (inCue.length > 0) {
        avgX = Number((inCue.reduce((a, b) => a + b.x, 0) / inCue.length).toFixed(3));
        avgY = Number((inCue.reduce((a, b) => a + b.y, 0) / inCue.length).toFixed(3));
      }

      if (cue.valence.indexOf("PASSION") !== -1 || cue.valence.indexOf("CLIMAX") !== -1 || cue.valence.indexOf("INTENSITY") !== -1 || cue.valence.indexOf("SURGE") !== -1 || cue.valence.indexOf("EUPHORIC") !== -1 || cue.valence.indexOf("BRILLIANCE") !== -1 || cue.valence.indexOf("POWER") !== -1) {
        if (inCue.length > 0) climaxPassionScores.push(avgX);
      }
      if (cue.valence.indexOf("VULNERABLE") !== -1 || cue.valence.indexOf("INTIMACY") !== -1 || cue.valence.indexOf("PROXIMITY") !== -1) {
        if (inCue.length > 0) vulnerableStayScores.push((avgY + avgX) / 2);
      }
      if (cue.phase === "SUDDEN_SILENCE_STOP" && inCue.length > 0) {
        suddenStopDeltaScores.push(avgY);
      }

      return {
        start_sec: cue.start,
        end_sec: cue.end,
        phase: cue.phase,
        expected_valence: cue.valence,
        sample_count: inCue.length,
        mean_x_spark_vs_distance: avgX,
        mean_y_safety_vs_friction: avgY
      };
    });

    let trackMeanX = 0, trackMeanY = 0;
    if (samples.length > 0) {
      trackMeanX = Number((samples.reduce((a, b) => a + b.x, 0) / samples.length).toFixed(3));
      trackMeanY = Number((samples.reduce((a, b) => a + b.y, 0) / samples.length).toFixed(3));
    }

    const combinedAffinity = Number(((trackMeanX + trackMeanY) / 2).toFixed(3));
    if (trackObj.category === "VOICE") {
      voiceArchetypeAffinity[trackObj.archetypeCode || trackObj.id] = {
        track: trackObj.id,
        mean_x_chemistry: trackMeanX,
        mean_y_safety: trackMeanY,
        affinity_index: combinedAffinity,
        sample_count: samples.length
      };
    } else {
      bedAffinity[trackObj.id] = {
        track: trackObj.id,
        mean_x_chemistry: trackMeanX,
        mean_y_safety: trackMeanY,
        affinity_index: combinedAffinity,
        sample_count: samples.length
      };
    }

    trackSummaries[trackObj.id] = {
      title: trackObj.title,
      duration_sec: trackObj.duration_sec,
      total_samples: samples.length,
      overall_mean_x: trackMeanX,
      overall_mean_y: trackMeanY,
      cue_correlations: cueBreakdown
    };
  });

  const meanClimaxApproach = climaxPassionScores.length > 0
    ? Number((climaxPassionScores.reduce((a, b) => a + b, 0) / climaxPassionScores.length).toFixed(3))
    : 0;
  const meanVulnerabilityResonance = vulnerableStayScores.length > 0
    ? Number((vulnerableStayScores.reduce((a, b) => a + b, 0) / vulnerableStayScores.length).toFixed(3))
    : 0;

  const topVoice = Object.keys(voiceArchetypeAffinity).sort((a, b) =>
    (voiceArchetypeAffinity[b].affinity_index || 0) - (voiceArchetypeAffinity[a].affinity_index || 0)
  )[0] || "VOICE_DEEP_CHEST";

  const topBed = Object.keys(bedAffinity).sort((a, b) =>
    (bedAffinity[b].affinity_index || 0) - (bedAffinity[a].affinity_index || 0)
  )[0] || "bed1";

  return {
    total_crm_samples: totalSamples,
    dominant_bed_world: topBed,
    dominant_voice_archetype: topVoice,
    climax_approach_vs_withdrawal: meanClimaxApproach,
    vulnerability_intimacy_resonance: meanVulnerabilityResonance,
    bed_affinities: bedAffinity,
    voice_archetype_affinities: voiceArchetypeAffinity,
    tracks_cue_sheet_correlation: trackSummaries
  };
}
window.buildPsychoacousticCrmSynthesis = buildPsychoacousticCrmSynthesis;


function openPsychoacousticCrmLab() {
  if (typeof stopCrmTrackingTimers === "function") stopCrmTrackingTimers();
  syncSupabaseStimuliBucket();
  document.body.classList.remove("swipe-locked");
  switchView("view-somatic-lab");
  if (typeof refreshAttemptsUI === "function") refreshAttemptsUI();
  crmTrackLogs = {};
  crmCurrentTrackIdx = 0;
  openCrmIntroStep();
}
window.openPsychoacousticCrmLab = openPsychoacousticCrmLab;
