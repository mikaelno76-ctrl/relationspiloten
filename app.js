/* ============================================================================
   RELATIONSPILOTEN — ARGON 4.0 SOMATISK & TAKTIL MOTOR (app.js)
   ============================================================================ */

/*************************************************************************
 * 1. KONFIGURATION & SUPABASE STORAGE HJÄLPARE
 *************************************************************************/
const CONFIG = {
  supabaseUrl: localStorage.getItem('rp_supa_url') || '',
  supabaseKey: localStorage.getItem('rp_supa_key') || '',
  bucket: localStorage.getItem('rp_bucket') || 'stimuli',
  ext: localStorage.getItem('rp_ext') || 'jpg',
  sessionCode: 'RP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
};

function updateHeaderDot() {
  const dot = document.getElementById('supaStatusDot');
  if (!dot) return;
  if (CONFIG.supabaseUrl) {
    dot.style.background = '#10b981';
    dot.title = 'Kopplad till Supabase: ' + CONFIG.supabaseUrl;
  } else {
    dot.style.background = '#f59e0b';
    dot.title = 'Kör i lokalt SVG-demoläge (klicka på ⚙️ Supabase för att koppla bucket)';
  }
}

function openSettings() {
  document.getElementById('inpSupaUrl').value = CONFIG.supabaseUrl;
  document.getElementById('inpSupaKey').value = CONFIG.supabaseKey;
  document.getElementById('inpBucket').value = CONFIG.bucket;
  document.getElementById('inpExt').value = CONFIG.ext;
  document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
  CONFIG.supabaseUrl = document.getElementById('inpSupaUrl').value.trim().replace(/\/$/, '');
  CONFIG.supabaseKey = document.getElementById('inpSupaKey').value.trim();
  CONFIG.bucket = document.getElementById('inpBucket').value.trim() || 'stimuli';
  CONFIG.ext = document.getElementById('inpExt').value;

  localStorage.setItem('rp_supa_url', CONFIG.supabaseUrl);
  localStorage.setItem('rp_supa_key', CONFIG.supabaseKey);
  localStorage.setItem('rp_bucket', CONFIG.bucket);
  localStorage.setItem('rp_ext', CONFIG.ext);

  updateHeaderDot();
  closeSettings();
  renderCurrentCard();
}

/*************************************************************************
 * 2. DEFINITION AV HJUL 1 & HJUL 2 FÖR KROPP RESPEKTIVE HAND/FOT
 *************************************************************************/
// Varje nod har en underliggande affektvektor [valens (-1..1), arousal (-1..1), struktur (-1..1)]
const WHEELS = {
  BODY: {
    step1Title: 'FORM',
    step2Title: 'FÄRG',
    forms: [
      {
        id: 'FORM_CIRCLE', label: 'Cirkel', vec: [0.85, -0.75, -0.60],
        svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="12" fill="none" stroke="#fcd34d" stroke-width="2.6"/></svg>`
      },
      {
        id: 'FORM_ORGANIC_WAVE', label: 'Våg', vec: [0.90, 0.25, -0.85],
        svg: `<svg viewBox="0 0 36 36"><path d="M4 20 C11 8, 17 28, 24 15 C28 9, 31 18, 33 14" fill="none" stroke="#fcd34d" stroke-width="2.6" stroke-linecap="round"/></svg>`
      },
      {
        id: 'FORM_SQUARE', label: 'Kub', vec: [0.15, -0.25, 0.90],
        svg: `<svg viewBox="0 0 36 36"><rect x="8" y="8" width="20" height="20" rx="2" fill="none" stroke="#fcd34d" stroke-width="2.6"/></svg>`
      },
      {
        id: 'FORM_TRIANGLE', label: 'Triangel', vec: [0.20, 0.80, 0.55],
        svg: `<svg viewBox="0 0 36 36"><polygon points="18,6 30,28 6,28" fill="none" stroke="#fcd34d" stroke-width="2.6" stroke-linejoin="round"/></svg>`
      },
      {
        id: 'FORM_STAR_BURST', label: 'Tagg', vec: [-0.85, 0.95, 0.30],
        svg: `<svg viewBox="0 0 36 36"><polygon points="18,4 22,14 32,12 24,20 29,30 18,24 7,30 12,20 4,12 14,14" fill="none" stroke="#fcd34d" stroke-width="2.2" stroke-linejoin="round"/></svg>`
      },
      {
        id: 'FORM_LINEAR_AXIS', label: 'Pelare', vec: [-0.15, -0.65, 0.80],
        svg: `<svg viewBox="0 0 36 36"><line x1="14" y1="6" x2="14" y2="30" stroke="#fcd34d" stroke-width="2.6"/><line x1="22" y1="6" x2="22" y2="30" stroke="#fcd34d" stroke-width="2.6"/></svg>`
      }
    ],
    colors: [
      { id: 'COLOR_CRIMSON_EARTH', label: 'Terrakotta', hex: '#B83A2C', vec: [0.85, 0.85, -0.30] },
      { id: 'COLOR_WARM_OCHRE', label: 'Solockra', hex: '#D99B38', vec: [0.75, 0.45, -0.20] },
      { id: 'COLOR_SOFT_PEACH', label: 'Persika', hex: '#E8A598', vec: [0.92, -0.35, -0.75] },
      { id: 'COLOR_EARTH_MOSS', label: 'Mossa', hex: '#4A5338', vec: [0.65, -0.80, 0.45] },
      { id: 'COLOR_STEEL_GRAPHITE', label: 'Grafit', hex: '#5A626A', vec: [-0.25, -0.45, 0.85] },
      { id: 'COLOR_COBALT_ICE', label: 'Isblå', hex: '#3B6E9C', vec: [-0.60, 0.20, 0.70] }
    ]
  },
  TACTILE: {
    step1Title: 'TEXTUR',
    step2Title: 'VÄRME',
    forms: [
      {
        id: 'TEX_VELVET', label: 'Sammet', vec: [0.88, -0.70, -0.65],
        svg: `<svg viewBox="0 0 36 36"><rect x="7" y="10" width="22" height="16" rx="8" fill="none" stroke="#fcd34d" stroke-width="2.5"/><circle cx="14" cy="18" r="1.5" fill="#fcd34d"/><circle cx="22" cy="18" r="1.5" fill="#fcd34d"/></svg>`
      },
      {
        id: 'TEX_SILK', label: 'Silkesvåg', vec: [0.92, 0.20, -0.85],
        svg: `<svg viewBox="0 0 36 36"><path d="M6 14 Q18 6, 30 14 M6 22 Q18 14, 30 22" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>`
      },
      {
        id: 'TEX_WOOD', label: 'Träådring', vec: [0.55, -0.45, 0.75],
        svg: `<svg viewBox="0 0 36 36"><ellipse cx="18" cy="18" rx="11" ry="7" fill="none" stroke="#fcd34d" stroke-width="2.2"/><ellipse cx="18" cy="18" rx="5" ry="3" fill="none" stroke="#fcd34d" stroke-width="2"/></svg>`
      },
      {
        id: 'TEX_KNOT', label: 'Flätknut', vec: [0.25, 0.82, 0.65],
        svg: `<svg viewBox="0 0 36 36"><path d="M8 8 L28 28 M28 8 L8 28 M18 5 L18 31" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>`
      },
      {
        id: 'TEX_ICE', label: 'Sprucken is', vec: [-0.88, 0.90, 0.40],
        svg: `<svg viewBox="0 0 36 36"><path d="M8 6 L18 17 L13 24 L26 30 M27 8 L18 17" fill="none" stroke="#fcd34d" stroke-width="2.4" stroke-linecap="round"/></svg>`
      },
      {
        id: 'TEX_BASALT', label: 'Basaltsten', vec: [-0.10, -0.50, 0.90],
        svg: `<svg viewBox="0 0 36 36"><polygon points="10,8 25,7 30,19 22,29 8,26 6,16" fill="none" stroke="#fcd34d" stroke-width="2.4"/></svg>`
      }
    ],
    colors: [
      { id: 'THERM_PULSE_RED', label: 'Pulsröd', hex: '#C84B31', vec: [0.85, 0.88, -0.35] },
      { id: 'THERM_HONEY', label: 'Honung', hex: '#E6B35A', vec: [0.82, 0.35, -0.40] },
      { id: 'THERM_ROSE_QUARTZ', label: 'Rosékvarts', hex: '#DFA69E', vec: [0.90, -0.40, -0.75] },
      { id: 'THERM_WET_CLAY', label: 'Våt lera', hex: '#5A4638', vec: [0.68, -0.78, 0.55] },
      { id: 'THERM_LIMESTONE', label: 'Kalksten', hex: '#9CA3AF', vec: [-0.15, -0.55, 0.80] },
      { id: 'THERM_FROST_STEEL', label: 'Rimfrost', hex: '#608299', vec: [-0.70, 0.30, 0.65] }
    ]
  }
};

/*************************************************************************
 * 3. FULLSTÄNDIG DATAMATRIS (88 BILDER: 4+64 KROPP, 4+16 HAND/FOT)
 *************************************************************************/
function buildFullCatalog() {
  const bodyAnchors = [
    { file: 'ba1', code: 'ANCHOR_PLEASURE', module: 'BODY', isAnchor: true, anchorType: 'PLEASURE', title: 'Sensorisk Lust & Njutning', sub: 'Moget bär mot mjuka läppar — taktil aptit' },
    { file: 'ba2', code: 'ANCHOR_SAFETY', module: 'BODY', isAnchor: true, anchorType: 'SAFETY', title: 'Somatisk Vila & Trygghet', sub: 'Sovande väsen på solvarm ullpläd' },
    { file: 'ba3', code: 'ANCHOR_THREAT', module: 'BODY', isAnchor: true, anchorType: 'THREAT', title: 'Friktion, Kyla & Hot', sub: 'Rostig taggtråd ur sprucken råbetong' },
    { file: 'ba4', code: 'ANCHOR_NEUTRAL', module: 'BODY', isAnchor: true, anchorType: 'NEUTRAL', title: 'Neutral Struktur & Ordning', sub: 'Symmetriska kalkstensblock i jämnt ljus' }
  ];

  const bodyBatches = [
    { g: 'F', vol: 1, vCode: 'SLEND', label: 'Kvinna · Smal' },
    { g: 'M', vol: 1, vCode: 'SLEND', label: 'Man · Smal' },
    { g: 'F', vol: 2, vCode: 'REG',   label: 'Kvinna · Normal' },
    { g: 'M', vol: 2, vCode: 'REG',   label: 'Man · Normal' },
    { g: 'F', vol: 3, vCode: 'CURV',  label: 'Kvinna · Fyllig/Kurvig' },
    { g: 'M', vol: 3, vCode: 'CURV',  label: 'Man · Fyllig/Kraftig' },
    { g: 'F', vol: 4, vCode: 'HEAVY', label: 'Kvinna · Tung/Massiv' },
    { g: 'M', vol: 4, vCode: 'HEAVY', label: 'Man · Tung/Massiv' }
  ];
  const muscTypes = [
    { m: 1, mCode: 'SOFT', label: 'Mjuk' },
    { m: 5, mCode: 'MUSC', label: 'Muskulös' }
  ];
  const artStyles = [
    { sCode: 'BIO', label: 'Biomorfisk skulptur' },
    { sCode: 'CUB', label: 'Kubism' },
    { sCode: 'SAN', label: 'Klassisk rödkrita' },
    { sCode: 'EXP', label: 'Expressionism' }
  ];

  const bodyCards = [];
  let bIdx = 1;
  bodyBatches.forEach((b, batchIdx) => {
    muscTypes.forEach(m => {
      artStyles.forEach(s => {
        const numStr = String(bIdx).padStart(2, '0');
        bodyCards.push({
          file: `b${numStr}`,
          code: `BODY_${b.g}_${b.vCode}_${m.mCode}_${s.sCode}`,
          module: 'BODY',
          isAnchor: false,
          batch: batchIdx + 1,
          gender: b.g,
          volume: b.vol,
          muscle: m.m,
          style: s.sCode,
          title: `Arketyp #${numStr} (${s.label})`,
          sub: `${b.label} · ${m.label}`
        });
        bIdx++;
      });
    });
  });

  const tactileAnchors = [
    { file: 'ta1', code: 'ANCHOR_TACTILE_PLEASURE', module: 'TACTILE', isAnchor: true, anchorType: 'PLEASURE', title: 'Taktil Njutning & Värme', sub: 'Varm gyllene honung över röd sammet & flodsten' },
    { file: 'ta2', code: 'ANCHOR_TACTILE_SAFETY', module: 'TACTILE', isAnchor: true, anchorType: 'SAFETY', title: 'Jordad Bärkraft & Trygghet', sub: 'Solvarm skogsmossa möter grovstickad merinoull' },
    { file: 'ta3', code: 'ANCHOR_TACTILE_THREAT', module: 'TACTILE', isAnchor: true, anchorType: 'THREAT', title: 'Taktil Smärta & Kyla', sub: 'Frostbitna glasskärvor och rostig metall i is' },
    { file: 'ta4', code: 'ANCHOR_TACTILE_NEUTRAL', module: 'TACTILE', isAnchor: true, anchorType: 'NEUTRAL', title: 'Neutral Bruksyta', sub: 'Släthyvlad askträskiva och torr matt kalksten' }
  ];

  const hfSpecs = [
    { g: 'F', act: 1, sc: 1, den: 1, code: 'FEM_PAS_SMALL_SLEND', desc: 'Feminin · Passiv · Liten · Smal' },
    { g: 'F', act: 1, sc: 5, den: 5, code: 'FEM_PAS_LARGE_THICK', desc: 'Feminin · Passiv · Stor · Fyllig' },
    { g: 'F', act: 5, sc: 1, den: 5, code: 'FEM_ACT_SMALL_THICK', desc: 'Feminin · Aktiv · Liten · Fyllig' },
    { g: 'F', act: 5, sc: 5, den: 1, code: 'FEM_ACT_LARGE_SLEND', desc: 'Feminin · Aktiv · Stor · Senig' },
    { g: 'M', act: 1, sc: 1, den: 5, code: 'MASC_PAS_SMALL_THICK', desc: 'Maskulin · Passiv · Kompakt · Bred' },
    { g: 'M', act: 1, sc: 5, den: 1, code: 'MASC_PAS_LARGE_SLEND', desc: 'Maskulin · Passiv · Stor · Långfingrad' },
    { g: 'M', act: 5, sc: 1, den: 1, code: 'MASC_ACT_SMALL_SLEND', desc: 'Maskulin · Aktiv · Kompakt · Senig' },
    { g: 'M', act: 5, sc: 5, den: 5, code: 'MASC_ACT_LARGE_THICK', desc: 'Maskulin · Aktiv · Massiv · Grov' }
  ];

  const tactileCards = [];
  hfSpecs.forEach((sp, i) => {
    tactileCards.push({
      file: `h${i + 1}`,
      code: `HAND_0${i + 1}_${sp.code}`,
      module: 'TACTILE',
      isAnchor: false,
      part: 'HAND',
      gender: sp.g,
      activity: sp.act,
      scale: sp.sc,
      density: sp.den,
      title: `Handstudie #${i + 1} (Rödkrita)`,
      sub: sp.desc
    });
  });

  hfSpecs.forEach((sp, i) => {
    tactileCards.push({
      file: `f${i + 1}`,
      code: `FOOT_0${i + 1}_${sp.code}`,
      module: 'TACTILE',
      isAnchor: false,
      part: 'FOOT',
      gender: sp.g,
      activity: sp.act,
      scale: sp.sc,
      density: sp.den,
      title: `Fotstudie #${i + 1} (Rödkrita)`,
      sub: sp.desc
    });
  });

  return { bodyAnchors, bodyCards, tactileAnchors, tactileCards };
}

const CATALOG = buildFullCatalog();

/*************************************************************************
 * 4. OFF-GUARD "DJÄVULSTESTET" (8 SKARPA DILEMMAN INBÄDDADE I FLÖDET)
 *************************************************************************/
const DEVIL_QUESTIONS = [
  {
    id: 'DEVIL_01_CANCEL',
    q: 'En person du tycker om ställer in en efterlängtad träff med kort varsel för att hen "inte orkar". Vad är din allra första, ofiltrerade reflex inombords?',
    options: [
      { type: 'HALO', text: 'Jag känner enbart ren omsorg och vill direkt fråga hur jag kan stötta.' },
      { type: 'AUTH', text: 'En kort stöt av irritation och besvikelse, innan jag sekunden efter förstår läget.' },
      { type: 'AVOID', text: 'Jag rycker på axlarna och stänger av känslan direkt – det rör mig inte.' },
      { type: 'PASSIVE', text: 'Jag skriver "helt lugnt!", men blir lite kort i tonen nästa gång vi hörs.' }
    ]
  },
  {
    id: 'DEVIL_02_ENVY',
    q: 'Någon i din bekantskapskrets som ofta skryter och tar stor plats misslyckas plötsligt med ett stort projekt. Vad händer i dig under första sekunden?',
    options: [
      { type: 'HALO', text: 'Jag känner bara genuint medlidande och hoppas att personen inte tar det hårt.' },
      { type: 'AUTH', text: 'En mikrosekund av skadeglädje ("rätt åt hen"), innan mitt vuxna förnuft tar över.' },
      { type: 'AVOID', text: 'Ingenting alls – andras motgångar eller framgångar berör mig noll.' }
    ]
  },
  {
    id: 'DEVIL_03_HURT_CAUSE',
    q: 'När du ser tillbaka på ett tillfälle då du genuint sårade någon som stod dig nära: vad var den ärliga orsaken?',
    options: [
      { type: 'HALO', text: 'Jag ville bara väl och personen missförstod mina goda avsikter helt.' },
      { type: 'AUTH', text: 'Jag var trött, pressad eller självisk och satte min egen bekvämlighet först just då.' },
      { type: 'PASSIVE', text: 'Jag blev orättvist provocerad först och tvingades försvara mig.' }
    ]
  },
  {
    id: 'DEVIL_04_PRIDE',
    q: 'Någon ifrågasätter din kompetens eller intelligens helt orättvist inför andra. Hur reagerar du på insidan?',
    options: [
      { type: 'HALO', text: 'Jag förblir fullkomligt lugn och känner mest empati för personens egen osäkerhet.' },
      { type: 'AUTH', text: 'Det hugger till rejält i stoltheten och jag får puls – vill antingen bita ifrån eller gå därifrån.' },
      { type: 'PASSIVE', text: 'Jag ler och håller med utåt, men ältar händelsen tyst i flera dagar efteråt.' }
    ]
  },
  {
    id: 'DEVIL_05_TRUTH_DILEMMA',
    q: 'Du måste välja mellan två obekväma alternativ en fredagskväll med en partner:',
    options: [
      { type: 'AUTH', text: 'Att säga en obekväm sanning som riskerar att såra min partner och förstöra kvällens stämning.' },
      { type: 'PASSIVE', text: 'Att dra en mjuk vit nödlögn för att bevara husfriden och slippa en tung diskussion.' },
      { type: 'HALO', text: 'Jag hamnar aldrig i den situationen eftersom jag alltid formulerar sanningen så att alla blir glada.' }
    ]
  },
  {
    id: 'DEVIL_06_FRIEND_CALL',
    q: 'En vän som ofta kräver mycket energi ringer sent på kvällen när du precis lagt dig i soffan helt slutkörd. Vad gör du?',
    options: [
      { type: 'HALO', text: 'Jag svarar alltid med värme direkt – en vän i behov går före min egen trötthet alla dagar i veckan.' },
      { type: 'AUTH', text: 'Jag tittar på skärmen, suckar tyst och låter det ringa ut med planen att höra av mig imorgon.' },
      { type: 'PASSIVE', text: 'Jag svarar men låter så pass trött och kortfattad att hen snabbt förstår vinken.' }
    ]
  },
  {
    id: 'DEVIL_07_PARTNER_FLAW',
    q: 'Vilken typ av svaghet hos en partner är svårast för dig att inte bli inombords irriterad på i längden?',
    options: [
      { type: 'HALO', text: 'Ingen alls – älskar man någon på riktigt accepterar man alla sidor utan att bli irriterad.' },
      { type: 'AUTH', text: 'Om personen blir passiv, obeslutsam eller lägger över allt praktiskt ansvar på mig.' },
      { type: 'AUTH', text: 'Om personen är överdrivet kritisk, rastlös eller aldrig kan slappna av i nuet.' }
    ]
  },
  {
    id: 'DEVIL_08_APOLOGY',
    q: 'När ett gräl har låst sig och du vet att du har 30 % av skulden och din partner har 70 % – vad händer oftast?',
    options: [
      { type: 'HALO', text: 'Jag tar direkt på mig hela ansvaret utan minsta motstånd för att läka stämningen.' },
      { type: 'AUTH', text: 'Det tar emot i egot att be om ursäkt först när den andra gjorde mer fel, men jag försöker till slut.' },
      { type: 'AVOID', text: 'Jag väntar ut den andra tills hen ber om ursäkt först, annars får det vara tyst.' }
    ]
  }
];

/*************************************************************************
 * 5. TESTFLÖDE & TILLSTÅNDSHANTERING
 *************************************************************************/
let activeDeck = [];
let currentIndex = 0;
let cardShownAt = 0;
let wheelStep = 1;
let tempSelectedForm = null;

// Kalibrerade ankare per modul
let anchors = {
  BODY: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null },
  TACTILE: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null }
};

let swipeResponses = [];
let devilResponses = [];
let scheduledDevilIndices = {};
let offguardShownAt = 0;
let activeDevilQ = null;

function buildSuiteDeck(scope) {
  let deck = [];
  scheduledDevilIndices = {};

  if (scope === 'quick_all') {
    deck.push(...CATALOG.bodyAnchors);
    for (let b = 1; b <= 8; b++) {
      const batchCards = CATALOG.bodyCards.filter(c => c.batch === b);
      deck.push(batchCards[b % batchCards.length]);
    }
    deck.push(...CATALOG.tactileAnchors);
    deck.push(CATALOG.tactileCards[0], CATALOG.tactileCards[1], CATALOG.tactileCards[4], CATALOG.tactileCards[7]);
    deck.push(CATALOG.tactileCards[8], CATALOG.tactileCards[9], CATALOG.tactileCards[12], CATALOG.tactileCards[15]);

    scheduledDevilIndices = {
      6: DEVIL_QUESTIONS[0],
      10: DEVIL_QUESTIONS[1],
      15: DEVIL_QUESTIONS[2],
      19: DEVIL_QUESTIONS[3],
      22: DEVIL_QUESTIONS[4]
    };
  } else if (scope === 'full_all') {
    deck = [
      ...CATALOG.bodyAnchors,
      ...CATALOG.bodyCards,
      ...CATALOG.tactileAnchors,
      ...CATALOG.tactileCards
    ];
    const checkpoints = [10, 22, 34, 46, 58, 70, 78, 84];
    checkpoints.forEach((cp, idx) => {
      if (DEVIL_QUESTIONS[idx]) scheduledDevilIndices[cp] = DEVIL_QUESTIONS[idx];
    });
  } else if (scope === 'body_only') {
    deck = [...CATALOG.bodyAnchors, ...CATALOG.bodyCards];
    [10, 24, 38, 52, 64].forEach((cp, idx) => {
      scheduledDevilIndices[cp] = DEVIL_QUESTIONS[idx];
    });
  } else if (scope === 'tactile_only') {
    deck = [...CATALOG.tactileAnchors, ...CATALOG.tactileCards];
    [6, 11, 15, 18].forEach((cp, idx) => {
      scheduledDevilIndices[cp] = DEVIL_QUESTIONS[idx];
    });
  }

  return deck;
}

function restartSuite() {
  const scope = document.getElementById('testScopeSelect').value;
  activeDeck = buildSuiteDeck(scope);
  currentIndex = 0;
  swipeResponses = [];
  devilResponses = [];
  anchors = {
    BODY: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null },
    TACTILE: { PLEASURE: null, SAFETY: null, THREAT: null, NEUTRAL: null }
  };
  document.getElementById('telClarity').textContent = '100%';
  renderCurrentCard();
}

/*************************************************************************
 * 6. BILDLADDARE MED AUTOMATISK SUPABASE BUCKET + SVG-FALLBACK
 *************************************************************************/
function getProceduralSvg(card) {
  if (card.isAnchor) {
    if (card.anchorType === 'PLEASURE') {
      return `<svg viewBox="0 0 240 300" width="210" height="260">
        <defs><radialGradient id="gPl" cx="45%" cy="40%" r="55%"><stop offset="0%" stop-color="#f87171"/><stop offset="60%" stop-color="#991b1b"/><stop offset="100%" stop-color="#450a0a"/></radialGradient></defs>
        <path d="M55 120 Q120 85 185 120 Q120 155 55 120 Z" fill="#b91c1c" opacity="0.5"/>
        <path d="M120 75 C165 75, 175 145, 120 215 C65 145, 75 75, 120 75 Z" fill="url(#gPl)"/>
        <circle cx="105" cy="125" r="2.2" fill="#fde047"/><circle cx="135" cy="130" r="2.2" fill="#fde047"/><circle cx="120" cy="158" r="2.2" fill="#fde047"/><circle cx="108" cy="175" r="2.2" fill="#fde047"/><circle cx="132" cy="172" r="2.2" fill="#fde047"/>
      </svg>`;
    }
    if (card.anchorType === 'SAFETY') {
      return `<svg viewBox="0 0 240 300" width="210" height="260">
        <defs><radialGradient id="gSf" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde68a"/><stop offset="70%" stop-color="#b45309"/><stop offset="100%" stop-color="#3f2e21"/></radialGradient></defs>
        <ellipse cx="120" cy="175" rx="82" ry="48" fill="#4a5338" opacity="0.55"/>
        <circle cx="120" cy="150" r="54" fill="url(#gSf)"/>
        <path d="M88 145 Q120 175 152 145" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
    }
    if (card.anchorType === 'THREAT') {
      return `<svg viewBox="0 0 240 300" width="210" height="260">
        <path d="M25 80 L215 220 M25 210 L215 90 M40 150 L200 150" stroke="#9ca3af" stroke-width="3.5"/>
        <polygon points="80,105 95,75 102,115 70,125" fill="#ef4444"/>
        <polygon points="145,135 168,110 160,158 132,160" fill="#dc2626"/>
        <polygon points="110,175 130,210 100,195 125,140" fill="#991b1b"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 240 300" width="210" height="260">
      <rect x="55" y="70" width="60" height="60" fill="#374151" stroke="#9ca3af" stroke-width="1.5"/>
      <rect x="125" y="70" width="60" height="60" fill="#4b5563" stroke="#9ca3af" stroke-width="1.5"/>
      <rect x="55" y="140" width="60" height="60" fill="#4b5563" stroke="#9ca3af" stroke-width="1.5"/>
      <rect x="125" y="140" width="60" height="60" fill="#374151" stroke="#9ca3af" stroke-width="1.5"/>
    </svg>`;
  }

  if (card.module === 'BODY') {
    const w = 36 + card.volume * 16;
    const shoulder = card.gender === 'M' ? w * 1.18 : w * 0.92;
    const hip = card.gender === 'F' ? w * 1.18 : w * 0.92;
    const waist = card.muscle === 5 ? w * 0.72 : w * 0.95;
    const strokeCol = card.style === 'SAN' ? '#d97706' : (card.style === 'CUB' ? '#60a5fa' : '#e5e7eb');
    const fillCol = card.muscle === 5 ? 'rgba(180, 83, 9, 0.35)' : 'rgba(217, 119, 6, 0.22)';

    return `<svg viewBox="0 0 240 300" width="210" height="260">
      <path d="M ${120 - shoulder} 75
               Q ${120 - waist} 145 ${120 - hip} 225
               L ${120 + hip} 225
               Q ${120 + waist} 145 ${120 + shoulder} 75 Z"
            fill="${fillCol}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="120" y1="68" x2="120" y2="235" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4"/>
    </svg>`;
  }

  const strokeW = card.density === 5 ? 4.2 : 2.0;
  const scaleNum = card.scale === 5 ? 1.18 : 0.82;
  return `<svg viewBox="0 0 240 300" width="210" height="260">
    <g transform="translate(120,150) scale(${scaleNum}) translate(-120,-150)">
      <rect x="65" y="55" width="110" height="180" rx="8" fill="#fdf8f0" opacity="0.08"/>
      <path d="M85 210 C80 165, 75 110, 92 85 C98 115, 102 135, 104 80 C112 115, 118 135, 122 78 C130 115, 136 135, 142 88 C152 120, 158 145, 165 118 C168 160, 155 195, 145 215 Z"
            fill="rgba(184, 58, 44, 0.28)" stroke="#d97706" stroke-width="${strokeW}" stroke-linejoin="round"/>
    </g>
  </svg>`;
}

function loadCardVisual(card) {
  const imgEl = document.getElementById('stimulusImg');
  const fbEl = document.getElementById('fallbackContainer');
  const filePill = document.getElementById('filePill');

  const extsToTry = [CONFIG.ext, 'jpg', 'png', 'webp', 'jpeg'].filter((v, i, a) => a.indexOf(v) === i);
  let attempt = 0;

  filePill.textContent = `${card.file}.${CONFIG.ext}`;

  if (!CONFIG.supabaseUrl) {
    imgEl.style.display = 'none';
    fbEl.style.display = 'flex';
    fbEl.innerHTML = getProceduralSvg(card) +
      `<div style="font-size:11px;color:#9ca3af;margin-top:8px;">Lokal förhandsvisning (<code>${card.file}.${CONFIG.ext}</code>)</div>`;
    return;
  }

  function tryNextExt() {
    if (attempt >= extsToTry.length) {
      imgEl.style.display = 'none';
      fbEl.style.display = 'flex';
      fbEl.innerHTML = getProceduralSvg(card) +
        `<div style="font-size:11px;color:#fca5a5;margin-top:8px;">Hittade ej <code>${card.file}.${CONFIG.ext}</code> i bucket <code>${CONFIG.bucket}</code> (visar SVG-reserv)</div>`;
      return;
    }
    const ext = extsToTry[attempt++];
    const url = `${CONFIG.supabaseUrl}/storage/v1/object/public/${CONFIG.bucket}/${card.file}.${ext}`;
    filePill.textContent = `${card.file}.${ext}`;

    imgEl.onload = () => {
      fbEl.style.display = 'none';
      imgEl.style.display = 'block';
    };
    imgEl.onerror = () => {
      tryNextExt();
    };
    imgEl.src = url;
  }

  tryNextExt();
}

function renderCurrentCard() {
  if (currentIndex >= activeDeck.length) {
    showFinalReport();
    return;
  }

  const card = activeDeck[currentIndex];
  document.getElementById('progressCounter').textContent = `Kort ${currentIndex + 1} av ${activeDeck.length}`;
  document.getElementById('phaseBadge').textContent = card.isAnchor ? 'KALIBRERING' : (card.module === 'BODY' ? 'KROPPSMATRIS' : 'HAND & FOT');
  document.getElementById('modulePill').textContent = card.module === 'BODY' ? 'MODUL 1: KROPP (FORM + FÄRG)' : 'MODUL 2: HAND/FOT (TEXTUR + VÄRME)';
  document.getElementById('cardTag').textContent = card.isAnchor ? 'KALIBRERINGSANKARE' : 'PROJEKTIV STIMULI';
  document.getElementById('cardTitle').textContent = card.title;
  document.getElementById('cardSubtitle').textContent = card.sub;
  document.getElementById('cardCode').textContent = card.code;

  loadCardVisual(card);
  closeWheel();
  cardShownAt = performance.now();
}

/*************************************************************************
 * 7. 2-STEGS RADIALHJUL (TOUCH-SVEP & KLICK)
 *************************************************************************/
const viewport = document.getElementById('viewport');
const wheelOverlay = document.getElementById('wheelOverlay');
const wheelNodesEl = document.getElementById('wheelNodes');
const wheelContainer = document.getElementById('wheelContainer');

function renderWheelNodes(step) {
  const card = activeDeck[currentIndex];
  const wheelSpec = WHEELS[card.module];
  const items = step === 1 ? wheelSpec.forms : wheelSpec.colors;

  document.getElementById('wheelStepLabel').textContent = step === 1 ? 'STEG 1' : 'STEG 2';
  document.getElementById('wheelStepTitle').textContent = step === 1 ? wheelSpec.step1Title : wheelSpec.step2Title;

  wheelNodesEl.innerHTML = '';
  const radius = 104;
  const center = 140;

  items.forEach((item, idx) => {
    const angleDeg = idx * 60 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);

    const node = document.createElement('div');
    node.className = 'wheel-node';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.dataset.index = idx;

    if (step === 1) {
      node.innerHTML = `${item.svg}<span class="node-label">${item.label}</span>`;
    } else {
      node.style.background = item.hex;
      node.innerHTML = `<span class="node-label">${item.label}</span>`;
    }

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      commitWheelChoice(idx);
    });

    wheelNodesEl.appendChild(node);
  });
}

function openWheel() {
  wheelStep = 1;
  tempSelectedForm = null;
  renderWheelNodes(1);
  wheelOverlay.classList.add('active');
}

function closeWheel() {
  wheelOverlay.classList.remove('active');
}

function commitWheelChoice(itemIdx) {
  const card = activeDeck[currentIndex];
  const wheelSpec = WHEELS[card.module];

  if (wheelStep === 1) {
    tempSelectedForm = wheelSpec.forms[itemIdx];
    wheelStep = 2;
    renderWheelNodes(2);
  } else {
    const selectedColor = wheelSpec.colors[itemIdx];
    const latencyMs = Math.round(performance.now() - cardShownAt);
    closeWheel();
    recordCardSwipe(card, tempSelectedForm, selectedColor, latencyMs);
  }
}

let isDraggingWheel = false;
let highlightedIdx = null;

viewport.addEventListener('pointerdown', () => {
  if (!wheelOverlay.classList.contains('active')) {
    openWheel();
    isDraggingWheel = true;
  }
});

window.addEventListener('pointermove', (e) => {
  if (!wheelOverlay.classList.contains('active')) return;
  const rect = wheelContainer.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const dist = Math.hypot(dx, dy);

  const nodes = wheelNodesEl.querySelectorAll('.wheel-node');
  nodes.forEach(n => n.classList.remove('highlighted'));

  if (dist > 38) {
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    const sector = Math.round(deg / 60) % 6;
    highlightedIdx = sector;
    if (nodes[sector]) nodes[sector].classList.add('highlighted');
  } else {
    highlightedIdx = null;
  }
});

window.addEventListener('pointerup', () => {
  if (!wheelOverlay.classList.contains('active')) return;
  if (highlightedIdx !== null) {
    const chosen = highlightedIdx;
    highlightedIdx = null;
    commitWheelChoice(chosen);
  }
});

/*************************************************************************
 * 8. EUKLIDISK VEKTORBERÄKNING & OFF-GUARD TRIGGER
 *************************************************************************/
function combineVectors(formObj, colorObj) {
  return [
    (formObj.vec[0] + colorObj.vec[0]) / 2,
    (formObj.vec[1] + colorObj.vec[1]) / 2,
    (formObj.vec[2] + colorObj.vec[2]) / 2
  ];
}

function euclideanDist(v1, v2) {
  if (!v1 || !v2) return null;
  const d0 = v1[0] - v2[0];
  const d1 = v1[1] - v2[1];
  const d2 = v1[2] - v2[2];
  return Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2);
}

function recordCardSwipe(card, formObj, colorObj, latencyMs) {
  const vec = combineVectors(formObj, colorObj);

  if (card.isAnchor) {
    anchors[card.module][card.anchorType] = vec;
    document.getElementById('telLatency').textContent = `${latencyMs} ms`;
    document.getElementById('telStatusLog').textContent =
      `Kalibrerade ${card.code}: ${formObj.label} + ${colorObj.label} (${latencyMs} ms)`;
  } else {
    const modAnchors = anchors[card.module];
    const distPleasure = euclideanDist(vec, modAnchors.PLEASURE || [0.85, 0.5, -0.5]);
    const distSafety = euclideanDist(vec, modAnchors.SAFETY || [0.85, -0.7, -0.5]);

    const pleasureAffinity = Math.max(0, Math.min(1, 1 - distPleasure / 2.4));
    const safetyAffinity = Math.max(0, Math.min(1, 1 - distSafety / 2.4));

    swipeResponses.push({
      code: card.code,
      file: card.file,
      module: card.module,
      form: formObj.id,
      color: colorObj.id,
      latencyMs,
      pleasureAffinity: Number(pleasureAffinity.toFixed(3)),
      safetyAffinity: Number(safetyAffinity.toFixed(3)),
      meta: card
    });

    document.getElementById('telLatency').textContent = `${latencyMs} ms`;
    document.getElementById('telPleasure').textContent = `${Math.round(pleasureAffinity * 100)}%`;
    document.getElementById('telSafety').textContent = `${Math.round(safetyAffinity * 100)}%`;
    document.getElementById('telStatusLog').textContent =
      `Registrerade ${card.file}: ${formObj.label} + ${colorObj.label} -> Lust-närhet ${Math.round(pleasureAffinity * 100)}%`;
  }

  const finishedIndex = currentIndex + 1;
  currentIndex++;

  if (scheduledDevilIndices[finishedIndex]) {
    triggerOffGuardQuestion(scheduledDevilIndices[finishedIndex]);
  } else {
    renderCurrentCard();
  }
}

function triggerOffGuardQuestion(qObj) {
  activeDevilQ = qObj;
  document.getElementById('offguardQuestion').textContent = qObj.q;
  const optsEl = document.getElementById('offguardOptions');
  optsEl.innerHTML = '';

  const shuffled = [...qObj.options].sort(() => Math.random() - 0.5);
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'offguard-btn';
    btn.textContent = opt.text;
    btn.onclick = () => commitOffGuardAnswer(opt.type);
    optsEl.appendChild(btn);
  });

  offguardShownAt = performance.now();
  document.getElementById('offguardModal').classList.add('active');
}

function commitOffGuardAnswer(choiceType) {
  const latencyMs = Math.round(performance.now() - offguardShownAt);
  devilResponses.push({
    id: activeDevilQ.id,
    type: choiceType,
    latencyMs
  });

  document.getElementById('offguardModal').classList.remove('active');

  const clarity = computeClarityMetrics();
  document.getElementById('telClarity').textContent = `${clarity.profileClarityPct}%`;
  document.getElementById('telStatusLog').textContent =
    `Off-Guard svar loggat (${latencyMs} ms) — Aktuell profilskärpa: ${clarity.profileClarityPct}%`;

  renderCurrentCard();
}

/*************************************************************************
 * 9. SYNTESMOTOR FÖR DE 3 SEPARATA LAGREN & SUPABASE-SPARNING
 *************************************************************************/
function computeClarityMetrics() {
  if (devilResponses.length === 0) {
    return { haloRatio: 0, authRatio: 1, profileClarityPct: 100, avgLatencyMs: 0, statusLabel: 'Hög skärpa' };
  }
  const haloCount = devilResponses.filter(r => r.type === 'HALO').length;
  const authCount = devilResponses.filter(r => r.type === 'AUTH').length;
  const fastHaloCount = devilResponses.filter(r => r.type === 'HALO' && r.latencyMs < 2400).length;
  const avgLat = Math.round(devilResponses.reduce((acc, r) => acc + r.latencyMs, 0) / devilResponses.length);

  const haloRatio = Number((haloCount / devilResponses.length).toFixed(2));
  const authRatio = Number((authCount / devilResponses.length).toFixed(2));

  let clarity = 100 - Math.round(haloRatio * 65) - (fastHaloCount * 8);
  clarity = Math.max(15, Math.min(100, clarity));

  let statusLabel = 'Hög profilskärpa (Autentisk & ofiltrerad)';
  if (clarity < 55) {
    statusLabel = 'Låg profilskärpa — Idealiserad fasad (behöver extra runda)';
  } else if (clarity < 80) {
    statusLabel = 'Medelhög skärpa — Viss social anpassning';
  }

  return { haloRatio, authRatio, profileClarityPct: clarity, avgLatencyMs: avgLat, statusLabel };
}

function buildFinalSynthesis() {
  const bodySwipes = swipeResponses.filter(r => r.module === 'BODY');
  const tacSwipes = swipeResponses.filter(r => r.module === 'TACTILE');

  let wVol = 2.5, wMusc = 3.0, topBodyStyle = 'BIO';
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
    topBodyStyle = Object.keys(styleScores).sort((a, b) => styleScores[b] - styleScores[a])[0] || 'BIO';
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

  const clarity = computeClarityMetrics();

  return {
    session_code: CONFIG.sessionCode,
    test_mode: document.getElementById('testScopeSelect').value,
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

function showFinalReport() {
  const syn = buildFinalSynthesis();
  const volDesc = syn.body_synthesis.preferred_volume_1_to_4 < 2.1 ? 'Slank / Lätt' :
                  (syn.body_synthesis.preferred_volume_1_to_4 > 3.0 ? 'Fyllig / Tungt grundad' : 'Balanserad / Normal');
  const muscDesc = syn.body_synthesis.preferred_muscle_1_to_5 > 3.1 ? 'Muskulös / Spänd tonus' : 'Mjuk / Eftergivlig tonus';
  const actDesc = syn.tactile_synthesis.activity_axis_1_pas_5_act > 3.0 ? 'Aktiv & Handlingskraftig' : 'Passiv & Vilande';
  const scaleDesc = syn.tactile_synthesis.scale_axis_1_small_5_large > 3.0 ? 'Stor & Skyddande skala' : 'Liten & Finkänslig skala';

  document.getElementById('reportContent').innerHTML = `
    <div class="layer-box">
      <div class="layer-title">Lager 1: Somatisk Polaritet (Kroppsmatris)</div>
      <div class="metric-grid">
        <div class="metric-item">
          <div class="metric-label">Volymresonans (1–4)</div>
          <div class="metric-value">${syn.body_synthesis.preferred_volume_1_to_4} (${volDesc})</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Muskeltonus (1–5)</div>
          <div class="metric-value">${syn.body_synthesis.preferred_muscle_1_to_5} (${muscDesc})</div>
        </div>
      </div>
    </div>

    <div class="layer-box">
      <div class="layer-title">Lager 2: Taktil & Kinestetisk Polaritet (Händer & Fötter)</div>
      <div class="metric-grid">
        <div class="metric-item">
          <div class="metric-label">Rörelseenergi (1–5)</div>
          <div class="metric-value">${syn.tactile_synthesis.activity_axis_1_pas_5_act} (${actDesc})</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Skala & Förankring (1–5)</div>
          <div class="metric-value">${syn.tactile_synthesis.scale_axis_1_small_5_large} (${scaleDesc})</div>
        </div>
      </div>
    </div>

    <div class="layer-box">
      <div class="layer-title">Lager 3: Djävulstestet (Off-Guard Profilskärpa)</div>
      <div class="metric-grid">
        <div class="metric-item">
          <div class="metric-label">Profilskärpa</div>
          <div class="metric-value">${syn.clarity_metrics.profileClarityPct}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Helgonkvot (Halo Ratio)</div>
          <div class="metric-value">${Math.round(syn.clarity_metrics.haloRatio * 100)}% (${syn.clarity_metrics.avgLatencyMs} ms)</div>
        </div>
      </div>
      <div style="font-size:12px;color:#d1d5db;margin-top:8px;">
        Status: <strong>${syn.clarity_metrics.statusLabel}</strong>
      </div>
    </div>
  `;

  document.getElementById('reportModal').classList.add('active');
}

async function saveProfileToSupabase() {
  const btn = document.getElementById('btnSaveSupabase');
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
    alert('Fyll i både Supabase URL och Supabase Anon Key under ⚙️ Supabase för att spara raden till tabellen argon_somatic_profiles.');
    return;
  }
  btn.textContent = 'Sparar till Supabase...';
  const payload = buildFinalSynthesis();

  try {
    const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/argon_somatic_profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.supabaseKey,
        'Authorization': `Bearer ${CONFIG.supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      btn.textContent = '✅ Sparad i argon_somatic_profiles!';
      btn.style.background = '#10b981';
    } else {
      const errTxt = await res.text();
      btn.textContent = '⚠️ Fel vid sparning (se konsol)';
      console.error('Supabase error:', errTxt);
      alert('Kunde inte spara till tabellen. Kontrollera att du har kört supabase_setup.sql i SQL Editor.\n\nDetalj: ' + errTxt);
    }
  } catch (err) {
    btn.textContent = '⚠️ Nätverksfel';
    alert('Nätverksfel: ' + err.message);
  }
}

function downloadJsonReport() {
  const data = buildFinalSynthesis();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `argon4_profil_${CONFIG.sessionCode}.json`;
  a.click();
}

function closeReportAndRestart() {
  document.getElementById('reportModal').classList.remove('active');
  restartSuite();
}

// Initiera vid sidladdning
updateHeaderDot();
restartSuite();
