/**
 * Agentic Ultron - Vedic Kundali, Month Monster, Sacred Tattoo & Destiny Engine
 */

// ---------------------------------------------------------------------------
// 1. MONSTERS DATABASE (Months 1 to 12)
// ---------------------------------------------------------------------------
const MONSTERS_DB = {
  1: {
    month: "January",
    name: "Frost Wraith",
    quote: "Born from winter's silence, it feeds on warmth.",
    lore: "Forged in the heart of absolute zero, the Frost Wraith strips away all illusions. It grants you the ability to remain calm, calculating, and impervious to emotional manipulation during life's fiercest blizzards.",
    affinity: "Glacial Frost & Stillness",
    power: "Cryo-Shield & Absolute Focus"
  },
  2: {
    month: "February",
    name: "Heartless",
    quote: "It was once human, until love betrayed it.",
    lore: "A majestic entity of hardened obsidian and armored sinew. It shields your inner core from vulnerability, transmuting emotional wounds into impenetrable psychological armor and unbreakable resolve.",
    affinity: "Obsidian Core & Karmic Steel",
    power: "Emotional Fortress & Unyielding Will"
  },
  3: {
    month: "March",
    name: "Dusk Stalker",
    quote: "It walks between light and dark, stealing hope.",
    lore: "A creature of the twilight dimensional rift. It teaches you to walk unnoticed through hazardous territory, spot hidden deceits, and strike with surgical precision when the opportune moment presents itself.",
    affinity: "Twilight Shadows & Dimensional Phase",
    power: "Shadow Stealth & Intuitive Perception"
  },
  4: {
    month: "April",
    name: "Twilight Jester",
    quote: "It brings laughter first, then your end.",
    lore: "A chaotic cosmic trickster masked in theatrical horns and blades. It breaks rigid conventions, bends reality through sharp wit and humor, and turns opponents' momentum against themselves.",
    affinity: "Chaos Magic & Mercurial Spark",
    power: "Reality Inversion & Strategic Subversion"
  },
  5: {
    month: "May",
    name: "Bloom Fiend",
    quote: "It feasts on beauty and leaves decay.",
    lore: "An ancient botanical predator woven from thorned vines and dark chlorophyll. It absorbs ambient vitality and transmutes stagnation into fertile ground for your ambition to violently flourish.",
    affinity: "Dark Flora & Bio-Transmutation",
    power: "Regeneration & Rapid Manifestation"
  },
  6: {
    month: "June",
    name: "Abyssal Serpent",
    quote: "It lurks in the deep, waiting for the weak.",
    lore: "A leviathan dwelling in the oceanic trench of the subconscious. It bestows immense patience, granting you the power to dive deep into unexplored knowledge and emerge with sunken treasures of wisdom.",
    affinity: "Tidal Pressure & Oceanic Dark",
    power: "Deep Subconscious Sight & Strategic Depth"
  },
  7: {
    month: "July",
    name: "Cinder Lord",
    quote: "He rules the ashes of what was once alive.",
    lore: "A crowned emperor rising from molten embers. It burns away self-doubt and past failures, forging an indomitable aura of royal authority and charismatic magnetism that demands respect.",
    affinity: "Solar Fire & Molten Magma",
    power: "Charismatic Rebirth & Sovereign Command"
  },
  8: {
    month: "August",
    name: "Eclipse Beast",
    quote: "It comes when the sky forgets the sun.",
    lore: "A fearsome horned behemoth that consumes solar flares. It rises during personal trials to eclipse all obstacles, granting you raw physical resilience, relentless momentum, and warrior drive.",
    affinity: "Solar Eclipse & Cosmic Flame",
    power: "Berserker Drive & Fear Domination"
  },
  9: {
    month: "September",
    name: "Void Weaver",
    quote: "It weaves nightmares into reality.",
    lore: "A multi-dimensional celestial sorceress surrounded by cosmic silk. It allows you to organize chaotic ideas into grand architectural tapestries, turning visionary concepts into tangible reality.",
    affinity: "Quantum Void & Cosmic String",
    power: "Master Architectural Synthesis & Foresight"
  },
  10: {
    month: "October",
    name: "Harvester",
    quote: "It collects souls when fear is ripe.",
    lore: "A crowned reaper wielding the scythe of harvest. It represents the inevitable culmination of long efforts, helping you ruthlessly eliminate toxic distractions and claim your deserved rewards.",
    affinity: "Harvest Moon & Temporal Scythe",
    power: "Karmic Execution & Maximum Yield"
  },
  11: {
    month: "November",
    name: "Grave Watcher",
    quote: "It guards the dead and marks the cursed.",
    lore: "A plague-doctor sentinel holding a raven lantern. It guides you safely through dark personal phases, shielding your secrets and revealing the hidden motives of those around you.",
    affinity: "Crypt Gate & Occult Luminescence",
    power: "Psychic Shield & Truth Discernment"
  },
  12: {
    month: "December",
    name: "Winter King",
    quote: "He brings the end so the cycle begins.",
    lore: "A towering horned sovereign clothed in blizzard fur. He represents eternal cycle completion, ruling over beginnings and endings with ancient, unwavering authority.",
    affinity: "Eternal Frost & Solstice Crown",
    power: "Generational Authority & Cycle Mastery"
  }
};

// ---------------------------------------------------------------------------
// 2. TATTOOS DATABASE (Days 1 to 31)
// ---------------------------------------------------------------------------
const TATTOOS_DB = {
  1: { name: "1. New Beginning", quote: "New paths. New you.", meaning: "The Sacred Sword of Initiation: Cut through past hesitations and forge bold new frontiers.", mantra: "I embrace new horizons.", chakra: "Third Eye & Solar Plexus" },
  2: { name: "2. Inner Strength", quote: "Power within.", meaning: "The Sovereign Lion Triangle: An unshakable reservoir of internal courage and dignity.", mantra: "My quiet strength rules all.", chakra: "Heart & Solar Plexus" },
  3: { name: "3. Focus", quote: "Clear mind. Sharp soul.", meaning: "The Eye of the North Compass: Laser-like cognitive precision and unshakeable attention.", mantra: "My focus creates reality.", chakra: "Crown & Third Eye" },
  4: { name: "4. Protection", quote: "Shielded in silence.", meaning: "The Aegis Shield and Laurel: Impenetrable boundaries against negative energies.", mantra: "I am protected and sovereign.", chakra: "Root & Heart" },
  5: { name: "5. Courage", quote: "Fear bows. I rise.", meaning: "The Lunar Wolf Pack Totem: Instinctive fearlessness in uncharted wilderness.", mantra: "I rise above every shadow.", chakra: "Throat & Solar Plexus" },
  6: { name: "6. Discipline", quote: "Control today, freedom tomorrow.", meaning: "The Spartan Helm & Spear: Self-mastery that translates daily habits into greatness.", mantra: "Discipline is my supreme freedom.", chakra: "Root & Third Eye" },
  7: { name: "7. Wisdom", quote: "See more. Know more.", meaning: "The Owl of Nocturnal Sight: Profound comprehension of hidden truths and esoteric science.", mantra: "I see beneath the surface.", chakra: "Crown Chakra" },
  8: { name: "8. Transformation", quote: "I burn. I rise. I become.", meaning: "The Solar Phoenix Rebirth: Complete reinvention through life's trials.", mantra: "From every ash, I rise stronger.", chakra: "Sacral & Solar Plexus" },
  9: { name: "9. Faith", quote: "Trust the unseen.", meaning: "The Celestial Hands of Devotion: Deep alignment with cosmic synchronicity and grace.", mantra: "I trust the divine timing.", chakra: "Heart & Crown" },
  10: { name: "10. Balance", quote: "Light and dark. One within.", meaning: "The Radiant Yin-Yang Mandala: Integrating logic and emotion into complete harmony.", mantra: "I am balanced and centered.", chakra: "Heart Chakra" },
  11: { name: "11. Resilience", quote: "Unbreakable. Unshakable.", meaning: "The Cosmic Yggdrasil Tree: Deep roots that weather every hurricane.", mantra: "I bend, but I never break.", chakra: "Root Chakra" },
  12: { name: "12. Intuition", quote: "I listen. I know.", meaning: "The Goddess of the Crescent Moon: Direct channel to subconscious knowing and telepathy.", mantra: "My inner voice knows the truth.", chakra: "Third Eye" },
  13: { name: "13. Harmony", quote: "Aligned soul, peaceful heart.", meaning: "The Sacred Lotus of Geometry: Peaceful resonance that calms turbulent environments.", mantra: "I emit serenity and peace.", chakra: "Heart Chakra" },
  14: { name: "14. Ambition", quote: "Dream. Plan. Conquer.", meaning: "The Crowned Royal Lion: Relentless drive to build an empire of excellence.", mantra: "My ambition knows no ceiling.", chakra: "Solar Plexus" },
  15: { name: "15. Letting Go", quote: "Release. Reset. Rise.", meaning: "The Transmuted Skull of Rebirth: Shedding obsolete attachments into freedom.", mantra: "I release what no longer serves.", chakra: "Crown & Throat" },
  16: { name: "16. Gratitude", quote: "Grateful heart, magnetic life.", meaning: "The Vortex Sun of Abundance: Magnetizing prosperity through pure appreciation.", mantra: "My gratitude multiplies wealth.", chakra: "Heart Chakra" },
  17: { name: "17. Patience", quote: "Good things take time.", meaning: "The Cosmic Chrono Hourglass: Harmonizing with the compounding power of time.", mantra: "I master the rhythm of time.", chakra: "Third Eye" },
  18: { name: "18. Loyalty", quote: "Till the end. Through all.", meaning: "The Wolf Brotherhood Sigil: Fierce devotion to those who walk beside you.", mantra: "My loyalty is sacred and true.", chakra: "Heart & Root" },
  19: { name: "19. Clarity", quote: "Clear today. Better tomorrow.", meaning: "The Quartz Crystal Obelisk: Total mental lucidity and sharp decision making.", mantra: "My path is crystal clear.", chakra: "Crown Chakra" },
  20: { name: "20. Self Love", quote: "You first. Always.", meaning: "The Anatomical Heart of Blooms: Unconditional self-worth as the fountain of creation.", mantra: "I honor and cherish myself.", chakra: "Heart Chakra" },
  21: { name: "21. Determination", quote: "Decide. Commit. Succeed.", meaning: "The Crowned Chained Fist of Will: Breaking every shackle to achieve your goal.", mantra: "I commit until victory.", chakra: "Solar Plexus" },
  22: { name: "22. Adventure", quote: "Explore. Learn. Grow.", meaning: "The Alpine Mountain Horizon: Boundless curiosity to conquer new physical and mental heights.", mantra: "Life is a glorious quest.", chakra: "Sacral & Throat" },
  23: { name: "23. Creativity", quote: "Imagine. Create. Inspire.", meaning: "The Celestial Wave & Crescent Swirl: Channeling original inspiration into art.", mantra: "I am a conduit of creation.", chakra: "Sacral Chakra" },
  24: { name: "24. Leadership", quote: "Lead with vision. Inspire with heart.", meaning: "The Sovereign Compass Crown: Leading teams through moral authority and courage.", mantra: "I inspire and guide with honor.", chakra: "Third Eye & Heart" },
  25: { name: "25. Healing", quote: "Healing is becoming.", meaning: "The Winged Caduceus of Hermes: Restoring balance to body, mind, and spirit.", mantra: "I restore wholeness within.", chakra: "Throat & Heart" },
  26: { name: "26. Confidence", quote: "I am enough. I am ready.", meaning: "The Sun-Moon Eclipse Seal: Total self-assurance without need for external validation.", mantra: "I am complete and ready.", chakra: "Solar Plexus" },
  27: { name: "27. Purpose", quote: "Find it. Live it. Be it.", meaning: "The Labyrinth Target: Aligning daily actions with your grand soul mission.", mantra: "I walk my destined purpose.", chakra: "Crown & Root" },
  28: { name: "28. Rebirth", quote: "Endings are new beginnings.", meaning: "The Crystal Butterfly: Metamorphosis from struggle into radiant elegance.", mantra: "I emerge transformed.", chakra: "Sacral & Crown" },
  29: { name: "29. Courage to Change", quote: "Change is growth. Embrace it.", meaning: "The Half-Floral Wing: Embracing evolutionary shifts as invitations to flourish.", mantra: "I welcome transformative growth.", chakra: "Throat Chakra" },
  30: { name: "30. Legacy", quote: "What you build outlives you.", meaning: "The Eternal Tree of Generations: Building systems and knowledge that outlast time.", mantra: "I create enduring value.", chakra: "Root & Crown" },
  31: { name: "31. Victory", quote: "All efforts. All earned. All yours.", meaning: "The Winged Laurel Sword of Triumph: The triumphant realization of all your dreams.", mantra: "Victory is my natural state.", chakra: "Solar Plexus & Crown" }
};

// ---------------------------------------------------------------------------
// 3. VEDIC KUNDLI (LAGNA & PLANETARY ENGINE)
// ---------------------------------------------------------------------------
const RASHI_NAMES = [
  "Aries (Mesha) ♈", "Taurus (Vrishabha) ♉", "Gemini (Mithuna) ♊",
  "Cancer (Karka) ♋", "Leo (Simha) ♌", "Virgo (Kanya) ♍",
  "Libra (Tula) ♎", "Scorpio (Vrischika) ♏", "Sagittarius (Dhanu) ♐",
  "Capricorn (Makara) ♑", "Aquarius (Kumbha) ♒", "Pisces (Meena) ♓"
];

const RASHI_LORDS = [
  "Mars (Mangal)", "Venus (Shukra)", "Mercury (Budha)",
  "Moon (Chandra)", "Sun (Surya)", "Mercury (Budha)",
  "Venus (Shukra)", "Mars (Mangal)", "Jupiter (Guru)",
  "Saturn (Shani)", "Saturn (Shani)", "Jupiter (Guru)"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const PLANETS = [
  { code: "Su", name: "Sun (Surya)", baseHouse: 5, significance: "Soul vitality, authority, father & leadership" },
  { code: "Mo", name: "Moon (Chandra)", baseHouse: 4, significance: "Mind, emotions, mother & public popularity" },
  { code: "Ma", name: "Mars (Mangal)", baseHouse: 1, significance: "Courage, physical drive, passion & real estate" },
  { code: "Me", name: "Mercury (Budha)", baseHouse: 3, significance: "Intellect, business acumen, communication & logic" },
  { code: "Ju", name: "Jupiter (Guru)", baseHouse: 9, significance: "Wisdom, expansion, wealth, dharma & fortune" },
  { code: "Ve", name: "Venus (Shukra)", baseHouse: 7, significance: "Love, luxury, artistic creativity & relationships" },
  { code: "Sa", name: "Saturn (Shani)", baseHouse: 10, significance: "Discipline, karma, perseverance & enduring legacy" },
  { code: "Ra", name: "Rahu (North Node)", baseHouse: 11, significance: "Ambition, explosive growth & worldly desires" },
  { code: "Ke", name: "Ketu (South Node)", baseHouse: 12, significance: "Spiritual liberation, detachment & deep intuition" }
];

function calculateKundli(dobStr, tobStr) {
  const [year, month, day] = dobStr.split('-').map(Number);
  const [hour, minute] = (tobStr || "12:00").split(':').map(Number);

  const dayOfYear = Math.floor((month - 1) * 30.5 + day);
  const sunSignIdx = Math.floor(((dayOfYear + 285) % 365) / 30.4) % 12;
  const timeProgress = (hour + minute / 60) / 2;
  const lagnaIdx = Math.floor((sunSignIdx + timeProgress) % 12);

  const moonSignIdx = (dayOfYear + 7) % 12;
  const nakshatraIdx = (dayOfYear * 3 + day) % 27;

  const housePlacements = {};
  for (let h = 1; h <= 12; h++) {
    housePlacements[h] = {
      houseNum: h,
      rashiNum: ((lagnaIdx + h - 1) % 12) + 1,
      rashiName: RASHI_NAMES[(lagnaIdx + h - 1) % 12],
      planets: []
    };
  }

  PLANETS.forEach((planet, idx) => {
    const assignedHouse = ((planet.baseHouse + lagnaIdx + (day % 4) + idx) % 12) + 1;
    housePlacements[assignedHouse].planets.push(planet);
  });

  return {
    lagna: RASHI_NAMES[lagnaIdx],
    lagnaLord: RASHI_LORDS[lagnaIdx],
    lagnaIdx,
    moonSign: RASHI_NAMES[moonSignIdx],
    nakshatra: `${NAKSHATRAS[nakshatraIdx]} (Pada ${(day % 4) + 1})`,
    sunSign: RASHI_NAMES[sunSignIdx],
    mahadasha: `${PLANETS[(year + month) % 9].name} Dasha (Active)`,
    housePlacements
  };
}

// ---------------------------------------------------------------------------
// 4. DESTINY LOCATION, MATERIAL & APEX ENGINE (NEW)
// ---------------------------------------------------------------------------
function calculateDestinyLocationAndMaterial(user, kundliData) {
  const [year, month, day] = user.dob.split('-').map(Number);
  const [hour] = (user.tob || "12:00").split(':').map(Number);
  const nameLen = user.name.length;

  // Directions in Vedic Astro-Cartography (Dig Bala)
  const directions = [
    { dir: "North-East (Ishanya Zenith)", landscape: "Coastal High-Tech Metropolises & Intellectual Capitals", desc: "The direction of cosmic expansion (Guru/Jupiter). Moving or expanding your network towards North-East activates unprecedented mentors and intellectual breakthroughs." },
    { dir: "North (Kubera Treasury Axis)", landscape: "Commercial Megacities, Financial Districts & Valley Hubs", desc: "The domain of Mercury and wealth-preserver Kubera. Northern directions trigger massive commercial liquid flow and business authority." },
    { dir: "East (Indra Royal Dawn)", landscape: "Pioneering Frontier Cities & Sunlit Capital Hubs", desc: "The solar direction of executive power. Eastward endeavors ignite rapid promotions, executive leadership, and sovereign autonomy." },
    { dir: "South-East (Agni Creation Grid)", landscape: "Dynamic Industrial Clusters, Energy & Media Centers", desc: "The realm of Venus and Fire. Sparks monumental creative output, viral public engagement, and luxury enterprise creation." },
    { dir: "West (Varuna Oceanic Horizon)", landscape: "International Port Metropolises & Global Trade Gateways", desc: "The domain of Saturn and cosmic tides. Western expansions yield massive international trade leverage and foreign audience recognition." },
    { dir: "North-West (Vayu Wind Velocity)", landscape: "High-Speed Aviation Corridors & Rapid Exchange Hubs", desc: "The Moon's dynamic wind channel. Promotes swift expansion across multiple territories and rapid scaling of operations." }
  ];

  const dirIdx = (kundliData.lagnaIdx + month + (hour % 6)) % directions.length;
  const chosenDir = directions[dirIdx];

  // Material Mediums
  const materials = [
    { medium: "Scalable AI Software, Digital IP & Autonomous Systems", metal: "24K Gold & Pure Titanium", force: "Electric Ether & Solar Fire (Akasha-Agni)", desc: "Your wealth compounds exponentially when you channel intelligence into code, automated architecture, and digital intellectual assets." },
    { medium: "Prime Spatial Infrastructure, Real Estate & Strategic Land", metal: "Refined Copper & Rose Gold", force: "Crystalline Earth & Deep Gravity (Prithvi)", desc: "Tangible physical assets, prime land acquisition, and spatial architecture anchor your generational wealth and community influence." },
    { medium: "Global Financial Markets, Venture Capital & Asset Systems", metal: "Sterling Silver & Platinum", force: "Liquid Water & Kinetic Trade (Jala-Vayu)", desc: "High-frequency trade, multi-asset portfolios, and strategic equity investments generate boundless financial sovereignty for you." },
    { medium: "Creative Media Franchises, Cultural IP & Cinematic Arts", metal: "Electrum & Obsidian", force: "Magnetic Radiance & Astral Light", desc: "Cultural storytelling, media production, and unique personal branding magnetize immense global recognition and lucrative royal returns." }
  ];

  const matIdx = (day + nameLen + kundliData.lagnaIdx) % materials.length;
  const chosenMat = materials[matIdx];

  // Foreign vs Homeland Sovereignty
  const foreignSojourn = ((kundliData.lagnaIdx + day) % 2 === 0)
    ? "Global / Distant Land Sovereign Manifestation (Peak fortunes activate across foreign borders or digital global reach)"
    : "Homeland Sovereign Pillar (Peak fortunes deeply rooted in domestic expansion, commanding regional authority)";

  // Peak Destiny Age Window
  const basePeakAge = 26 + ((day + month) % 9);
  const peakAgeStr = `Ages ${basePeakAge} - ${basePeakAge + 7} (Solar Ascendance & Apex Manifestation Window)`;

  return {
    direction: chosenDir.dir,
    landscape: chosenDir.landscape,
    geoDesc: chosenDir.desc,
    sojourn: foreignSojourn,
    materialMedium: chosenMat.medium,
    powerMetal: chosenMat.metal,
    elementalForce: chosenMat.force,
    materialDesc: chosenMat.desc,
    peakAge: peakAgeStr,
    soulMandate: "The Sovereign Catalyst: Convert complex chaos into enduring order, achieving absolute sovereignty while uplifting your entire network."
  };
}

// ---------------------------------------------------------------------------
// 5. SVG KUNDLI DIAMOND CHART DRAWING
// ---------------------------------------------------------------------------
function renderKundliSvg(kundliData) {
  const group = document.getElementById('kundliHousesGroup');
  if (!group) return;

  const houseCoordinates = {
    1:  { rX: 200, rY: 130, pX: 200, pY: 155 },
    2:  { rX: 120, rY: 60,  pX: 120, pY: 85 },
    3:  { rX: 60,  rY: 120, pX: 60,  pY: 145 },
    4:  { rX: 130, rY: 200, pX: 130, pY: 225 },
    5:  { rX: 60,  rY: 280, pX: 60,  pY: 305 },
    6:  { rX: 120, rY: 340, pX: 120, pY: 365 },
    7:  { rX: 200, rY: 270, pX: 200, pY: 295 },
    8:  { rX: 280, rY: 340, pX: 280, pY: 365 },
    9:  { rX: 340, rY: 280, pX: 340, pY: 305 },
    10: { rX: 270, rY: 200, pX: 270, pY: 225 },
    11: { rX: 340, rY: 120, pX: 340, pY: 145 },
    12: { rX: 280, rY: 60,  pX: 280, pY: 85 }
  };

  let elementsHtml = '';

  for (let h = 1; h <= 12; h++) {
    const hData = kundliData.housePlacements[h];
    const coords = houseCoordinates[h];
    const planetSymbols = hData.planets.map(p => p.code).join(' ');

    elementsHtml += `
      <text x="${coords.rX}" y="${coords.rY}" text-anchor="middle" class="house-num-text">${hData.rashiNum}</text>
    `;

    if (planetSymbols) {
      elementsHtml += `
        <text x="${coords.pX}" y="${coords.pY}" text-anchor="middle" class="planet-symbol-text">${planetSymbols}</text>
      `;
    }
  }

  group.innerHTML = elementsHtml;
}

// ---------------------------------------------------------------------------
// 6. LIFE HISTORY TIMELINE GENERATOR
// ---------------------------------------------------------------------------
function generateLifeHistory(age, kundliData) {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;

  return [
    {
      phase: "Phase 1: Karmic Foundations & Early Childhood (Ages 0 - 14)",
      years: `${birthYear} - ${birthYear + 14}`,
      title: "The Genesis of Sovereign Character",
      desc: `Influenced heavily by your 4th house of emotional roots and ${kundliData.moonSign}, this period established your foundational emotional resilience. Early curiosity and distinct individuality set you apart from peers, navigating initial family transitions that forged your independent spirit.`,
      active: age <= 14
    },
    {
      phase: "Phase 2: The Fire of Awakening & Discovery (Ages 15 - 28)",
      years: `${birthYear + 15} - ${birthYear + 28}`,
      title: "Identity Formation & Skill Mastery",
      desc: `Your 1st house of self-identity and 3rd house of courage activated. You broke through initial self-doubt, discovered key technical/creative passions, formed critical alliances, and laid the cornerstone for your independent life mastery.`,
      active: age > 14 && age <= 28
    },
    {
      phase: "Phase 3: Prime Manifestation & Empire Building (Ages 29 - 45)",
      years: `${birthYear + 29} - ${birthYear + 45}`,
      title: "Authority, Wealth & Impact",
      desc: `The 10th house of career (Karma Bhava) and 11th house of exponential gains (Labha Bhava) take supreme command. Decisive strategic execution multiplies your wealth and leadership influence, establishing undeniable authority in your domain.`,
      active: age > 28 && age <= 45
    },
    {
      phase: "Phase 4: Golden Legacy & Sovereign Transcendence (Ages 46+)",
      years: `${birthYear + 46}+`,
      title: "Mastery, Mentorship & Karmic Harvest",
      desc: `The 9th house of Dharma and 12th house of Moksha harmonize. A phase of profound contentment, where your accumulated wisdom elevates the next generation, enjoying the fruits of your lifelong creations.`,
      active: age > 45
    }
  ];
}

// ---------------------------------------------------------------------------
// 7. UI CONTROLLER & EVENT LISTENERS
// ---------------------------------------------------------------------------
let livePulseInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  const astrologyForm = document.getElementById('astrologyForm');
  const onboardingSection = document.getElementById('onboardingSection');
  const resultsContainer = document.getElementById('resultsContainer');
  const topNavMenu = document.getElementById('topNavMenu');
  const navResetBtn = document.getElementById('navResetBtn');

  // Form Submit Handler
  astrologyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim() || 'Cosmic Traveler';
    const dob = document.getElementById('userDob').value;
    const tob = document.getElementById('userTob').value || '12:00';
    const pob = document.getElementById('userPob').value.trim() || 'Global Coordinates';

    if (!dob) {
      alert('Please select your Date of Birth.');
      return;
    }

    renderFullOracleResults({ name, dob, tob, pob });
  });

  // Reset / New Reading Handler
  navResetBtn.addEventListener('click', () => {
    if (livePulseInterval) clearInterval(livePulseInterval);
    resultsContainer.classList.add('hidden');
    topNavMenu.classList.add('hidden');
    onboardingSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Tab Navigation Handling
  const navBtns = document.querySelectorAll('.nav-link-btn, .tab-pill');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      // Update active states
      document.querySelectorAll('.nav-link-btn, .tab-pill').forEach(b => {
        if (b.dataset.target === targetId) b.classList.add('active');
        else b.classList.remove('active');
      });

      // Show target panel
      document.querySelectorAll('.content-panel').forEach(panel => {
        if (panel.id === targetId) panel.classList.remove('hidden');
        else panel.classList.add('hidden');
      });

      // Smooth scroll to top of panel
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ================= MAIN RESULTS RENDERER =================
  function renderFullOracleResults(user) {
    const [birthY, birthM, birthD] = user.dob.split('-').map(Number);
    const birthDate = new Date(birthY, birthM - 1, birthD);
    const today = new Date();

    // 1. Exact Age & Chronometry
    let age = today.getFullYear() - birthY;
    const mDiff = today.getMonth() - (birthM - 1);
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthD)) {
      age--;
    }

    const diffDays = Math.floor(Math.abs(today - birthDate) / (1000 * 60 * 60 * 24));
    
    let nextBday = new Date(today.getFullYear(), birthM - 1, birthD);
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday - today) / (1000 * 60 * 60 * 24));

    // 2. Fetch Kundli Data
    const kundliData = calculateKundli(user.dob, user.tob);

    // 3. Fetch Destiny Location & Material Engine
    const destinyLoc = calculateDestinyLocationAndMaterial(user, kundliData);

    // 4. Fetch Month Monster & Birth Date Tattoo
    const monster = MONSTERS_DB[birthM] || MONSTERS_DB[1];
    const tattoo = TATTOOS_DB[birthD] || TATTOOS_DB[1];

    // 5. Populate Subject Overview
    document.getElementById('userInitial').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('displayUserName').textContent = user.name;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('displayBirthMeta').textContent = `Born ${monthNames[birthM - 1]} ${birthD}, ${birthY} • ${user.tob} • ${user.pob}`;
    document.getElementById('userLagnaTag').textContent = `Lagna: ${kundliData.lagna.split(' ')[0]}`;
    document.getElementById('userRashiTag').textContent = `Rashi: ${kundliData.moonSign.split(' ')[0]}`;
    document.getElementById('userNakshatraTag').textContent = `Nakshatra: ${kundliData.nakshatra.split(' ')[0]}`;

    document.getElementById('qsAge').textContent = `${age} Years`;
    document.getElementById('qsDays').textContent = diffDays.toLocaleString();
    document.getElementById('qsNextBday').textContent = `In ${daysToNextBday} Days`;

    // 6. Populate "Where is Your Destiny" Section
    document.getElementById('destinyTob').textContent = user.tob;
    document.getElementById('destinyPob').textContent = user.pob;
    document.getElementById('destinyDirection').textContent = destinyLoc.direction;
    document.getElementById('destinyLandscape').textContent = destinyLoc.landscape;
    document.getElementById('destinySojourn').textContent = destinyLoc.sojourn;
    document.getElementById('destinyGeoDesc').textContent = destinyLoc.geoDesc;
    document.getElementById('destinyMaterialMedium').textContent = destinyLoc.materialMedium;
    document.getElementById('destinyPowerMetal').textContent = destinyLoc.powerMetal;
    document.getElementById('destinyElementalForce').textContent = destinyLoc.elementalForce;
    document.getElementById('destinyMaterialDesc').textContent = destinyLoc.materialDesc;
    document.getElementById('destinyPeakAge').textContent = destinyLoc.peakAge;
    document.getElementById('destinySoulMandate').textContent = destinyLoc.soulMandate;

    // 7. Populate Kundli Section
    document.getElementById('kundliTimeVal').textContent = user.tob;
    document.getElementById('kundliPlaceVal').textContent = user.pob;
    document.getElementById('chartAscendantText').textContent = `Ascendant: ${kundliData.lagna}`;
    document.getElementById('kLagna').textContent = kundliData.lagna;
    document.getElementById('kLagnaLord').textContent = kundliData.lagnaLord;
    document.getElementById('kMoonSign').textContent = kundliData.moonSign;
    document.getElementById('kNakshatra').textContent = kundliData.nakshatra;
    document.getElementById('kSunSign').textContent = kundliData.sunSign;
    document.getElementById('kMahadasha').textContent = kundliData.mahadasha;

    renderKundliSvg(kundliData);

    // Populate Planets Table
    const tbody = document.getElementById('planetsTableBody');
    let rowsHtml = '';
    for (let h = 1; h <= 12; h++) {
      const hData = kundliData.housePlacements[h];
      if (hData.planets.length > 0) {
        hData.planets.forEach(p => {
          rowsHtml += `
            <tr>
              <td style="font-weight:700; color:#fff;">${p.name}</td>
              <td style="color:var(--color-gold); font-weight:600;">House ${h} (Bhava ${h})</td>
              <td style="color:var(--color-cyan);">${hData.rashiName}</td>
              <td>${p.significance}</td>
            </tr>
          `;
        });
      }
    }
    tbody.innerHTML = rowsHtml;

    // 8. Populate Month Monster & Tattoo Section
    const monsterImg = document.getElementById('monthMonsterImage');
    monsterImg.src = `assets/monsters/month_${birthM}.jpg`;
    document.getElementById('monsterMonthBadge').textContent = `${monster.month} Shadow Guardian`;
    document.getElementById('monsterName').textContent = monster.name;
    document.getElementById('monsterQuote').textContent = `"${monster.quote}"`;
    document.getElementById('monsterLore').textContent = monster.lore;
    document.getElementById('monsterAffinity').textContent = monster.affinity;
    document.getElementById('monsterPower').textContent = monster.power;

    const tattooImg = document.getElementById('dateTattooImage');
    tattooImg.src = `assets/tattoos/day_${birthD}.jpg`;
    document.getElementById('tattooDateBadge').textContent = `Day ${birthD} Sacred Symbol`;
    document.getElementById('tattooName').textContent = tattoo.name;
    document.getElementById('tattooMantra').textContent = `"${tattoo.quote}"`;
    document.getElementById('tattooMeaning').textContent = tattoo.meaning;
    document.getElementById('tattooAffirmation').textContent = tattoo.mantra;
    document.getElementById('tattooChakra').textContent = tattoo.chakra;

    // 9. Populate Life History Timeline
    const timelineData = generateLifeHistory(age, kundliData);
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = timelineData.map(t => `
      <div class="timeline-node ${t.active ? 'active' : ''}">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <span class="timeline-phase-tag">${t.phase} • ${t.years}</span>
          <h4>${t.title}</h4>
          <p>${t.desc}</p>
        </div>
      </div>
    `).join('');

    // 10. Live Heartbeats Pulse
    if (livePulseInterval) clearInterval(livePulseInterval);
    let extraSeconds = 0;
    function updatePulse() {
      extraSeconds++;
      const currentDays = diffDays + (extraSeconds / 86400);
      const totalHeartbeats = Math.floor(currentDays * 24 * 60 * 75);
      document.getElementById('qsHeartbeats').textContent = totalHeartbeats.toLocaleString();
    }
    updatePulse();
    livePulseInterval = setInterval(updatePulse, 1000);

    // Switch View & activate Where is My Destiny as default active panel
    onboardingSection.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    topNavMenu.classList.remove('hidden');

    document.querySelectorAll('.nav-link-btn, .tab-pill').forEach(b => {
      if (b.dataset.target === 'sectionDestinyLoc') b.classList.add('active');
      else b.classList.remove('active');
    });
    document.querySelectorAll('.content-panel').forEach(p => {
      if (p.id === 'sectionDestinyLoc') p.classList.remove('hidden');
      else p.classList.add('hidden');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
