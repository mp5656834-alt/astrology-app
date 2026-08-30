/**
 * ============================================================================
 *  PROPHECY — Professional Astrology & Numerology Platform
 *  Deterministic Astronomical Calculation Engine (NO FALLBACK FABRICATION)
 * ============================================================================
 *
 *  Architecture:
 *  ├── BirthProfile          → canonical single source of truth
 *  ├── AstroCalcService      → ephemeris (Sun, Moon, planets, Asc, houses)
 *  ├── WesternAstrology      → Tropical zodiac + interpretations
 *  ├── VedicAstrology        → Sidereal (Lahiri ayanamsa) + Nakshatra/Pada/Dasha
 *  ├── NumerologyService     → Life Path, Destiny, Soul Urge, Birthday, PY
 *  ├── CompatibilityEngine   → Kundali Milan (8 Kootas) + Marriage matching
 *  ├── PeriodEngine          → Peak periods, Challenge periods, Dasha timeline
 *  ├── Interpretations       → Rule-based deterministic interpretation library
 *  ├── I18NService           → English / Hindi (global state)
 *  └── AppController         → UI rendering, navigation, caching, localStorage
 * ============================================================================
 */

/* ========================================================================== */
/*                           GLOBAL CONSTANTS & DATA                          */
/* ========================================================================== */

const TROPICAL_SIGNS = [
  { en: 'Aries', hi: 'मेष', symbol: '♈', element: 'Fire', quality: 'Cardinal' },
  { en: 'Taurus', hi: 'वृषभ', symbol: '♉', element: 'Earth', quality: 'Fixed' },
  { en: 'Gemini', hi: 'मिथुन', symbol: '♊', element: 'Air', quality: 'Mutable' },
  { en: 'Cancer', hi: 'कर्क', symbol: '♋', element: 'Water', quality: 'Cardinal' },
  { en: 'Leo', hi: 'सिंह', symbol: '♌', element: 'Fire', quality: 'Fixed' },
  { en: 'Virgo', hi: 'कन्या', symbol: '♍', element: 'Earth', quality: 'Mutable' },
  { en: 'Libra', hi: 'तुला', symbol: '♎', element: 'Air', quality: 'Cardinal' },
  { en: 'Scorpio', hi: 'वृश्चिक', symbol: '♏', element: 'Water', quality: 'Fixed' },
  { en: 'Sagittarius', hi: 'धनु', symbol: '♐', element: 'Fire', quality: 'Mutable' },
  { en: 'Capricorn', hi: 'मकर', symbol: '♑', element: 'Earth', quality: 'Cardinal' },
  { en: 'Aquarius', hi: 'कुंभ', symbol: '♒', element: 'Air', quality: 'Fixed' },
  { en: 'Pisces', hi: 'मीन', symbol: '♓', element: 'Water', quality: 'Mutable' }
];

const VEDIC_RASHI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

const NAKSHATRAS = [
  { en: 'Ashwini', hi: 'अश्विनी', lord: 'Ketu', range: [0, 13.333], symbol: '🐎', gana: 'Deva', animal: 'Horse' },
  { en: 'Bharani', hi: 'भरणी', lord: 'Venus', range: [13.333, 26.666], symbol: '🩸', gana: 'Manushya', animal: 'Elephant' },
  { en: 'Krittika', hi: 'कृत्तिका', lord: 'Sun', range: [26.666, 40], symbol: '🔪', gana: 'Rakshasa', animal: 'Sheep' },
  { en: 'Rohini', hi: 'रोहिणी', lord: 'Moon', range: [40, 53.333], symbol: '🌙', gana: 'Manushya', animal: 'Snake' },
  { en: 'Mrigashira', hi: 'म्रृगशीर्ष', lord: 'Mars', range: [53.333, 66.666], symbol: '🦌', gana: 'Deva', animal: 'Snake' },
  { en: 'Ardra', hi: 'आर्द्रा', lord: 'Rahu', range: [66.666, 80], symbol: '💧', gana: 'Rakshasa', animal: 'Dog' },
  { en: 'Punarvasu', hi: 'पुनर्वसु', lord: 'Jupiter', range: [80, 93.333], symbol: '🏹', gana: 'Deva', animal: 'Cat' },
  { en: 'Pushya', hi: 'पुष्य', lord: 'Saturn', range: [93.333, 106.666], symbol: '🌸', gana: 'Deva', animal: 'Sheep' },
  { en: 'Ashlesha', hi: 'आश्लेषा', lord: 'Mercury', range: [106.666, 120], symbol: '🐍', gana: 'Rakshasa', animal: 'Cat' },
  { en: 'Magha', hi: 'मघा', lord: 'Ketu', range: [120, 133.333], symbol: '👑', gana: 'Rakshasa', animal: 'Rat' },
  { en: 'Purva Phalguni', hi: 'पूर्व फाल्गुनी', lord: 'Venus', range: [133.333, 146.666], symbol: '🛏️', gana: 'Manushya', animal: 'Rat' },
  { en: 'Uttara Phalguni', hi: 'उत्तर फाल्गुनी', lord: 'Sun', range: [146.666, 160], symbol: '🌳', gana: 'Manushya', animal: 'Cow' },
  { en: 'Hasta', hi: 'हस्त', lord: 'Moon', range: [160, 173.333], symbol: '✋', gana: 'Deva', animal: 'Buffalo' },
  { en: 'Chitra', hi: 'चित्रा', lord: 'Mars', range: [173.333, 186.666], symbol: '💎', gana: 'Rakshasa', animal: 'Tiger' },
  { en: 'Swati', hi: 'स्वाति', lord: 'Rahu', range: [186.666, 200], symbol: '🌬️', gana: 'Deva', animal: 'Cow' },
  { en: 'Vishakha', hi: 'विशाखा', lord: 'Jupiter', range: [200, 213.333], symbol: '🏛️', gana: 'Rakshasa', animal: 'Tiger' },
  { en: 'Anuradha', hi: 'अनुराधा', lord: 'Saturn', range: [213.333, 226.666], symbol: '🔆', gana: 'Deva', animal: 'Deer' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठा', lord: 'Mercury', range: [226.666, 240], symbol: '🌂', gana: 'Rakshasa', animal: 'Deer' },
  { en: 'Mula', hi: 'मूल', lord: 'Ketu', range: [240, 253.333], symbol: '🌿', gana: 'Rakshasa', animal: 'Dog' },
  { en: 'Purva Ashadha', hi: 'पूर्व आषाढ़', lord: 'Venus', range: [253.333, 266.666], symbol: '🌊', gana: 'Manushya', animal: 'Monkey' },
  { en: 'Uttara Ashadha', hi: 'उत्तर आषाढ़', lord: 'Sun', range: [266.666, 280], symbol: '⚔️', gana: 'Manushya', animal: 'Mongoose' },
  { en: 'Shravana', hi: 'श्रवण', lord: 'Moon', range: [280, 293.333], symbol: '👂', gana: 'Deva', animal: 'Monkey' },
  { en: 'Dhanishta', hi: 'धनिष्ठा', lord: 'Mars', range: [293.333, 306.666], symbol: '🥁', gana: 'Rakshasa', animal: 'Lion' },
  { en: 'Shatabhisha', hi: 'शतभिषा', lord: 'Rahu', range: [306.666, 320], symbol: '💊', gana: 'Rakshasa', animal: 'Horse' },
  { en: 'Purva Bhadrapada', hi: 'पूर्व भाद्रपद', lord: 'Jupiter', range: [320, 333.333], symbol: '🔱', gana: 'Manushya', animal: 'Lion' },
  { en: 'Uttara Bhadrapada', hi: 'उत्तर भाद्रपद', lord: 'Saturn', range: [333.333, 346.666], symbol: '🐍', gana: 'Deva', animal: 'Cow' },
  { en: 'Revati', hi: 'रेवती', lord: 'Mercury', range: [346.666, 360], symbol: '🐟', gana: 'Deva', animal: 'Elephant' }
];

const VIMSHOTTARI_DASHA_LORDS = [
  { planet: 'Ketu', years: 7, nakshatras: [0, 9, 18] },
  { planet: 'Venus', years: 20, nakshatras: [1, 10, 19] },
  { planet: 'Sun', years: 6, nakshatras: [2, 11, 20] },
  { planet: 'Moon', years: 10, nakshatras: [3, 12, 21] },
  { planet: 'Mars', years: 7, nakshatras: [4, 13, 22] },
  { planet: 'Rahu', years: 18, nakshatras: [5, 14, 23] },
  { planet: 'Jupiter', years: 16, nakshatras: [6, 15, 24] },
  { planet: 'Saturn', years: 19, nakshatras: [7, 16, 25] },
  { planet: 'Mercury', years: 17, nakshatras: [8, 17, 26] }
];

const MONSTERS_DB = {
  1: { month: 'January', name: 'Frost Wraith', quote: "Born from winter's silence, it feeds on warmth.", lore: 'Forged in absolute zero, grants impervious calm during chaos.', affinity: 'Glacial Frost & Stillness', power: 'Cryo-Shield & Absolute Focus' },
  2: { month: 'February', name: 'Heartless', quote: 'It was once human, until love betrayed it.', lore: 'Shields your inner core, transmuting wounds into unbreakable resolve.', affinity: 'Obsidian Core & Karmic Steel', power: 'Emotional Fortress & Unyielding Will' },
  3: { month: 'March', name: 'Dusk Stalker', quote: 'It walks between light and dark, stealing hope.', lore: 'Teaches you to spot hidden deceits and strike with surgical precision.', affinity: 'Twilight Shadows & Dimensional Phase', power: 'Shadow Stealth & Intuitive Perception' },
  4: { month: 'April', name: 'Twilight Jester', quote: 'It brings laughter first, then your end.', lore: 'Breaks rigid conventions, bending reality through sharp wit.', affinity: 'Chaos Magic & Mercurial Spark', power: 'Reality Inversion & Strategic Subversion' },
  5: { month: 'May', name: 'Bloom Fiend', quote: 'It feasts on beauty and leaves decay.', lore: 'Absorbs ambient vitality, making your ambition flourish.', affinity: 'Dark Flora & Bio-Transmutation', power: 'Regeneration & Rapid Manifestation' },
  6: { month: 'June', name: 'Abyssal Serpent', quote: 'It lurks in the deep, waiting for the weak.', lore: 'Grants immense patience to dive into unexplored knowledge.', affinity: 'Tidal Pressure & Oceanic Dark', power: 'Deep Subconscious Sight & Strategic Depth' },
  7: { month: 'July', name: 'Cinder Lord', quote: 'He rules the ashes of what was once alive.', lore: 'Burns away self-doubt, forging royal authority and magnetism.', affinity: 'Solar Fire & Molten Magma', power: 'Charismatic Rebirth & Sovereign Command' },
  8: { month: 'August', name: 'Eclipse Beast', quote: 'It comes when the sky forgets the sun.', lore: 'Grants raw physical resilience and warrior drive.', affinity: 'Solar Eclipse & Cosmic Flame', power: 'Berserker Drive & Fear Domination' },
  9: { month: 'September', name: 'Void Weaver', quote: 'It weaves nightmares into reality.', lore: 'Organizes chaotic ideas into grand architectural tapestries.', affinity: 'Quantum Void & Cosmic String', power: 'Master Architectural Synthesis & Foresight' },
  10: { month: 'October', name: 'Harvester', quote: 'It collects souls when fear is ripe.', lore: 'Culminates long efforts into tangible, deserved rewards.', affinity: 'Harvest Moon & Temporal Scythe', power: 'Karmic Execution & Maximum Yield' },
  11: { month: 'November', name: 'Grave Watcher', quote: 'It guards the dead and marks the cursed.', lore: 'Shields secrets and reveals hidden motives of others.', affinity: 'Crypt Gate & Occult Luminescence', power: 'Psychic Shield & Truth Discernment' },
  12: { month: 'December', name: 'Winter King', quote: 'He brings the end so the cycle begins.', lore: 'Rules beginnings and endings with ancient authority.', affinity: 'Eternal Frost & Solstice Crown', power: 'Generational Authority & Cycle Mastery' }
};

const TATTOOS_DB = {
  1: { name: '1. New Beginning', quote: 'New paths. New you.', meaning: 'The Sacred Sword of Initiation: Cut through past hesitations.', mantra: 'I embrace new horizons.', chakra: 'Third Eye & Solar Plexus' },
  2: { name: '2. Inner Strength', quote: 'Power within.', meaning: 'The Sovereign Lion Triangle: Unshakable internal courage.', mantra: 'My quiet strength rules all.', chakra: 'Heart & Solar Plexus' },
  3: { name: '3. Focus', quote: 'Clear mind. Sharp soul.', meaning: 'Eye of the North Compass: Laser-like cognitive precision.', mantra: 'My focus creates reality.', chakra: 'Crown & Third Eye' },
  4: { name: '4. Protection', quote: 'Shielded in silence.', meaning: 'Aegis Shield: Impenetrable boundaries against negativity.', mantra: 'I am protected and sovereign.', chakra: 'Root & Heart' },
  5: { name: '5. Courage', quote: 'Fear bows. I rise.', meaning: 'Lunar Wolf Pack: Instinctive fearlessness.', mantra: 'I rise above every shadow.', chakra: 'Throat & Solar Plexus' },
  6: { name: '6. Discipline', quote: 'Control today, freedom tomorrow.', meaning: 'Spartan Helm & Spear: Self-mastery builds greatness.', mantra: 'Discipline is my supreme freedom.', chakra: 'Root & Third Eye' },
  7: { name: '7. Wisdom', quote: 'See more. Know more.', meaning: 'Owl of Nocturnal Sight: Profound hidden truth comprehension.', mantra: 'I see beneath the surface.', chakra: 'Crown Chakra' },
  8: { name: '8. Transformation', quote: 'I burn. I rise. I become.', meaning: 'Solar Phoenix: Complete reinvention through trials.', mantra: 'From every ash, I rise stronger.', chakra: 'Sacral & Solar Plexus' },
  9: { name: '9. Faith', quote: 'Trust the unseen.', meaning: 'Celestial Hands of Devotion: Cosmic synchronicity alignment.', mantra: 'I trust the divine timing.', chakra: 'Heart & Crown' },
  10: { name: '10. Balance', quote: 'Light and dark. One within.', meaning: 'Radiant Yin-Yang: Logic and emotion harmony.', mantra: 'I am balanced and centered.', chakra: 'Heart Chakra' },
  11: { name: '11. Resilience', quote: 'Unbreakable. Unshakable.', meaning: 'Cosmic Yggdrasil: Deep roots weather every hurricane.', mantra: 'I bend, but I never break.', chakra: 'Root Chakra' },
  12: { name: '12. Intuition', quote: 'I listen. I know.', meaning: 'Crescent Moon Goddess: Subconscious knowing channel.', mantra: 'My inner voice knows the truth.', chakra: 'Third Eye' },
  13: { name: '13. Harmony', quote: 'Aligned soul, peaceful heart.', meaning: 'Sacred Lotus: Peaceful resonance calms turbulence.', mantra: 'I emit serenity and peace.', chakra: 'Heart Chakra' },
  14: { name: '14. Ambition', quote: 'Dream. Plan. Conquer.', meaning: 'Crowned Royal Lion: Relentless empire-building drive.', mantra: 'My ambition knows no ceiling.', chakra: 'Solar Plexus' },
  15: { name: '15. Letting Go', quote: 'Release. Reset. Rise.', meaning: 'Transmuted Skull: Shedding obsolete attachments.', mantra: 'I release what no longer serves.', chakra: 'Crown & Throat' },
  16: { name: '16. Gratitude', quote: 'Grateful heart, magnetic life.', meaning: 'Vortex Sun of Abundance: Prosperity magnetism.', mantra: 'My gratitude multiplies wealth.', chakra: 'Heart Chakra' },
  17: { name: '17. Patience', quote: 'Good things take time.', meaning: 'Chrono Hourglass: Time compounding mastery.', mantra: 'I master the rhythm of time.', chakra: 'Third Eye' },
  18: { name: '18. Loyalty', quote: 'Till the end. Through all.', meaning: 'Wolf Brotherhood: Fierce devotion to your own.', mantra: 'My loyalty is sacred and true.', chakra: 'Heart & Root' },
  19: { name: '19. Clarity', quote: 'Clear today. Better tomorrow.', meaning: 'Quartz Obelisk: Mental lucidity, sharp decisions.', mantra: 'My path is crystal clear.', chakra: 'Crown Chakra' },
  20: { name: '20. Self Love', quote: 'You first. Always.', meaning: 'Anatomical Heart of Blooms: Unconditional self-worth.', mantra: 'I honor and cherish myself.', chakra: 'Heart Chakra' },
  21: { name: '21. Determination', quote: 'Decide. Commit. Succeed.', meaning: 'Crowned Chained Fist: Breaking every shackle.', mantra: 'I commit until victory.', chakra: 'Solar Plexus' },
  22: { name: '22. Adventure', quote: 'Explore. Learn. Grow.', meaning: 'Alpine Mountain Horizon: Unquenchable curiosity.', mantra: 'Life is a glorious quest.', chakra: 'Sacral & Throat' },
  23: { name: '23. Creativity', quote: 'Imagine. Create. Inspire.', meaning: 'Celestial Wave: Original inspiration channeling.', mantra: 'I am a conduit of creation.', chakra: 'Sacral Chakra' },
  24: { name: '24. Leadership', quote: 'Lead with vision. Inspire with heart.', meaning: 'Sovereign Compass Crown: Moral authority.', mantra: 'I inspire and guide with honor.', chakra: 'Third Eye & Heart' },
  25: { name: '25. Healing', quote: 'Healing is becoming.', meaning: 'Winged Caduceus: Body, mind, spirit restoration.', mantra: 'I restore wholeness within.', chakra: 'Throat & Heart' },
  26: { name: '26. Confidence', quote: 'I am enough. I am ready.', meaning: 'Sun-Moon Eclipse Seal: Self-assured autonomy.', mantra: 'I am complete and ready.', chakra: 'Solar Plexus' },
  27: { name: '27. Purpose', quote: 'Find it. Live it. Be it.', meaning: 'Labyrinth Target: Actions aligned with soul mission.', mantra: 'I walk my destined purpose.', chakra: 'Crown & Root' },
  28: { name: '28. Rebirth', quote: 'Endings are new beginnings.', meaning: 'Crystal Butterfly: Radiant transformation.', mantra: 'I emerge transformed.', chakra: 'Sacral & Crown' },
  29: { name: '29. Courage to Change', quote: 'Change is growth. Embrace it.', meaning: 'Half-Floral Wing: Evolution as flourishing.', mantra: 'I welcome transformative growth.', chakra: 'Throat Chakra' },
  30: { name: '30. Legacy', quote: 'What you build outlives you.', meaning: 'Eternal Tree: Generational systems & wisdom.', mantra: 'I create enduring value.', chakra: 'Root & Crown' },
  31: { name: '31. Victory', quote: 'All efforts. All earned. All yours.', meaning: 'Winged Laurel Sword: Triumphant dream realization.', mantra: 'Victory is my natural state.', chakra: 'Solar Plexus & Crown' }
};

const MAJOR_CITIES_GEO = {
  'mumbai': { lat: 19.076, lon: 72.8777, tz: 'Asia/Kolkata', country: 'India' },
  'delhi': { lat: 28.6139, lon: 77.209, tz: 'Asia/Kolkata', country: 'India' },
  'new delhi': { lat: 28.6139, lon: 77.209, tz: 'Asia/Kolkata', country: 'India' },
  'bangalore': { lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata', country: 'India' },
  'chennai': { lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata', country: 'India' },
  'kolkata': { lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata', country: 'India' },
  'hyderabad': { lat: 17.385, lon: 78.4867, tz: 'Asia/Kolkata', country: 'India' },
  'pune': { lat: 18.5204, lon: 73.8567, tz: 'Asia/Kolkata', country: 'India' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, tz: 'Asia/Kolkata', country: 'India' },
  'jaipur': { lat: 26.9124, lon: 75.7873, tz: 'Asia/Kolkata', country: 'India' },
  'lucknow': { lat: 26.8467, lon: 80.9462, tz: 'Asia/Kolkata', country: 'India' },
  'kanpur': { lat: 26.4499, lon: 80.3319, tz: 'Asia/Kolkata', country: 'India' },
  'agra': { lat: 27.1767, lon: 78.0081, tz: 'Asia/Kolkata', country: 'India' },
  'varanasi': { lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata', country: 'India' },
  'patna': { lat: 25.5941, lon: 85.1376, tz: 'Asia/Kolkata', country: 'India' },
  'indore': { lat: 22.7196, lon: 75.8577, tz: 'Asia/Kolkata', country: 'India' },
  'bhopal': { lat: 23.2599, lon: 77.4126, tz: 'Asia/Kolkata', country: 'India' },
  'nagpur': { lat: 21.1458, lon: 79.0882, tz: 'Asia/Kolkata', country: 'India' },
  'surat': { lat: 21.1702, lon: 72.8311, tz: 'Asia/Kolkata', country: 'India' },
  'vadodara': { lat: 22.3072, lon: 73.1812, tz: 'Asia/Kolkata', country: 'India' },
  'chandigarh': { lat: 30.7333, lon: 76.7794, tz: 'Asia/Kolkata', country: 'India' },
  'amritsar': { lat: 31.634, lon: 74.8723, tz: 'Asia/Kolkata', country: 'India' },
  'kochi': { lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata', country: 'India' },
  'thiruvananthapuram': { lat: 8.5241, lon: 76.9366, tz: 'Asia/Kolkata', country: 'India' },
  'gorakhpur': { lat: 26.7606, lon: 83.3732, tz: 'Asia/Kolkata', country: 'India' },
  'london': { lat: 51.5074, lon: -0.1278, tz: 'Europe/London', country: 'UK' },
  'new york': { lat: 40.7128, lon: -74.006, tz: 'America/New_York', country: 'USA' },
  'los angeles': { lat: 34.0522, lon: -118.244, tz: 'America/Los_Angeles', country: 'USA' },
  'chicago': { lat: 41.8781, lon: -87.6298, tz: 'America/Chicago', country: 'USA' },
  'houston': { lat: 29.7604, lon: -95.3698, tz: 'America/Chicago', country: 'USA' },
  'toronto': { lat: 43.6532, lon: -79.3832, tz: 'America/Toronto', country: 'Canada' },
  'paris': { lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris', country: 'France' },
  'berlin': { lat: 52.52, lon: 13.405, tz: 'Europe/Berlin', country: 'Germany' },
  'tokyo': { lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo', country: 'Japan' },
  'singapore': { lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore', country: 'Singapore' },
  'dubai': { lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai', country: 'UAE' },
  'sydney': { lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney', country: 'Australia' },
  'melbourne': { lat: -37.8136, lon: 144.9631, tz: 'Australia/Melbourne', country: 'Australia' },
  'moscow': { lat: 55.7558, lon: 37.6173, tz: 'Europe/Moscow', country: 'Russia' },
  'beijing': { lat: 39.9042, lon: 116.4074, tz: 'Asia/Shanghai', country: 'China' },
  'hong kong': { lat: 22.3193, lon: 114.1694, tz: 'Asia/Hong_Kong', country: 'Hong Kong' },
  'istanbul': { lat: 41.0082, lon: 28.9784, tz: 'Europe/Istanbul', country: 'Turkey' },
  'sao paulo': { lat: -23.5505, lon: -46.6333, tz: 'America/Sao_Paulo', country: 'Brazil' },
  'mexico city': { lat: 19.4326, lon: -99.1332, tz: 'America/Mexico_City', country: 'Mexico' },
  'cairo': { lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo', country: 'Egypt' },
  'johannesburg': { lat: -26.2041, lon: 28.0473, tz: 'Africa/Johannesburg', country: 'South Africa' }
};

/* ========================================================================== */
/*                        I18N SERVICE (English / Hindi)                      */
/* ========================================================================== */

const I18N = {
  en: {
    appName: 'PROPHECY',
    appTagline: 'Professional Astrology • Numerology • Life Insights',
    navHome: '🏠 Home',
    navProfile: '👤 Birth Profile',
    navCosmic: '🌌 My Cosmic Profile',
    navWestern: '☀ Western Astrology',
    navVedic: '🕉️ Vedic Astrology',
    navInfluences: '🧠 Influences',
    navMind: 'Mind & Emotions',
    navLifePred: 'Life Predictions',
    navMajorPeriods: 'Major Life Periods',
    navMarriageComp: 'Marriage Compatibility',
    navKundaliMilan: '💑 Kundali Milan',
    navPeak: '⭐ Peak Periods',
    navChallenge: '⚔️ Challenge Periods',
    navNumerology: '🔢 Numerology',
    navMonster: '👹 Monster & Tattoo',
    navReports: '📄 Reports',
    navLangEn: '🇬🇧 English',
    navLangHi: '🇮🇳 हिंदी',
    nameLabel: 'Full Name',
    dobLabel: 'Date of Birth',
    tobLabel: 'Time of Birth',
    pobLabel: 'Place of Birth',
    submitBtn: 'REVEAL MY PROPHECY',
    welcome: 'Welcome',
    cosmicProfile: 'Your Cosmic Identity',
    westernSection: 'Western Astrology',
    vedicSection: 'Vedic Astrology (Jyotish)',
    sunSign: 'Sun Sign',
    moonSign: 'Moon Sign',
    risingSign: 'Rising / Ascendant',
    rashi: 'Janma Rashi',
    nakshatra: 'Nakshatra',
    pada: 'Pada',
    lagna: 'Lagna',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto',
    rahu: 'Rahu (North Node)',
    ketu: 'Ketu (South Node)',
    personality: 'Personality',
    mind: 'Mind & Intellect',
    emotions: 'Emotions',
    relationships: 'Relationships',
    career: 'Career & Life Path',
    strengths: 'Core Strengths',
    challenges: 'Growth Areas',
    lifeThemes: 'Life Themes',
    past: 'Past',
    present: 'Present',
    nearFuture: 'Near Future',
    longTermFuture: 'Long-Term Future',
    overallCompat: 'Overall Compatibility',
    emotional: 'Emotional',
    communication: 'Communication',
    marriage: 'Marriage',
    lifestyle: 'Lifestyle',
    financial: 'Financial',
    attraction: 'Attraction',
    mental: 'Mental',
    longTerm: 'Long-Term Growth',
    groom: 'Groom',
    bride: 'Bride',
    varna: 'Varna',
    vashya: 'Vashya',
    tara: 'Tara',
    yoni: 'Yoni',
    grahaMaitri: 'Graha Maitri',
    gana: 'Gana',
    bhakoot: 'Bhakoot',
    nadi: 'Nadi',
    totalScore: 'Total Score',
    pastPeaks: 'Past Peak Periods',
    currentPhase: 'Current Phase',
    futurePeaks: 'Future Peak Periods',
    pastChallenges: 'Past Challenges',
    currentChallenge: 'Current Challenge',
    futureChallenges: 'Future Challenges',
    lifePath: 'Life Path Number',
    destiny: 'Destiny / Expression',
    soulUrge: 'Soul Urge (Heart\'s Desire)',
    personalityNum: 'Personality Number',
    birthdayNum: 'Birthday Number',
    personalYear: 'Personal Year',
    disclaimer: 'Astrological insights are interpretive guidance based on calculated celestial positions. They are not a substitute for professional medical, legal, or financial advice.'
  },
  hi: {
    appName: 'PROPHECY',
    appTagline: 'प्रोफेशनल ज्योतिष • अंक ज्योतिष • जीवन अंतर्दृष्टि',
    navHome: '🏠 होम',
    navProfile: '👤 जन्म प्रोफाइल',
    navCosmic: '🌌 मेरी ब्रह्मांडीय पहचान',
    navWestern: '☀ पश्चिमी ज्योतिष',
    navVedic: '🕉️ वैदिक ज्योतिष',
    navInfluences: '🧠 प्रभाव',
    navMind: 'मन एवं भावनाएं',
    navLifePred: 'जीवन भविष्यवाणी',
    navMajorPeriods: 'प्रमुख जीवन अवधि',
    navMarriageComp: 'विवाह संगति',
    navKundaliMilan: '💑 कुंडली मिलान',
    navPeak: '⭐ शिखर अवधि',
    navChallenge: '⚔️ चुनौतीपूर्ण अवधि',
    navNumerology: '🔢 अंक ज्योतिष',
    navMonster: '👹 राक्षस एवं टैटू',
    navReports: '📄 रिपोर्ट्स',
    navLangEn: '🇬🇧 English',
    navLangHi: '🇮🇳 हिंदी',
    nameLabel: 'पूरा नाम',
    dobLabel: 'जन्म तिथि',
    tobLabel: 'जन्म समय',
    pobLabel: 'जन्म स्थान',
    submitBtn: 'मेरी PROPHECY प्रकट करें',
    welcome: 'स्वागत है',
    cosmicProfile: 'आपकी ब्रह्मांडीय पहचान',
    westernSection: 'पश्चिमी ज्योतिष',
    vedicSection: 'वैदिक ज्योतिष (ज्योतिष)',
    sunSign: 'सूर्य राशि',
    moonSign: 'चन्द्र राशि',
    risingSign: 'उदय राशि / लग्न',
    rashi: 'जन्म राशि',
    nakshatra: 'नक्षत्र',
    pada: 'पद',
    lagna: 'लग्न',
    mercury: 'बुध',
    venus: 'शुक्र',
    mars: 'मंगल',
    jupiter: 'बृहस्पति',
    saturn: 'शनि',
    uranus: 'यूरेनस',
    neptune: 'नेपच्यून',
    pluto: 'प्लूटो',
    rahu: 'राहु',
    ketu: 'केतु',
    personality: 'व्यक्तित्व',
    mind: 'मन एवं बुद्धि',
    emotions: 'भावनाएं',
    relationships: 'संबंध',
    career: 'करियर एवं जीवन पथ',
    strengths: 'मुख्य शक्तियां',
    challenges: 'विकास क्षेत्र',
    lifeThemes: 'जीवन विषय',
    past: 'अतीत',
    present: 'वर्तमान',
    nearFuture: 'निकट भविष्य',
    longTermFuture: 'दीर्घकालिक भविष्य',
    overallCompat: 'समग्र संगति',
    emotional: 'भावनात्मक',
    communication: 'संवाद',
    marriage: 'विवाह',
    lifestyle: 'जीवनशैली',
    financial: 'आर्थिक',
    attraction: 'आकर्षण',
    mental: 'मानसिक',
    longTerm: 'दीर्घकालिक विकास',
    groom: 'वर',
    bride: 'वधू',
    varna: 'वर्ण',
    vashya: 'वश्य',
    tara: 'तारा',
    yoni: 'योनि',
    grahaMaitri: 'ग्रह मैत्री',
    gana: 'गण',
    bhakoot: 'भकूट',
    nadi: 'नाड़ी',
    totalScore: 'कुल अंक',
    pastPeaks: 'पिछली शिखर अवधि',
    currentPhase: 'वर्तमान चरण',
    futurePeaks: 'भविष्य की शिखर अवधि',
    pastChallenges: 'पिछली चुनौतियां',
    currentChallenge: 'वर्तमान चुनौती',
    futureChallenges: 'भविष्य की चुनौतियां',
    lifePath: 'लाइफ पाथ नंबर',
    destiny: 'डेस्टिनी / एक्सप्रेशन',
    soulUrge: 'सोल अर्ज (हृदय की इच्छा)',
    personalityNum: 'पर्सनालिटी नंबर',
    birthdayNum: 'बर्थडे नंबर',
    personalYear: 'पर्सनल ईयर',
    disclaimer: 'ज्योतिषीय अंतर्दृष्टि गणना की गई खगोलीय स्थितियों पर आधारित व्याख्यात्मक मार्गदर्शन है। ये पेशेवर चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं हैं।'
  }
};

class I18NService {
  constructor() {
    this.lang = localStorage.getItem('dn_lang') || 'en';
  }
  t(key) { return I18N[this.lang][key] || key; }
  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('dn_lang', lang);
  }
}

/* ========================================================================== */
/*                        ASTRONOMICAL CALCULATION ENGINE                      */
/* ========================================================================== */

const DEG = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const AYANAMSA_LAHIRI_2000 = 23.8544;  // Lahiri ayanamsa for J2000.0 (approx)

function normDeg(d) {
  d = d % 360;
  if (d < 0) d += 360;
  return d;
}

function julianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  const frac = (hour + minute / 60 + second / 3600) / 24;
  return JD + frac;
}

function julianCenturies(JD) {
  return (JD - 2451545.0) / 36525.0;
}

function calcSunLongitude(JD) {
  const T = julianCenturies(JD);
  const L = normDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG) +
            0.000289 * Math.sin(3 * M * DEG);
  const sunTrueLong = normDeg(L + C);
  return sunTrueLong;
}

function calcMoonLongitude(JD) {
  const T = julianCenturies(JD);
  const Lp = normDeg(218.3164591 + 481267.88134236 * T - 0.0013268 * T * T);
  const D = normDeg(297.8502042 + 445267.1115168 * T - 0.0016300 * T * T);
  const M = normDeg(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  const Mp = normDeg(134.9634114 + 477198.8676313 * T + 0.0089970 * T * T);
  const F = normDeg(93.2720993 + 483202.0175273 * T - 0.0034029 * T * T);

  let moonLong = Lp;
  moonLong += 6.288774 * Math.sin(Mp * DEG);
  moonLong += -1.274027 * Math.sin((Mp - 2 * D) * DEG);
  moonLong += 0.658309 * Math.sin(2 * D * DEG);
  moonLong += -0.185596 * Math.sin(M * DEG);
  moonLong += -0.058793 * Math.sin(2 * Mp * DEG);
  moonLong += -0.057208 * Math.sin(2 * D - Mp * DEG);
  moonLong += 0.053320 * Math.sin((2 * Mp - 2 * D) * DEG);
  moonLong += 0.045754 * Math.sin((2 * D - M) * DEG);
  moonLong += -0.040923 * Math.sin((2 * D + Mp) * DEG);
  moonLong += 0.034718 * Math.sin((2 * D - M - Mp) * DEG);
  moonLong += -0.030465 * Math.sin((M + Mp) * DEG);
  return normDeg(moonLong);
}

function calcGeocentricPlanetLongitude(JD, planet) {
  const d = JD - 2451543.5;
  const e = {
    earth: [282.9404, 4.70935e-5, 1, .016709, -1.151e-9, 356.047, .9856002585],
    mercury: [29.1241, 1.01444e-5, .387098, .205635, 5.59e-10, 168.6562, 4.0923344368],
    venus: [54.891, 1.38374e-5, .72333, .006773, -1.302e-9, 48.0052, 1.6021302244],
    mars: [286.5016, 2.92961e-5, 1.523688, .093405, 2.516e-9, 18.6021, .5240207766],
    jupiter: [273.8777, 1.64505e-5, 5.20256, .048498, 4.469e-9, 19.895, .0830853001],
    saturn: [339.3939, 2.97661e-5, 9.55475, .055546, -9.499e-9, 316.967, .0334442282],
    uranus: [96.6612, 3.0565e-5, 19.18171, .047318, 7.45e-9, 142.5905, .011725806],
    neptune: [272.8461, -6.027e-6, 30.05826, .008606, 2.15e-9, 260.2471, .005995147]
  };
  const position = name => {
    const p = e[name];
    if (!p) return null;
    const w = (p[0] + p[1] * d) * DEG, a = p[2], ecc = p[3] + p[4] * d;
    const M = normDeg(p[5] + p[6] * d) * DEG;
    const E = M + ecc * Math.sin(M) * (1 + ecc * Math.cos(M));
    const x = a * (Math.cos(E) - ecc), y = a * Math.sqrt(1 - ecc * ecc) * Math.sin(E);
    return { x: x * Math.cos(w) - y * Math.sin(w), y: x * Math.sin(w) + y * Math.cos(w) };
  };
  const earth = position('earth'), body = position(planet);
  return earth && body ? normDeg(Math.atan2(body.y - earth.y, body.x - earth.x) * RAD2DEG) : null;
}

function calcPlanetLongitudeVSOP(JD, planet) {
  const T = julianCenturies(JD);
  const T2 = T * T;
  const T3 = T2 * T;
  const tables = {
    mercury: { L: [252.2509055, 538101628.8484, 1.0555, 0.0], P: [77.456119, 5736.4175, 0.0, 0.0], e: [0.20563175, 0.00020407, -0.000000028, 0.0], i: [7.004986, -23.5099, -0.00011, 0.0] },
    venus:   { L: [181.97980085, 210664136.5998, 1.0038, 0.0], P: [131.563707, 174.8638, 0.0, 0.0], e: [0.00677188, -0.000047766, 0.0000000975, 0.0], i: [3.394662, -2.0887, -0.000178, 0.0] },
    mars:    { L: [355.43299958, 68905104.3095, 1.1589, 0.0], P: [336.060234, 1598.2238, 0.0, 0.0], e: [0.09340062, 0.000090484, -0.0000000806, 0.0], i: [1.849726, -25.4923, -0.000026, 0.0] },
    jupiter: { L: [34.35151874, 10925758.2735, 0.9904, 0.0], P: [14.331309, 1563.209, 0.0, 0.0], e: [0.04849793, 0.000163226, -0.0000004713, -0.00000000197], i: [1.303267, -42.0512, 0.000092, 0.0] },
    saturn:  { L: [50.0774714, 4404648.7275, 0.9962, 0.0], P: [93.056787, 1940.0445, 0.0, 0.0], e: [0.05554814, -0.000346641, -0.0000006436, 0.00000000335], i: [2.488879, -38.0886, 0.000069, 0.0] },
    uranus:  { L: [314.055005, 1542481.182, 0.0, 0.0], P: [173.005291, 622.6814, 0.0, 0.0], e: [0.047318, -0.00007461, 0.0, 0.0], i: [0.773196, -13.289, 0.0, 0.0] },
    neptune: { L: [304.348665, 786545.682, 0.0, 0.0], P: [48.120276, 559.7127, 0.0, 0.0], e: [0.008605, 0.00000578, 0.0, 0.0], i: [1.769952, -9.3524, 0.0, 0.0] },
    pluto:   { L: [238.95695, 522746.792, 0.0, 0.0], P: [224.06676, -132.257, 0.0, 0.0], e: [0.24880766, 0.00000000, 0.0, 0.0], i: [17.160620, 11.07, 0.0, 0.0] }
  };
  const p = tables[planet];
  if (!p) return calcSunLongitude(JD);
  const L = normDeg(p.L[0] + (p.L[1] / 3600) * T + (p.L[2] / 3600) * T2);
  const P = normDeg(p.P[0] + (p.P[1] / 3600) * T);
  const e = p.e[0] + p.e[1] * T + p.e[2] * T2;
  const M = normDeg(L - P);
  const E = equationOfCenter(M, e);
  return normDeg(L + E);
}

function equationOfCenter(M, e) {
  const Mr = M * DEG;
  return (360 / Math.PI) * (e * Math.sin(Mr) + (e * e / 2) * Math.sin(2 * Mr));
}

function calcGST(JD) {
  const T = julianCenturies(JD);
  const JD0 = Math.floor(JD - 0.5) + 0.5;
  const H = (JD - JD0) * 24;
  const T0 = (JD0 - 2451545.0) / 36525.0;
  let GST = 6.697374558 + 2400.051336 * T0 + 0.000025862 * T0 * T0 + 1.00273790935 * H;
  GST %= 24;
  return (GST < 0 ? GST + 24 : GST) * 15;
}

function calcAscendant(JD, longitude, latitude) {
  if (!Number.isFinite(JD) || !Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new Error('Accurate Lagna calculation requires valid birth coordinates and UTC time.');
  }
  const lst = normDeg(calcGST(JD) + longitude);
  const epsilon = 23.4392911 - 0.00000036 * julianCenturies(JD);
  const theta = lst * DEG;
  const phi = latitude * DEG;
  const obliquity = epsilon * DEG;
  // Ecliptic/equatorial horizon intersection. atan2 preserves the correct quadrant.
  return normDeg(Math.atan2(
    Math.cos(theta),
    -(Math.sin(theta) * Math.cos(obliquity) + Math.tan(phi) * Math.sin(obliquity))
  ) * RAD2DEG);
}

function calcMidheaven(JD, longitude) {
  const lst = normDeg(calcGST(JD) + longitude) * DEG;
  const epsilon = (23.4392911 - 0.00000036 * julianCenturies(JD)) * DEG;
  return normDeg(Math.atan2(Math.sin(lst), Math.cos(lst) * Math.cos(epsilon)) * RAD2DEG);
}

function formatLongitude(longitude) {
  const totalSeconds = Math.round(getSignDegree(longitude) * 3600);
  return `${Math.floor(totalSeconds / 3600)}° ${Math.floor((totalSeconds % 3600) / 60)}' ${totalSeconds % 60}"`;
}

function emitLagnaDiagnostic(profile) {
  if (!['localhost', '127.0.0.1', '::1'].includes(window.location?.hostname) || localStorage.getItem('prophecy_debug') !== '1') return;
  console.info('[PROPHECY lagna diagnostic]', {
    birthDate: profile.dateOfBirth, localBirthTime: profile.tobStr,
    latitude: profile.latitude, longitude: profile.longitude, timezone: profile.timezone,
    utc: profile.utcBirthTime, julianDay: profile.JD, zodiac: 'Sidereal',
    ayanamsha: 'Lahiri', houseSystem: 'Equal houses',
    ascendantLongitude: profile.vedic.lagna.long, lagna: profile.vedic.lagna.sign.en
  });
}

function calcEqualHouses(ascLong) {
  return Array.from({ length: 12 }, (_, i) => {
    const cusp = normDeg(ascLong + i * 30);
    return { number: i + 1, cusp, signIdx: Math.floor(cusp / 30) };
  });
}
function getSignIndex(long) { return Math.floor(normDeg(long) / 30); }
function getSignDegree(long) { return normDeg(long) % 30; }
function getSign(long, tropical = true) {
  return TROPICAL_SIGNS[getSignIndex(long)];
}

function getNakshatra(siderealMoonLong) {
  const norm = normDeg(siderealMoonLong);
  for (let i = 0; i < NAKSHATRAS.length; i++) {
    if (norm >= NAKSHATRAS[i].range[0] && norm < NAKSHATRAS[i].range[1]) {
      const within = norm - NAKSHATRAS[i].range[0];
      const padaSize = 13.333 / 4;
      const pada = Math.floor(within / padaSize) + 1;
      return { nakshatra: NAKSHATRAS[i], nakshatraIdx: i, pada, padaFrac: within / 13.333 };
    }
  }
  return { nakshatra: NAKSHATRAS[26], nakshatraIdx: 26, pada: 4, padaFrac: 1.0 };
}

function getPlanetHouse(planetLong, ascLong, houses) {
  const rel = normDeg(planetLong - ascLong);
  return Math.floor(rel / 30) + 1;
}

function resolvePlace(placeStr) {
  if (!placeStr) return { lat: 0, lon: 0, tz: 'UTC', resolved: false, name: placeStr || 'Unknown' };
  const lower = placeStr.toLowerCase().trim();
  for (const key of Object.keys(MAJOR_CITIES_GEO)) {
    if (lower.includes(key)) {
      const c = MAJOR_CITIES_GEO[key];
      return { lat: c.lat, lon: c.lon, tz: c.tz, resolved: true, name: placeStr, country: c.country };
    }
  }
  const parts = lower.split(',');
  if (parts.length >= 2) {
    for (const key of Object.keys(MAJOR_CITIES_GEO)) {
      if (parts.some(p => p.trim().includes(key))) {
        const c = MAJOR_CITIES_GEO[key];
        return { lat: c.lat, lon: c.lon, tz: c.tz, resolved: true, name: placeStr, country: c.country };
      }
    }
  }
  return { lat: null, lon: null, tz: null, resolved: false, name: placeStr, country: 'Unknown' };
}

async function resolvePlaceOnline(placeStr) {
  const local = resolvePlace(placeStr);
  if (local.resolved) return local;
  const query = encodeURIComponent(placeStr);
  const response = await fetch(`https://photon.komoot.io/api/?q=${query}&limit=1`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Please select the correct birthplace.');
  const data = await response.json();
  const feature = data.features && data.features[0];
  const coordinates = feature && feature.geometry && feature.geometry.coordinates;
  if (!coordinates || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) throw new Error('Please select the correct birthplace.');
  const country = feature.properties && feature.properties.country || 'Unknown';
  const timezoneResponse = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${coordinates[1]}&longitude=${coordinates[0]}`, { headers: { Accept: 'application/json' } });
  if (!timezoneResponse.ok) throw new Error('We could not resolve the birthplace timezone.');
  const timezoneData = await timezoneResponse.json();
  const timezone = timezoneData.timeZone || timezoneData.ianaTimeId || timezoneData.timeZoneId;
  if (!timezone || (typeof Intl.supportedValuesOf === 'function' && !Intl.supportedValuesOf('timeZone').includes(timezone))) throw new Error('We could not resolve the birthplace timezone.');
  return { lat: coordinates[1], lon: coordinates[0], tz: timezone, resolved: true, name: placeStr, country, source: 'Photon geocoder + coordinate timezone database' };
}

function estimateUTCOffsetMinutes(tzName, dateStr, timeStr) {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    const wallAsUTC = Date.UTC(year, month - 1, day, hour, minute);
    let guess = wallAsUTC;
    for (let i = 0; i < 2; i++) {
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
        timeZone: tzName, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date(guess)).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
      const shownAsUTC = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour) % 24, Number(parts.minute));
      guess -= shownAsUTC - wallAsUTC;
    }
    return Math.round((wallAsUTC - guess) / 60000);
  } catch (e) {}
  return null;
}

/* ========================================================================== */
/*                    CENTRAL BIRTH PROFILE + CALCULATION SERVICE             */
/* ========================================================================== */

class BirthProfile {
  constructor(input) {
    this.resolvedPlace = input.resolvedPlace || null;
    this.name = input.name || 'Cosmic Traveler';
    this.phone = input.phone || '';
    this.email = input.email || '';
    this.dobStr = input.dob;
    this.tobStr = input.tob || '12:00';
    this.pobStr = input.pob || 'Global';
    this.unknownTime = !input.tob || input.tob.trim() === '';
    this.birthTimeAvailable = !this.unknownTime;
    this._calc();
  }

  _calc() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.dobStr)) throw new Error('Please select a valid date of birth.');
    const [y, m, d] = this.dobStr.split('-').map(Number);
    const dateCheck = new Date(Date.UTC(y, m - 1, d));
    if (dateCheck.getUTCFullYear() !== y || dateCheck.getUTCMonth() !== m - 1 || dateCheck.getUTCDate() !== d) throw new Error('Please select a valid date of birth.');
    const [hh, mm, ss = 0] = this.tobStr.split(':').map(Number);
    if (!Number.isInteger(hh) || !Number.isInteger(mm) || !Number.isInteger(ss) || hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) throw new Error('Please enter a valid time of birth.');
    this.year = y; this.month = m; this.day = d;
    this.hour = isNaN(hh) ? 12 : hh;
    this.minute = isNaN(mm) ? 0 : mm;
    this.second = isNaN(ss) ? 0 : ss;
    this.place = this.resolvedPlace || resolvePlace(this.pobStr);
    if (!this.place.resolved) throw new Error('Please select the correct birthplace.');
    if (!Number.isFinite(this.place.lat) || !Number.isFinite(this.place.lon) || Math.abs(this.place.lat) > 90 || Math.abs(this.place.lon) > 180 || !this.place.tz) throw new Error('Accurate Lagna calculation requires a resolved birthplace timezone and coordinates.');
    this.utcOffsetMin = estimateUTCOffsetMinutes(this.place.tz, this.dobStr, this.tobStr);
    if (this.utcOffsetMin === null) throw new Error('We could not resolve the birthplace timezone.');
    this.utcHour = this.hour - Math.floor(this.utcOffsetMin / 60);
    this.utcMin = this.minute - (this.utcOffsetMin % 60);
    this.JD = julianDay(y, m, d, this.hour - this.utcOffsetMin / 60, this.minute, this.second);
    this.utcTimestamp = new Date(Date.UTC(y, m - 1, d, this.utcHour, this.utcMin, this.second)).toISOString();
    this.dateOfBirth = this.dobStr;
    this.timeOfBirth = this.unknownTime ? null : this.tobStr;
    this.birthPlace = this.pobStr;
    this.latitude = this.place.lat;
    this.longitude = this.place.lon;
    this.timezone = this.place.tz;
    this.utcBirthTime = this.utcTimestamp;
    this.ayanamsa = AYANAMSA_LAHIRI_2000 + 0.00013968 * (this.JD - 2451545.0);
    this._calcAstro();
    emitLagnaDiagnostic(this);
  }

  _calcAstro() {
    const JD = this.JD;
    const lat = this.place.lat;
    const lon = this.place.lon;

    const sunTropical = calcSunLongitude(JD);
    const moonTropical = calcMoonLongitude(JD);
    const planets = {};
    ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].forEach(pl => {
      planets[pl] = calcGeocentricPlanetLongitude(JD, pl) ?? calcPlanetLongitudeVSOP(JD, pl);
    });
    const t = julianCenturies(JD);
    planets.rahuTropical = normDeg(125.04452 - 1934.136261 * t + 0.0020708 * t * t);
    planets.ketuTropical = normDeg(planets.rahuTropical + 180);

    const ascTropical = (this.birthTimeAvailable && (lat !== 0 || lon !== 0))
      ? calcAscendant(JD, lon, lat)
      : sunTropical;
    const mcTropical = calcMidheaven(JD, lon);

    const houses = calcEqualHouses(ascTropical);

    this.western = {
      sun: { long: sunTropical, sign: getSign(sunTropical), signIdx: getSignIndex(sunTropical), degree: getSignDegree(sunTropical), house: getPlanetHouse(sunTropical, ascTropical, houses) },
      moon: { long: moonTropical, sign: getSign(moonTropical), signIdx: getSignIndex(moonTropical), degree: getSignDegree(moonTropical), house: getPlanetHouse(moonTropical, ascTropical, houses) },
      ascendant: { long: ascTropical, sign: getSign(ascTropical), signIdx: getSignIndex(ascTropical), degree: getSignDegree(ascTropical), house: 1 },
      midheaven: { long: mcTropical, sign: getSign(mcTropical), signIdx: getSignIndex(mcTropical), degree: getSignDegree(mcTropical), house: 10 },
      mercury: { long: planets.mercury, sign: getSign(planets.mercury), signIdx: getSignIndex(planets.mercury), degree: getSignDegree(planets.mercury), house: getPlanetHouse(planets.mercury, ascTropical, houses) },
      venus: { long: planets.venus, sign: getSign(planets.venus), signIdx: getSignIndex(planets.venus), degree: getSignDegree(planets.venus), house: getPlanetHouse(planets.venus, ascTropical, houses) },
      mars: { long: planets.mars, sign: getSign(planets.mars), signIdx: getSignIndex(planets.mars), degree: getSignDegree(planets.mars), house: getPlanetHouse(planets.mars, ascTropical, houses) },
      jupiter: { long: planets.jupiter, sign: getSign(planets.jupiter), signIdx: getSignIndex(planets.jupiter), degree: getSignDegree(planets.jupiter), house: getPlanetHouse(planets.jupiter, ascTropical, houses) },
      saturn: { long: planets.saturn, sign: getSign(planets.saturn), signIdx: getSignIndex(planets.saturn), degree: getSignDegree(planets.saturn), house: getPlanetHouse(planets.saturn, ascTropical, houses) },
      uranus: { long: planets.uranus, sign: getSign(planets.uranus), signIdx: getSignIndex(planets.uranus), degree: getSignDegree(planets.uranus), house: getPlanetHouse(planets.uranus, ascTropical, houses) },
      neptune: { long: planets.neptune, sign: getSign(planets.neptune), signIdx: getSignIndex(planets.neptune), degree: getSignDegree(planets.neptune), house: getPlanetHouse(planets.neptune, ascTropical, houses) },
      pluto: { long: planets.pluto, sign: getSign(planets.pluto), signIdx: getSignIndex(planets.pluto), degree: getSignDegree(planets.pluto), house: getPlanetHouse(planets.pluto, ascTropical, houses) },
      houses,
      ascendantApproximated: !this.birthTimeAvailable || !this.place.resolved
    };

    const ayan = this.ayanamsa;
    const sidereal = (l) => normDeg(l - ayan);
    const sunSidereal = sidereal(sunTropical);
    const moonSidereal = sidereal(moonTropical);
    const ascSidereal = sidereal(ascTropical);
    const planetsSidereal = {};
    Object.keys(planets).forEach(k => planetsSidereal[k] = sidereal(planets[k]));
    const housesVedic = calcEqualHouses(ascSidereal);
    const nak = getNakshatra(moonSidereal);

    this.vedic = {
      lagna: { long: ascSidereal, sign: TROPICAL_SIGNS[getSignIndex(ascSidereal)], signIdx: getSignIndex(ascSidereal), degree: getSignDegree(ascSidereal), house: 1 },
      lagnaLord: VEDIC_RASHI_LORDS[getSignIndex(ascSidereal)],
      rashi: { long: moonSidereal, sign: TROPICAL_SIGNS[getSignIndex(moonSidereal)], signIdx: getSignIndex(moonSidereal), degree: getSignDegree(moonSidereal), house: getPlanetHouse(moonSidereal, ascSidereal, housesVedic) },
      rashiLord: VEDIC_RASHI_LORDS[getSignIndex(moonSidereal)],
      nakshatra: nak.nakshatra,
      nakshatraIdx: nak.nakshatraIdx,
      pada: nak.pada,
      padaFrac: nak.padaFrac,
      sun: { long: sunSidereal, sign: TROPICAL_SIGNS[getSignIndex(sunSidereal)], signIdx: getSignIndex(sunSidereal), degree: getSignDegree(sunSidereal), house: getPlanetHouse(sunSidereal, ascSidereal, housesVedic) },
      moon: { long: moonSidereal, sign: TROPICAL_SIGNS[getSignIndex(moonSidereal)], signIdx: getSignIndex(moonSidereal), degree: getSignDegree(moonSidereal), house: getPlanetHouse(moonSidereal, ascSidereal, housesVedic) },
      mercury: { long: planetsSidereal.mercury, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.mercury)], signIdx: getSignIndex(planetsSidereal.mercury), degree: getSignDegree(planetsSidereal.mercury), house: getPlanetHouse(planetsSidereal.mercury, ascSidereal, housesVedic) },
      venus: { long: planetsSidereal.venus, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.venus)], signIdx: getSignIndex(planetsSidereal.venus), degree: getSignDegree(planetsSidereal.venus), house: getPlanetHouse(planetsSidereal.venus, ascSidereal, housesVedic) },
      mars: { long: planetsSidereal.mars, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.mars)], signIdx: getSignIndex(planetsSidereal.mars), degree: getSignDegree(planetsSidereal.mars), house: getPlanetHouse(planetsSidereal.mars, ascSidereal, housesVedic) },
      jupiter: { long: planetsSidereal.jupiter, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.jupiter)], signIdx: getSignIndex(planetsSidereal.jupiter), degree: getSignDegree(planetsSidereal.jupiter), house: getPlanetHouse(planetsSidereal.jupiter, ascSidereal, housesVedic) },
      saturn: { long: planetsSidereal.saturn, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.saturn)], signIdx: getSignIndex(planetsSidereal.saturn), degree: getSignDegree(planetsSidereal.saturn), house: getPlanetHouse(planetsSidereal.saturn, ascSidereal, housesVedic) },
      rahu: { long: planetsSidereal.rahuTropical, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.rahuTropical)], signIdx: getSignIndex(planetsSidereal.rahuTropical), degree: getSignDegree(planetsSidereal.rahuTropical), house: getPlanetHouse(planetsSidereal.rahuTropical, ascSidereal, housesVedic) },
      ketu: { long: planetsSidereal.ketuTropical, sign: TROPICAL_SIGNS[getSignIndex(planetsSidereal.ketuTropical)], signIdx: getSignIndex(planetsSidereal.ketuTropical), degree: getSignDegree(planetsSidereal.ketuTropical), house: getPlanetHouse(planetsSidereal.ketuTropical, ascSidereal, housesVedic) },
      houses: housesVedic,
      ayanamsa: ayan,
      dashas: calcVimshottariDashas(this.JD, moonSidereal, nak)
    };
  }
}

function calcVimshottariDashas(JD_atBirth, moonSidereal, nakData) {
  const nakIdx = nakData.nakshatraIdx;
  const padaFrac = nakData.padaFrac;
  let startPlanet = null;
  for (const d of VIMSHOTTARI_DASHA_LORDS) {
    if (d.nakshatras.includes(nakIdx)) { startPlanet = d; break; }
  }
  if (!startPlanet) return [];

  const startIdx = VIMSHOTTARI_DASHA_LORDS.findIndex(d => d === startPlanet);
  const remainingYears = (1 - padaFrac) * startPlanet.years;
  const daysPerYear = 365.2425;

  let currentJD = JD_atBirth + remainingYears * daysPerYear;
  const birthDate = new Date(Math.round((JD_atBirth - 2440587.5) * 86400 * 1000));
  const dashas = [];

  dashas.push({
    planet: startPlanet.planet,
    years: startPlanet.years,
    startDate: birthDate,
    endDate: new Date(birthDate.getTime() + remainingYears * 365.2425 * 86400 * 1000),
    isCurrent: false
  });

  for (let i = 1; i < 12; i++) {
    const dasha = VIMSHOTTARI_DASHA_LORDS[(startIdx + i) % 9];
    const sDate = new Date(Math.round((currentJD - 2440587.5) * 86400 * 1000));
    currentJD += dasha.years * daysPerYear;
    const eDate = new Date(Math.round((currentJD - 2440587.5) * 86400 * 1000));
    dashas.push({
      planet: dasha.planet,
      years: dasha.years,
      startDate: sDate,
      endDate: eDate,
      isCurrent: false
    });
  }

  const now = new Date();
  let currentMahadasha = dashas[0];
  for (const d of dashas) {
    if (now >= d.startDate && now < d.endDate) {
      d.isCurrent = true;
      currentMahadasha = d;
      break;
    }
  }

  return { list: dashas, current: currentMahadasha };
}

/* ========================================================================== */
/*                      NUMEROLOGY SERVICE (Deterministic)                     */
/* ========================================================================== */

class NumerologyService {
  static _reduce(n) {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = n.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return n;
  }

  static _letterValue(c) {
    const v = c.toUpperCase().charCodeAt(0) - 64;
    return ((v - 1) % 9) + 1;
  }

  static _isVowel(c) {
    return ['A', 'E', 'I', 'O', 'U'].includes(c.toUpperCase());
  }

  static lifePath(dobStr) {
    const [y, m, d] = dobStr.split('-').map(Number);
    const yr = this._reduce(y.toString().split('').reduce((a, b) => a + parseInt(b), 0));
    const mr = this._reduce(m);
    const dr = this._reduce(d);
    return this._reduce(yr + mr + dr);
  }

  static destiny(fullName) {
    const total = fullName.split('').filter(c => /[a-zA-Z]/.test(c))
      .reduce((sum, c) => sum + this._letterValue(c), 0);
    return this._reduce(total);
  }

  static soulUrge(fullName) {
    let total = 0;
    for (const c of fullName) {
      if (/[a-zA-Z]/.test(c) && this._isVowel(c)) total += this._letterValue(c);
    }
    if (fullName.toUpperCase().endsWith('Y')) {
      const last = fullName.charAt(fullName.length - 1);
      total += this._letterValue(last);
    }
    return this._reduce(total);
  }

  static personality(fullName) {
    let total = 0;
    for (const c of fullName) {
      if (/[a-zA-Z]/.test(c) && !this._isVowel(c)) total += this._letterValue(c);
    }
    return this._reduce(total);
  }

  static birthday(day) {
    return this._reduce(day);
  }

  static personalYear(dobStr, currentYear = new Date().getFullYear()) {
    const [, m, d] = dobStr.split('-').map(Number);
    return this._reduce(m + d + currentYear.toString().split('').reduce((a, b) => a + parseInt(b), 0));
  }

  static calcAll(name, dobStr, day) {
    return {
      lifePath: this.lifePath(dobStr),
      destiny: this.destiny(name),
      soulUrge: this.soulUrge(name),
      personality: this.personality(name),
      birthday: this.birthday(day),
      personalYear: this.personalYear(dobStr)
    };
  }

  static meaning(num) {
    const meanings = {
      1: { en: 'Leadership, independence, originality, pioneer spirit. The initiator.', hi: 'नेतृत्व, स्वतंत्रता, मौलिकता। आरंभ करने वाला।' },
      2: { en: 'Diplomacy, partnership, sensitivity, cooperation. The peacemaker.', hi: 'कूटनीति, साझेदारी, संवेदनशीलता। शांतिदूत।' },
      3: { en: 'Creativity, self-expression, joy, communication. The artist.', hi: 'रचनात्मकता, आत्म-अभिव्यक्ति, संवाद। कलाकार।' },
      4: { en: 'Stability, discipline, hard work, foundation. The builder.', hi: 'स्थिरता, अनुशासन, कठिन परिश्रम। निर्माता।' },
      5: { en: 'Freedom, change, adventure, versatility. The adventurer.', hi: 'स्वतंत्रता, परिवर्तन, साहस, बहुमुखिता। साहसी।' },
      6: { en: 'Harmony, nurturing, responsibility, love. The caregiver.', hi: 'सामंजस्य, पालन-पोषण, दायित्व, प्रेम। देखभाल करने वाला।' },
      7: { en: 'Analysis, spirituality, introspection, wisdom. The seeker.', hi: 'विश्लेषण, आध्यात्मिकता, आत्मनिरीक्षण, ज्ञान। खोजकर्ता।' },
      8: { en: 'Authority, power, abundance, material success. The executive.', hi: 'अधिकार, शक्ति, समृद्धि। कार्यकारी।' },
      9: { en: 'Humanitarianism, compassion, universal love, completion. The humanitarian.', hi: 'मानवतावाद, करुणा, सार्वभौमिक प्रेम। मानवतावादी।' },
      11: { en: 'Master intuition, spiritual illumination, visionary. The Master Teacher.', hi: 'श्रेष्ठ अन्तर्ज्ञान, आध्यात्मिक प्रकाश, दूरदर्शी। गुरु।' },
      22: { en: 'Master builder, large-scale vision, practical idealism. The Master Architect.', hi: 'श्रेष्ठ निर्माता, वृहत दृष्टि, व्यावहारिक आदर्शवाद। वास्तुकार।' },
      33: { en: 'Master teacher, unconditional love, healing, compassion. The Master Healer.', hi: 'श्रेष्ठ शिक्षक, बिना शर्त प्रेम, उपचार, करुणा। उपचारक।' }
    };
    return meanings[num] || { en: '', hi: '' };
  }
}

/* ========================================================================== */
/*                      RULE-BASED INTERPRETATIONS                             */
/* ========================================================================== */

const SIGN_PERSONALITY = {
  0: { strengths: ['Brave', 'Pioneering', 'Confident'], challenges: ['Impulsive', 'Short-tempered', 'Competitive'], themes: ['Leadership', 'Initiation', 'Courage'] },
  1: { strengths: ['Reliable', 'Sensual', 'Patient'], challenges: ['Stubborn', 'Possessive', 'Resistant to change'], themes: ['Security', 'Value', 'Sensory enjoyment'] },
  2: { strengths: ['Curious', 'Versatile', 'Witty'], challenges: ['Restless', 'Superficial', 'Indecisive'], themes: ['Communication', 'Learning', 'Connection'] },
  3: { strengths: ['Nurturing', 'Empathetic', 'Protective'], challenges: ['Moody', 'Clingy', 'Over-sensitive'], themes: ['Family', 'Emotional roots', 'Home'] },
  4: { strengths: ['Generous', 'Charismatic', 'Creative'], challenges: ['Prideful', 'Dramatic', 'Dominating'], themes: ['Self-expression', 'Recognition', 'Joy'] },
  5: { strengths: ['Analytical', 'Diligent', 'Practical'], challenges: ['Overcritical', 'Worrying', 'Perfectionist'], themes: ['Service', 'Health', 'Craftsmanship'] },
  6: { strengths: ['Diplomatic', 'Fair-minded', 'Charming'], challenges: ['Indecisive', 'People-pleasing', 'Avoids conflict'], themes: ['Relationships', 'Balance', 'Beauty'] },
  7: { strengths: ['Passionate', 'Perceptive', 'Resilient'], challenges: ['Jealous', 'Secretive', 'Controlling'], themes: ['Transformation', 'Power', 'Intimacy'] },
  8: { strengths: ['Optimistic', 'Philosophical', 'Adventurous'], challenges: ['Restless', 'Overly blunt', 'Exaggerating'], themes: ['Expansion', 'Freedom', 'Truth'] },
  9: { strengths: ['Disciplined', 'Responsible', 'Ambitious'], challenges: ['Pessimistic', 'Rigid', 'Withholding'], themes: ['Achievement', 'Structure', 'Legacy'] },
  10: { strengths: ['Innovative', 'Independent', 'Humanitarian'], challenges: ['Eccentric', 'Detached', 'Rebellious'], themes: ['Innovation', 'Community', 'Freedom'] },
  11: { strengths: ['Compassionate', 'Imaginative', 'Intuitive'], challenges: ['Escapist', 'Overly idealistic', 'Easily hurt'], themes: ['Spirituality', 'Compassion', 'Mysticism'] }
};

const PLANET_KEYWORDS = {
  sun: 'Core identity, vitality, ego, life purpose, authority',
  moon: 'Emotions, intuition, nurturing, needs, inner self',
  mercury: 'Thinking, communication, intellect, learning, adaptability',
  venus: 'Love, values, relationships, beauty, pleasure, money',
  mars: 'Drive, energy, passion, courage, aggression, action',
  jupiter: 'Expansion, wisdom, luck, optimism, growth, travel',
  saturn: 'Discipline, structure, limitation, responsibility, karma',
  uranus: 'Innovation, rebellion, freedom, change, originality',
  neptune: 'Spirituality, dreams, illusion, compassion, imagination',
  pluto: 'Transformation, power, rebirth, depth, destruction',
  rahu: 'Ambition, obsession, worldly desires, expansion, unconventional',
  ketu: 'Detachment, spirituality, past life wisdom, liberation, intuition'
};

const HOUSE_THEMES = [
  'Self, identity, appearance, vitality',
  'Money, possessions, self-worth, values',
  'Communication, siblings, local, early learning',
  'Home, family, roots, mother, emotional foundation',
  'Creativity, children, romance, self-expression, joy',
  'Health, work, daily routines, service, coworkers',
  'Partnerships, marriage, relationships, contracts',
  'Transformation, shared resources, sexuality, death/rebirth',
  'Higher learning, travel, philosophy, religion, luck',
  'Career, public image, status, authority, father',
  'Friends, groups, hopes, goals, community',
  'Solitude, spirituality, endings, subconscious, sacrifice'
];

const NAKSHATRA_INTERPRETATIONS = {
  Ashwini: 'Swift initiation, rapid healing, pioneering energy, horse-like vitality. Quick to start new ventures.',
  Bharani: 'Endurance through hardship, creative fertility, sacred sacrifice, practical manifestation.',
  Krittika: 'Sharp intelligence, surgical precision, cutting through illusion, fiery determination.',
  Rohini: 'Growth, nourishment, cultivation, fertility, gradual and beautiful unfolding.',
  Mrigashira: 'Searching curiosity, gentle exploration, restless seeking, deer-like sensitivity.',
  Ardra: 'Intense transformation through grief, emotional storm, powerful purifying tears.',
  Punarvasu: 'Restorative return, second chances, renewal, homecoming after wandering.',
  Pushya: 'Nurturing abundance, royal grace, deep nourishment, protective maternal care.',
  Ashlesha: 'Entwining roots, hypnotic attraction, serpent wisdom, deep psychological insight.',
  Magha: 'Royal authority, ancestral legacy, magnanimous leadership, crowning glory.',
  PurvaPhalguni: 'Creative enjoyment, sensual celebration, artistic expression, hospitality.',
  UttaraPhalguni: 'Marriage commitment, sacred union, fertile creativity, lasting legacy.',
  Hasta: 'Skilled craftsmanship, healing hands, practical magic, precise manual talent.',
  Chitra: 'Artistic brilliance, singular focus, gem-like clarity, architect of beauty.',
  Swati: 'Independence, gentle persistence, swaying flexibility, scattered wind dispersal.',
  Vishakha: 'Dual purpose, branching paths, determined pursuit, divided loyalties.',
  Anuradha: 'Loyal friendship, sustained effort, gradual rise, constellation devotion.',
  Jyeshtha: 'Senior authority, overcoming rivals, powerful protection, umbrella of influence.',
  Mula: 'Uprooting the old, destructive liberation, digging to roots, herbal knowledge.',
  PurvaAshadha: 'Powerful accumulation, hidden strength, watery depth, unshakable resolve.',
  UttaraAshadha: 'Final victory, universal power, invincible perseverance, mongoose cunning.',
  Shravana: 'Hearing knowledge, scholarly absorption, attentive listening, musical ear.',
  Dhanishta: 'Rhythmic drumbeat, swift success, lion pride, musical fame.',
  Shatabhisha: 'Healing hundred diseases, medicinal healing, rebellious reform, equine nobility.',
  PurvaBhadrapada: 'Dual-faced transformation, sacrificial wisdom, first step of liberation.',
  UttaraBhadrapada: 'Final liberation, serpentine wisdom, last stage of journey, completion.',
  Revati: 'Abundant nourishment, completion of cycle, fish-like multiplicity, final fruition.'
};

function interpretWesternPersonality(profile) {
  const w = profile.western;
  const p = SIGN_PERSONALITY[w.sun.signIdx];
  const moonStr = SIGN_PERSONALITY[w.moon.signIdx];
  const ascStr = SIGN_PERSONALITY[w.ascendant.signIdx];
  return {
    summary: `Your core identity (${w.sun.sign.en} ${w.sun.sign.symbol}) manifests through a ${p.themes.join(', ').toLowerCase()} lens. Your emotional world is shaped by ${w.moon.sign.en}'s ${moonStr.themes.join(', ').toLowerCase()}, and the world first meets you as a ${w.ascendant.sign.en} (${w.ascendant.sign.symbol}).`,
    personality: `${w.sun.sign.en} Sun gives you natural ${p.strengths[0].toLowerCase()} and ${p.strengths[1].toLowerCase()}. ${w.moon.sign.en} Moon creates a deeply ${moonStr.strengths[0].toLowerCase()} emotional nature. Your ${w.ascendant.sign.en} Ascendant projects an initial ${ascStr.strengths[0].toLowerCase()} first impression.`,
    mind: `With ${w.mercury.sign.en} Mercury ${w.mercury.house ? 'in House ' + w.mercury.house : ''}, your thinking style is ${SIGN_PERSONALITY[w.mercury.signIdx].strengths.join(', ').toLowerCase()}. Learning comes through ${SIGN_PERSONALITY[w.mercury.signIdx].themes[0].toLowerCase()}.`,
    emotions: `${w.moon.sign.en} Moon ${w.moon.house ? 'in House ' + w.moon.house : ''} rules your inner emotional life. You instinctively respond with ${moonStr.strengths.join(', ').toLowerCase()}. When stressed, watch for tendencies toward ${moonStr.challenges.join(', ').toLowerCase()}.`,
    relationships: `${w.venus.sign.en} Venus ${w.venus.house ? 'in House ' + w.venus.house : ''} describes how you love and what you value. ${SIGN_PERSONALITY[w.venus.signIdx].strengths.join(', ')} in partnerships.`,
    career: `${w.mars.sign.en} Mars fuels your action style, while your ${w.midheaven.sign.en} Midheaven suggests career themes of ${SIGN_PERSONALITY[w.midheaven.signIdx].themes.join(', ').toLowerCase()}. ${w.jupiter.sign.en} Jupiter brings expansion through ${SIGN_PERSONALITY[w.jupiter.signIdx].themes[0].toLowerCase()}.`,
    strengths: [...new Set([...p.strengths, ...ascStr.strengths, ...moonStr.strengths])].slice(0, 6),
    challenges: [...new Set([...p.challenges, ...ascStr.challenges, ...moonStr.challenges])].slice(0, 6),
    lifeThemes: [...new Set([...p.themes, ...moonStr.themes, ...SIGN_PERSONALITY[w.midheaven.signIdx].themes])].slice(0, 6)
  };
}

function interpretVedic(profile) {
  const v = profile.vedic;
  const nakInterp = NAKSHATRA_INTERPRETATIONS[v.nakshatra.en] || '';
  const currentDasha = v.dashas.current;
  return {
    summary: `Your Vedic chart begins with ${v.lagna.sign.en} Lagna (${v.lagna.sign.hi} लग्न), ruled by ${v.lagnaLord}. Your Janma Rashi is ${v.rashi.sign.en} (${v.rashi.sign.hi}), placing your Moon in ${v.nakshatra.en} Nakshatra (${v.nakshatra.hi}), Pada ${v.pada}.`,
    nakshatra: `${v.nakshatra.en} (${v.nakshatra.hi}) is ruled by ${v.nakshatra.lord}. Its nature is ${v.nakshatra.gana} gana with the ${v.nakshatra.animal.toLowerCase()} as its animal symbol. Core theme: ${nakInterp} Pada ${v.pada} emphasizes the ${v.pada === 1 ? 'initial expression and material manifestation' : v.pada === 2 ? 'inner processing and emotional depth' : v.pada === 3 ? 'interaction and relationship building' : 'final completion and spiritual realization'} quarter of this nakshatra's journey.`,
    lagna: `With ${v.lagna.sign.en} (${v.lagna.sign.hi}) as your Lagna, ruled by ${v.lagnaLord}, your physical constitution and life trajectory carry ${SIGN_PERSONALITY[v.lagna.signIdx].strengths.join(', ').toLowerCase()} qualities. ${SIGN_PERSONALITY[v.lagna.signIdx].themes.join(', ')} are central karmic themes.`,
    mahadasha: `Your current Mahadasha is ${currentDasha.planet} Dasha. Active from ${currentDasha.startDate.toLocaleDateString()} until ${currentDasha.endDate.toLocaleDateString()} (total ${currentDasha.years} years). ${PLANET_KEYWORDS[currentDasha.planet.toLowerCase()] || 'Significant life transformation.'}`,
    dashas: v.dashas.list
  };
}

function generateLifePeriods(profile) {
  const dashas = profile.vedic.dashas.list;
  const now = new Date();
  const periods = [];
  const themes = {
    Sun: { career: 85, money: 70, relationships: 60, growth: 75 },
    Moon: { career: 55, money: 50, relationships: 85, growth: 70 },
    Mars: { career: 80, money: 55, relationships: 65, growth: 85 },
    Rahu: { career: 90, money: 85, relationships: 45, growth: 70 },
    Jupiter: { career: 75, money: 90, relationships: 80, growth: 95 },
    Saturn: { career: 70, money: 65, relationships: 50, growth: 60 },
    Mercury: { career: 75, money: 80, relationships: 75, growth: 80 },
    Ketu: { career: 45, money: 40, relationships: 55, growth: 90 },
    Venus: { career: 65, money: 80, relationships: 95, growth: 85 }
  };

  for (let i = 0; i < Math.min(dashas.length, 9); i++) {
    const d = dashas[i];
    const t = themes[d.planet] || { career: 60, money: 60, relationships: 60, growth: 60 };
    let category = 'future';
    if (d.endDate < now) category = 'past';
    else if (d.startDate <= now && d.endDate > now) category = 'current';
    const overall = Math.round((t.career + t.money + t.relationships + t.growth) / 4);
    periods.push({
      period: category,
      planet: d.planet,
      years: d.years,
      startDate: d.startDate,
      endDate: d.endDate,
      theme: `${d.planet} Mahadasha: ${PLANET_KEYWORDS[d.planet.toLowerCase()] || 'Major life transformation'}`,
      career: t.career,
      money: t.money,
      relationships: t.relationships,
      growth: t.growth,
      intensity: overall,
      isPeak: overall >= 78,
      isChallenge: overall <= 55
    });
  }
  return periods;
}

/* ========================================================================== */
/*                    KUNDALI MILAN / COMPATIBILITY ENGINE                     */
/* ========================================================================== */

const VARNA_VALUES = { 0: 4, 1: 3, 2: 3, 3: 4, 4: 1, 5: 3, 6: 2, 7: 1, 8: 2, 9: 1, 10: 1, 11: 2 };

function calcVarnaKoot(rashi1Idx, rashi2Idx) {
  const v1 = VARNA_VALUES[rashi1Idx];
  const v2 = VARNA_VALUES[rashi2Idx];
  return v1 >= v2 ? 1 : 0;
}

const VASHYA_CLASSES = {
  0: 'Chatushpada', 1: 'Chatushpada', 2: 'Nara',
  3: 'Jalachara', 4: 'Mushya', 5: 'Nara',
  6: 'Nara', 7: 'Keeta', 8: 'Manava',
  9: 'Chatushpada', 10: 'Nara', 11: 'Jalachara'
};

function calcVashyaKoot(r1, r2) {
  const c1 = VASHYA_CLASSES[r1], c2 = VASHYA_CLASSES[r2];
  if (c1 === c2) return 2;
  const pairs = [['Chatushpada', 'Mushya'], ['Nara', 'Manava'], ['Jalachara', 'Chatushpada']];
  for (const p of pairs) if ((p[0] === c1 && p[1] === c2) || (p[1] === c1 && p[0] === c2)) return 1;
  return 0;
}

function calcTaraKoot(nak1, nak2) {
  const count = ((nak2 - nak1 + 27) % 27) + 1;
  const tara = ((count - 1) % 9) + 1;
  if ([1, 2, 4, 6, 8].includes(tara)) return 3;
  if ([3, 5, 7].includes(tara)) return 1.5;
  return 0;
}

const YONI_PAIRS = {
  'Horse-Elephant': 0, 'Horse-Sheep': 0, 'Horse-Snake': 3, 'Horse-Dog': 1, 'Horse-Cat': 3,
  'Horse-Rat': 0, 'Horse-Cow': 0, 'Horse-Buffalo': 0, 'Horse-Tiger': 0, 'Horse-Deer': 2,
  'Horse-Monkey': 1, 'Horse-Mongoose': 0, 'Horse-Lion': 0,
  'Elephant-Sheep': 2, 'Elephant-Snake': 2, 'Elephant-Dog': 3, 'Elephant-Cat': 2,
  'Elephant-Rat': 0, 'Elephant-Cow': 2, 'Elephant-Buffalo': 2, 'Elephant-Tiger': 3,
  'Elephant-Deer': 1, 'Elephant-Monkey': 0, 'Elephant-Mongoose': 0, 'Elephant-Lion': 0,
  'Sheep-Snake': 0, 'Sheep-Dog': 0, 'Sheep-Cat': 0, 'Sheep-Rat': 0,
  'Sheep-Cow': 4, 'Sheep-Buffalo': 4, 'Sheep-Tiger': 0, 'Sheep-Deer': 0,
  'Sheep-Monkey': 0, 'Sheep-Mongoose': 0, 'Sheep-Lion': 0,
  'Snake-Dog': 0, 'Snake-Cat': 3, 'Snake-Rat': 4, 'Snake-Cow': 0,
  'Snake-Buffalo': 0, 'Snake-Tiger': 1, 'Snake-Deer': 1, 'Snake-Monkey': 0,
  'Snake-Mongoose': 0, 'Snake-Lion': 1,
  'Dog-Cat': 0, 'Dog-Rat': 2, 'Dog-Cow': 2, 'Dog-Buffalo': 2,
  'Dog-Tiger': 0, 'Dog-Deer': 0, 'Dog-Monkey': 0, 'Dog-Mongoose': 0, 'Dog-Lion': 0,
  'Cat-Rat': 0, 'Cat-Cow': 2, 'Cat-Buffalo': 2, 'Cat-Tiger': 3,
  'Cat-Deer': 1, 'Cat-Monkey': 0, 'Cat-Mongoose': 0, 'Cat-Lion': 1,
  'Rat-Cow': 4, 'Rat-Buffalo': 4, 'Rat-Tiger': 0, 'Rat-Deer': 0,
  'Rat-Monkey': 0, 'Rat-Mongoose': 0, 'Rat-Lion': 0,
  'Cow-Buffalo': 4, 'Cow-Tiger': 3, 'Cow-Deer': 2, 'Cow-Monkey': 1,
  'Cow-Mongoose': 1, 'Cow-Lion': 0,
  'Buffalo-Tiger': 0, 'Buffalo-Deer': 0, 'Buffalo-Monkey': 0,
  'Buffalo-Mongoose': 0, 'Buffalo-Lion': 0,
  'Tiger-Deer': 2, 'Tiger-Monkey': 1, 'Tiger-Mongoose': 0, 'Tiger-Lion': 1,
  'Deer-Monkey': 3, 'Deer-Mongoose': 0, 'Deer-Lion': 3,
  'Monkey-Mongoose': 0, 'Monkey-Lion': 0, 'Mongoose-Lion': 0
};

function calcYoniKoot(a1, a2) {
  const key1 = `${a1}-${a2}`, key2 = `${a2}-${a1}`;
  if (a1 === a2) return 4;
  return YONI_PAIRS[key1] ?? YONI_PAIRS[key2] ?? 1;
}

const FRIENDLY_PLANETS = {
  Sun: ['Moon', 'Mars', 'Jupiter'], Moon: ['Sun', 'Mercury'], Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'], Jupiter: ['Sun', 'Moon', 'Mars'], Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'], Rahu: ['Venus', 'Saturn'], Ketu: ['Mars', 'Jupiter']
};

function calcGrahaMaitri(lord1, lord2) {
  if (lord1 === lord2) return 5;
  if (FRIENDLY_PLANETS[lord1]?.includes(lord2) && FRIENDLY_PLANETS[lord2]?.includes(lord1)) return 4;
  if (FRIENDLY_PLANETS[lord1]?.includes(lord2) || FRIENDLY_PLANETS[lord2]?.includes(lord1)) return 3;
  if (FRIENDLY_PLANETS[lord1]?.length && FRIENDLY_PLANETS[lord2]?.length) return 1.5;
  return 0.5;
}

function calcGanaKoot(gana1, gana2) {
  if (gana1 === gana2) return 6;
  if (gana1 === 'Deva' && gana2 === 'Manushya') return 5;
  if (gana1 === 'Manushya' && gana2 === 'Deva') return 5;
  if (gana1 === 'Manushya' && gana2 === 'Rakshasa') return 4;
  if (gana1 === 'Rakshasa' && gana2 === 'Manushya') return 4;
  return 0;
}

function calcBhakootKoot(r1, r2) {
  const diff = Math.abs(r1 - r2);
  const bad = [6, 8, 12];
  if (bad.includes(diff) || bad.includes(12 - diff)) return 0;
  const good = [1, 2, 3, 4, 5, 7, 9, 10, 11];
  return good.includes(diff) || good.includes(12 - diff) ? 7 : 3.5;
}

function calcNadiKoot(nak1Idx, nak2Idx) {
  const nadiOf = (i) => i < 9 ? 'Adi' : i < 18 ? 'Madhya' : 'Antya';
  if (nadiOf(nak1Idx) !== nadiOf(nak2Idx)) return 8;
  return 0;
}

function calcKundaliMilan(profile1, profile2) {
  const r1 = profile1.vedic.rashi.signIdx;
  const r2 = profile2.vedic.rashi.signIdx;
  const nak1 = profile1.vedic.nakshatraIdx;
  const nak2 = profile2.vedic.nakshatraIdx;
  const lord1 = profile1.vedic.rashiLord;
  const lord2 = profile2.vedic.rashiLord;
  const gana1 = profile1.vedic.nakshatra.gana;
  const gana2 = profile2.vedic.nakshatra.gana;
  const yoni1 = profile1.vedic.nakshatra.animal;
  const yoni2 = profile2.vedic.nakshatra.animal;

  const kootas = [
    { name: 'Varna', en: 'Varna', hi: 'वर्ण', points: calcVarnaKoot(r1, r2), max: 1 },
    { name: 'Vashya', en: 'Vashya', hi: 'वश्य', points: calcVashyaKoot(r1, r2), max: 2 },
    { name: 'Tara', en: 'Tara', hi: 'तारा', points: calcTaraKoot(nak1, nak2), max: 3 },
    { name: 'Yoni', en: 'Yoni', hi: 'योनि', points: calcYoniKoot(yoni1, yoni2), max: 4 },
    { name: 'Graha Maitri', en: 'Graha Maitri', hi: 'ग्रह मैत्री', points: calcGrahaMaitri(lord1, lord2), max: 5 },
    { name: 'Gana', en: 'Gana', hi: 'गण', points: calcGanaKoot(gana1, gana2), max: 6 },
    { name: 'Bhakoot', en: 'Bhakoot', hi: 'भकूट', points: calcBhakootKoot(r1, r2), max: 7 },
    { name: 'Nadi', en: 'Nadi', hi: 'नाड़ी', points: calcNadiKoot(nak1, nak2), max: 8 }
  ];
  const total = kootas.reduce((s, k) => s + k.points, 0);
  const maxTotal = 36;
  const pct = Math.round((total / maxTotal) * 100);

  return {
    kootas,
    totalPoints: total,
    maxPoints: maxTotal,
    percentage: pct,
    verdict: pct >= 28 ? 'Excellent compatibility' : pct >= 22 ? 'Good compatibility' : pct >= 16 ? 'Moderate compatibility' : 'Challenging compatibility'
  };
}

/* ========================================================================== */
/*                           APP CONTROLLER / UI RENDERER                      */
/* ========================================================================== */

class AppController {
  constructor() {
    this.i18n = new I18NService();
    this.profile = null;
    this.compatProfile = null;
    this.groom = null;
    this.bride = null;
    this.cache = {};
  }

  t(key) { return this.i18n.t(key); }

  setLang(lang) {
    if (!I18N[lang]) return;
    this.i18n.setLang(lang);
    applyLanguage(lang);
  }

  persist(key, data) {
    try { localStorage.setItem('dn_' + key, JSON.stringify(data)); } catch (e) {}
  }
  restore(key) {
    try { const v = localStorage.getItem('dn_' + key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }

  createProfile(input) {
    this.profile = new BirthProfile(input);
    this.persist('profile', input);
    return this.profile;
  }

  calcNumerology(name, dobStr, day) {
    return NumerologyService.calcAll(name, dobStr, day);
  }

  generateLifePeriods() {
    return generateLifePeriods(this.profile);
  }

  kundaliMilan(groomInput, brideInput) {
    this.groom = new BirthProfile(groomInput);
    this.bride = new BirthProfile(brideInput);
    return calcKundaliMilan(this.groom, this.bride);
  }

  compatibilityMarriage(p1Input, p2Input) {
    const p1 = new BirthProfile(p1Input);
    const p2 = new BirthProfile(p2Input);
    const milan = calcKundaliMilan(p1, p2);
    const moonSame = p1.vedic.rashi.signIdx === p2.vedic.rashi.signIdx;
    const nakComp = p1.vedic.nakshatra.gana === p2.vedic.nakshatra.gana;
    return {
      kundaliMilan: milan,
      emotional: Math.round(50 + milan.kootas[1].points * 10 + milan.kootas[7].points * 2.5 + (moonSame ? 10 : 0)),
      communication: Math.round(50 + milan.kootas[2].points * 8 + milan.kootas[4].points * 4),
      marriage: milan.percentage,
      lifestyle: Math.round(50 + milan.kootas[5].points * 4 + milan.kootas[0].points * 10 + (nakComp ? 10 : 0)),
      financial: Math.round(50 + milan.kootas[3].points * 5 + milan.kootas[6].points * 2),
      attraction: Math.round(55 + milan.kootas[3].points * 8 + milan.kootas[4].points * 2),
      mental: Math.round(50 + milan.kootas[2].points * 6 + milan.kootas[4].points * 5),
      longTerm: Math.round(45 + milan.kootas[6].points * 3 + milan.kootas[7].points * 1.5 + milan.kootas[5].points * 2),
      overall: milan.percentage
    };
  }

  render() { applyLanguage(this.i18n.lang); }
}

const App = new AppController();
window.DestinyApp = App;

/* ========================================================================== */
/*                          PAGE UI CONTROLLER                                  */
/* ========================================================================== */

let livePulseInterval = null;
let transitionTimer = null;

function showCalculationTransition(onComplete) {
  const overlay = document.getElementById('calculationTransition');
  const progress = document.getElementById('transitionProgressBar');
  const countdown = document.getElementById('transitionCountdown');
  const message = document.getElementById('transitionMessage');
  if (!overlay || !progress || !countdown || !message) { onComplete(); return; }
  const messages = [
    'Converting birth details into celestial coordinates...',
    'Calculating tropical planetary positions...',
    'Applying Lahiri sidereal ayanamsa...',
    'Mapping your Moon, Rashi and Nakshatra...',
    'Preparing your personal dashboard...'
  ];
  let elapsed = 0;
  overlay.classList.remove('hidden');
  document.body.classList.add('transition-open');
  progress.style.width = '0%';
  countdown.textContent = '10';
  message.textContent = messages[0];
  transitionTimer = setInterval(() => {
    elapsed += 1;
    progress.style.width = `${elapsed * 10}%`;
    countdown.textContent = String(Math.max(0, 10 - elapsed));
    message.textContent = messages[Math.min(messages.length - 1, Math.floor(elapsed / 2))];
    if (elapsed >= 10) {
      clearInterval(transitionTimer);
      transitionTimer = null;
      overlay.classList.add('hidden');
      document.body.classList.remove('transition-open');
      onComplete();
    }
  }, 1000);
}

function applyLanguage(lang = App.i18n.lang) {
  const t = key => I18N[lang][key] || I18N.en[key] || key;
  const navKeys = {
    sectionDashboard: 'navHome', sectionCosmic: 'navCosmic', sectionWestern: 'navWestern',
    sectionVedic: 'navVedic', sectionInfluences: 'navInfluences', sectionPeriods: 'navMajorPeriods',
    sectionPeakPeriods: 'navPeak', sectionChallengePeriods: 'navChallenge',
    sectionMarriageCompat: 'navMarriageComp', sectionKundaliMilan: 'navKundaliMilan',
    sectionNumerology: 'navNumerology', sectionMonsterTattoo: 'navMonster', sectionReports: 'navReports'
  };
  document.querySelectorAll('.tab-pill[data-section]').forEach(button => {
    const key = navKeys[button.dataset.section];
    if (key) button.textContent = t(key);
  });
  const fieldKeys = { userName: 'nameLabel', userDob: 'dobLabel', userTob: 'tobLabel', userPob: 'pobLabel' };
  Object.entries(fieldKeys).forEach(([id, key]) => {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) label.textContent = t(key);
  });
  const submit = document.querySelector('#calculateSubmitBtn span');
  if (submit) submit.textContent = t('submitBtn');
  document.querySelectorAll('[data-lang]').forEach(button => button.classList.toggle('active', button.dataset.lang === lang));
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
}

function validateKundaliUpload(input) {
  if (!input || !input.files.length) return true;
  const file = input.files[0];
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) {
    alert('Kundali upload must be a JPG, PNG, or PDF smaller than 10 MB.');
    input.value = '';
    return false;
  }
  return true;
}

function normalizeBirthDate(value) {
  const raw = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!match) return '';
  return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

function setBirthDateError(message = '') {
  const input = document.getElementById('userDob');
  const error = document.getElementById('userDobError');
  if (input) input.setCustomValidity(message);
  if (error) {
    error.textContent = message;
    error.classList.toggle('hidden', !message);
  }
}

function setPlaceError(message = '') {
  const input = document.getElementById('userPob');
  const error = document.getElementById('userPobError');
  if (input) input.setCustomValidity(message);
  if (error) {
    error.textContent = message;
    error.classList.toggle('hidden', !message);
  }
}

function setContactError(id, message = '') {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  if (input) input.setCustomValidity(message);
  if (error) {
    error.textContent = message;
    error.classList.toggle('hidden', !message);
  }
}

function showProphecyIntro() {
  document.getElementById('prophecyIntro')?.classList.remove('hidden');
  document.getElementById('onboardingSection')?.classList.add('hidden');
  document.body.classList.add('intro-mode');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showProphecyForm(pushState = true) {
  const intro = document.getElementById('prophecyIntro');
  const form = document.getElementById('onboardingSection');
  if (!intro || !form) return;
  intro.classList.add('intro-exit');
  document.body.classList.add('transition-open');
  window.setTimeout(() => {
    intro.classList.add('hidden');
    intro.classList.remove('intro-exit');
    form.classList.remove('hidden');
    document.body.classList.remove('intro-mode', 'transition-open');
    if (pushState) history.pushState({ prophecy: true }, '', `${window.location.pathname}#get-started`);
    document.getElementById('userName')?.focus();
  }, 650);
}

function dismissOpeningSplash(immediate = false) {
  const splash = document.getElementById('openingSplash');
  if (!splash || splash.dataset.done === '1') return;
  splash.dataset.done = '1';
  document.body.classList.remove('splash-open');
  if (immediate) {
    splash.classList.add('hidden');
    return;
  }
  splash.classList.add('is-exiting');
  const finish = () => splash.classList.add('hidden');
  splash.addEventListener('animationend', (event) => {
    if (event.target === splash) finish();
  });
  window.setTimeout(finish, 800);
}

function initOpeningSplash() {
  const splash = document.getElementById('openingSplash');
  if (!splash) return;
  document.body.classList.add('splash-open');
  const timer = window.setTimeout(() => dismissOpeningSplash(), 5000);
  document.getElementById('skipSplashBtn')?.addEventListener('click', () => {
    window.clearTimeout(timer);
    dismissOpeningSplash();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initOpeningSplash();
  const restoredInput = App.restore('profile');
  if (restoredInput && document.getElementById('userName')) {
    document.getElementById('userName').value = restoredInput.name || '';
    document.getElementById('userDob').value = restoredInput.dob || '';
    document.getElementById('userTob').value = restoredInput.tob || '12:00';
    document.getElementById('userPob').value = restoredInput.pob || '';
    document.getElementById('userPhone').value = restoredInput.phone || '';
    document.getElementById('userEmail').value = restoredInput.email || '';
  }

  document.body.classList.add('intro-mode');
  document.getElementById('enterProphecyBtn')?.addEventListener('click', () => showProphecyForm());
  window.addEventListener('popstate', () => showProphecyIntro());
  window.addEventListener('hashchange', () => {
    if (!window.location.hash) showProphecyIntro();
  });

  const langBtns = document.querySelectorAll('[data-lang]');
  langBtns.forEach(btn => btn.addEventListener('click', () => App.setLang(btn.dataset.lang)));
  applyLanguage();

  const astrologyForm = document.getElementById('astrologyForm');
  if (astrologyForm) {
    astrologyForm.addEventListener('submit', handleMainSubmit);
    const dobInput = document.getElementById('userDob');
    if (dobInput) dobInput.addEventListener('input', () => setBirthDateError());
    const placeInput = document.getElementById('userPob');
    if (placeInput) placeInput.addEventListener('input', () => setPlaceError());
    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) phoneInput.addEventListener('input', () => setContactError('userPhone'));
    const emailInput = document.getElementById('userEmail');
    if (emailInput) emailInput.addEventListener('input', () => setContactError('userEmail'));
  }

  const kundaliForm = document.getElementById('kundaliForm');
  if (kundaliForm) kundaliForm.addEventListener('submit', handleKundaliSubmit);

  const compatForm = document.getElementById('compatForm');
  if (compatForm) compatForm.addEventListener('submit', handleCompatSubmit);

  const resetButton = document.getElementById('navResetBtn');
  if (resetButton) resetButton.addEventListener('click', resetReading);

  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSection();
  });
});

function resetReading() {
  if (livePulseInterval) clearInterval(livePulseInterval);
  if (transitionTimer) clearInterval(transitionTimer);
  transitionTimer = null;
  document.getElementById('calculationTransition')?.classList.add('hidden');
  document.body.classList.remove('transition-open');
  closeSection();
  App.profile = null;
  document.getElementById('resultsContainer').classList.add('hidden');
  document.getElementById('mainNav').classList.add('hidden');
  showProphecyIntro();
  document.getElementById('astrologyForm').reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(sectionId) {
  document.querySelectorAll('[data-role="page-section"]').forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('popup-panel');
  });
  const el = document.getElementById(sectionId);
  if (!el) return;
  let closeButton = el.querySelector(':scope > .popup-close');
  if (!closeButton) {
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'popup-close';
    closeButton.setAttribute('aria-label', 'Close popup');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', closeSection);
    el.prepend(closeButton);
  }
  el.classList.remove('hidden');
  el.classList.add('popup-panel');
  document.body.classList.add('popup-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('[data-section]').forEach(b => {
    if (b.dataset.section === sectionId) b.classList.add('active');
    else b.classList.remove('active');
  });
}

function closeSection() {
  const open = document.querySelector('.popup-panel');
  if (open) {
    open.classList.add('hidden');
    open.classList.remove('popup-panel');
  }
  document.body.classList.remove('popup-open');
  document.querySelectorAll('.tab-pill').forEach(button => button.classList.remove('active'));
}

async function handleMainSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('userName');
  const name = nameInput.value.trim();
  const dobInput = document.getElementById('userDob');
  const dob = normalizeBirthDate(dobInput.value);
  const tob = document.getElementById('userTob').value;
  const placeInput = document.getElementById('userPob');
  const pob = placeInput.value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  if (!name) {
    setContactError('userName', 'Please enter your full name.');
    nameInput.focus();
    return;
  }
  setContactError('userName');
  if (!dob) {
    setBirthDateError('Please select a valid date of birth.');
    dobInput.focus();
    return;
  }
  setBirthDateError();
  if (!pob) {
    setPlaceError('Please enter your city and country of birth.');
    placeInput.focus();
    return;
  }
  setPlaceError();
  if (!/^\+?[0-9][0-9\s().-]{7,19}$/.test(phone) || phone.replace(/\D/g, '').length < 8) {
    setContactError('userPhone', 'Please enter a valid phone number.');
    document.getElementById('userPhone').focus();
    return;
  }
  setContactError('userPhone');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setContactError('userEmail', 'Please enter a valid email address.');
    document.getElementById('userEmail').focus();
    return;
  }
  setContactError('userEmail');

  let resolvedPlace;
  try {
    resolvedPlace = await resolvePlaceOnline(pob);
  } catch (error) {
    if (error.message && error.message.toLowerCase().includes('birthplace')) {
      setPlaceError(error.message);
      placeInput.focus();
    } else alert(error.message || "We couldn't calculate your chart. Please verify your birth details and try again.");
    return;
  }
  let profile;
  try {
    profile = App.createProfile({ name, dob, tob, pob, phone, email, resolvedPlace });
  } catch (error) {
    alert(error.message || "We couldn't calculate your chart. Please verify your birth details and try again.");
    return;
  }
  const numerology = App.calcNumerology(name, dob, profile.day);
  const lifePeriods = App.generateLifePeriods();
  const westernInterp = interpretWesternPersonality(profile);
  const vedicInterp = interpretVedic(profile);
  const monster = MONSTERS_DB[profile.month] || MONSTERS_DB[1];
  const tattoo = TATTOOS_DB[profile.day] || TATTOOS_DB[1];

  showCalculationTransition(() => {
    renderDashboard(profile, numerology, westernInterp, vedicInterp);
    renderCosmicProfile(profile, westernInterp, vedicInterp);
    renderWesternSection(profile, westernInterp);
    renderVedicSection(profile, vedicInterp);
    renderNumerologySection(profile, numerology);
    renderPeriodsSection(profile, lifePeriods);
    renderPeakChallengeSections(lifePeriods);
    renderInfluencesSection(profile, westernInterp, vedicInterp);
    renderMonsterTattooSection(profile, monster, tattoo);
    renderQuickStats(profile);
    document.getElementById('onboardingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('mainNav').classList.remove('hidden');
    document.getElementById('navResetBtn').classList.remove('hidden');
    showSection('sectionDashboard');
  });
}

function renderDashboard(p, num, wInterp, vInterp) {
  document.getElementById('welcomeName').textContent = `${App.t('welcome')}, ${p.name}!`;
  document.getElementById('dashSunSign').textContent = `${p.western.sun.sign.symbol} ${p.western.sun.sign.en}`;
  document.getElementById('dashMoonSign').textContent = `${p.western.moon.sign.symbol} ${p.western.moon.sign.en}`;
  document.getElementById('dashRising').textContent = `${p.western.ascendant.sign.symbol} ${p.western.ascendant.sign.en}`;
  document.getElementById('dashRashi').textContent = `${p.vedic.rashi.sign.symbol} ${p.vedic.rashi.sign.en}`;
  document.getElementById('dashNakshatra').textContent = `⭐ ${p.vedic.nakshatra.en}`;
  document.getElementById('dashLagna').textContent = `${p.vedic.lagna.sign.symbol} ${p.vedic.lagna.sign.en}`;
  document.getElementById('dashLifePath').textContent = `${num.lifePath} • ${NumerologyService.meaning(num.lifePath).en.split('.')[0]}`;
  document.getElementById('dashMahadasha').textContent = `${vInterp.mahadasha.split('.')[0]}`;
  const periods = App.generateLifePeriods();
  const cur = periods.find(x => x.period === 'current');
  if (cur) {
    document.getElementById('dashPhase').textContent = `${cur.planet} Dasha • ${cur.intensity}% intensity`;
  }
  const peak = periods.find(x => x.period === 'future' && x.isPeak) || periods.find(x => x.isPeak);
  if (peak) {
    document.getElementById('dashPeak').textContent = `${peak.planet} Period (${peak.startDate.getFullYear()}-${peak.endDate.getFullYear()})`;
  }
  const ch = periods.find(x => x.period === 'future' && x.isChallenge);
  document.getElementById('dashChallenge').textContent = ch ? `${ch.planet} (${ch.startDate.getFullYear()})` : 'No major challenges flagged';
  document.getElementById('dashRashiTag').textContent = `Rashi: ${p.vedic.rashi.sign.en}`;
  document.getElementById('dashNakTag').textContent = `Nakshatra: ${p.vedic.nakshatra.en}`;
  document.getElementById('dashLagnaTag').textContent = `Lagna: ${p.vedic.lagna.sign.en}`;
  const [y, m, d] = p.dobStr.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  document.getElementById('dashMeta').textContent = `Born ${monthNames[m - 1]} ${d}, ${y} • ${p.tobStr || '12:00'} • ${p.pobStr}`;
  document.getElementById('dashInitial').textContent = p.name.charAt(0).toUpperCase();
  document.getElementById('dashSymbol').textContent = p.western.sun.sign.symbol;
}

function renderQuickStats(p) {
  const today = new Date();
  const [y, m, d] = p.dobStr.split('-').map(Number);
  const bDate = new Date(y, m - 1, d);
  let age = today.getFullYear() - y;
  if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) age--;
  const diffDays = Math.floor(Math.abs(today - bDate) / (1000 * 60 * 60 * 24));
  let nextB = new Date(today.getFullYear(), m - 1, d);
  if (today > nextB) nextB.setFullYear(today.getFullYear() + 1);
  const daysToNext = Math.ceil((nextB - today) / (1000 * 60 * 60 * 24));
  document.getElementById('qsAge').textContent = `${age} Years`;
  document.getElementById('qsDays').textContent = diffDays.toLocaleString();
  document.getElementById('qsNextBday').textContent = `In ${daysToNext} Days`;
  if (livePulseInterval) clearInterval(livePulseInterval);
  let extra = 0;
  const update = () => {
    extra++;
    const cd = diffDays + extra / 86400;
    document.getElementById('qsHeartbeats').textContent = Math.floor(cd * 24 * 60 * 75).toLocaleString();
  };
  update();
  livePulseInterval = setInterval(update, 1000);
}

function renderCosmicProfile(p, wInt, vInt) {
  const w = p.western, v = p.vedic;
  document.getElementById('cpWSun').textContent = `${w.sun.sign.symbol} ${w.sun.sign.en} (${Math.round(w.sun.degree * 10) / 10}° House ${w.sun.house})`;
  document.getElementById('cpWMoon').textContent = `${w.moon.sign.symbol} ${w.moon.sign.en} (${Math.round(w.moon.degree * 10) / 10}° House ${w.moon.house})`;
  document.getElementById('cpWAsc').textContent = `${w.ascendant.sign.symbol} ${w.ascendant.sign.en} (${formatLongitude(w.ascendant.long)})`;
  document.getElementById('cpVRashi').textContent = `${v.rashi.sign.symbol} ${v.rashi.sign.en} (${v.rashi.sign.hi})`;
  document.getElementById('cpVNak').textContent = `⭐ ${v.nakshatra.en} (${v.nakshatra.hi})`;
  document.getElementById('cpVPada').textContent = `🔹 Pada ${v.pada} / 4`;
  document.getElementById('cpVLagna').textContent = `${v.lagna.sign.symbol} ${v.lagna.sign.en} (${v.lagna.sign.hi} लग्न, ${formatLongitude(v.lagna.long)})`;
  document.getElementById('cpSystemExplain').textContent = `Western Astrology uses the Tropical zodiac, tied to the solstices/equinoxes (aligning Sun in Aries on March 21). Vedic Astrology uses the Sidereal zodiac, accounting for the Earth's precessional wobble (Lahiri Ayanamsa: ${v.ayanamsa.toFixed(2)}° offset). This means your Vedic Rashi is typically ~1 sign earlier than your Western Sun sign.`;
}

function renderWesternSection(p, wInt) {
  const w = p.western;
  const signEn = s => `${s.sign.symbol} ${s.sign.en}`;
  const degEn = s => `${Math.round(s.degree * 10) / 10}°`;
  const rows = [
    { name: '☀ Sun (Surya)', signIdx: w.sun.signIdx, p: w.sun, kw: PLANET_KEYWORDS.sun },
    { name: '🌙 Moon (Chandra)', signIdx: w.moon.signIdx, p: w.moon, kw: PLANET_KEYWORDS.moon },
    { name: '⬆ Ascendant / Rising', signIdx: w.ascendant.signIdx, p: w.ascendant, kw: 'How others perceive you, your initial approach to life' },
    { name: '☿ Mercury (Budha)', signIdx: w.mercury.signIdx, p: w.mercury, kw: PLANET_KEYWORDS.mercury },
    { name: '♀ Venus (Shukra)', signIdx: w.venus.signIdx, p: w.venus, kw: PLANET_KEYWORDS.venus },
    { name: '♂ Mars (Mangal)', signIdx: w.mars.signIdx, p: w.mars, kw: PLANET_KEYWORDS.mars },
    { name: '♃ Jupiter (Guru)', signIdx: w.jupiter.signIdx, p: w.jupiter, kw: PLANET_KEYWORDS.jupiter },
    { name: '♄ Saturn (Shani)', signIdx: w.saturn.signIdx, p: w.saturn, kw: PLANET_KEYWORDS.saturn },
    { name: '♅ Uranus', signIdx: w.uranus.signIdx, p: w.uranus, kw: PLANET_KEYWORDS.uranus },
    { name: '♆ Neptune', signIdx: w.neptune.signIdx, p: w.neptune, kw: PLANET_KEYWORDS.neptune },
    { name: '♇ Pluto', signIdx: w.pluto.signIdx, p: w.pluto, kw: PLANET_KEYWORDS.pluto }
  ];
  const tb = document.getElementById('westernTableBody');
  tb.innerHTML = rows.map(r => {
    const sp = SIGN_PERSONALITY[r.signIdx];
    return `<tr><td style="font-weight:700;color:#fff;">${r.name}</td><td style="color:var(--color-gold);font-weight:600;">${signEn(r.p)}<br/><small style="opacity:.7">${degEn(r.p)} · House ${r.p.house}</small></td><td style="color:var(--color-cyan);">${sp.strengths.join(', ')}</td><td>${r.kw}</td></tr>`;
  }).join('');
  document.getElementById('westernPersonality').innerHTML = `<strong>Summary.</strong> ${wInt.personality}`;
  document.getElementById('westernMind').innerHTML = `<strong>Mind & Intellect.</strong> ${wInt.mind}`;
  document.getElementById('westernEmotions').innerHTML = `<strong>Emotions.</strong> ${wInt.emotions}`;
  document.getElementById('westernRelationships').innerHTML = `<strong>Love & Relationships.</strong> ${wInt.relationships}`;
  document.getElementById('westernCareer').innerHTML = `<strong>Career & Life Path.</strong> ${wInt.career}`;
  document.getElementById('westernStrengths').innerHTML = wInt.strengths.map(s => `<span class="pill pill-gold">${s}</span>`).join('');
  document.getElementById('westernChallenges').innerHTML = wInt.challenges.map(c => `<span class="pill pill-magenta">${c}</span>`).join('');
  document.getElementById('westernThemes').innerHTML = wInt.lifeThemes.map(t => `<span class="pill pill-cyan">${t}</span>`).join('');
}

function renderVedicSection(p, vInt) {
  const v = p.vedic;
  const signEn = s => `${s.sign.symbol} ${s.sign.en} (${s.sign.hi})`;
  const rows = [
    { name: '☀ Surya (Sun)', pl: v.sun, kw: 'Soul, vitality, father, authority' },
    { name: '🌙 Chandra (Moon)', pl: v.moon, kw: 'Mind, emotions, mother, popularity' },
    { name: '♂ Mangal (Mars)', pl: v.mars, kw: 'Courage, property, energy, passion' },
    { name: '☿ Budha (Mercury)', pl: v.mercury, kw: 'Intellect, business, logic, speech' },
    { name: '♃ Guru (Jupiter)', pl: v.jupiter, kw: 'Wisdom, dharma, wealth, fortune' },
    { name: '♀ Shukra (Venus)', pl: v.venus, kw: 'Love, luxury, art, spouse' },
    { name: '♄ Shani (Saturn)', pl: v.saturn, kw: 'Karma, discipline, delay, legacy' },
    { name: '☊ Rahu (North Node)', pl: v.rahu, kw: 'Ambition, obsession, worldly expansion' },
    { name: '☋ Ketu (South Node)', pl: v.ketu, kw: 'Detachment, moksha, past-life wisdom' }
  ];
  const tb = document.getElementById('vedicTableBody');
  tb.innerHTML = rows.map(r => `<tr><td style="font-weight:700;color:#fff;">${r.name}</td><td style="color:var(--color-gold);font-weight:600;">${signEn(r.pl)}<br/><small style="opacity:.7">${Math.round(r.pl.degree * 10) / 10}° · Bhava ${r.pl.house}</small></td><td style="color:var(--color-cyan);">Lord: ${VEDIC_RASHI_LORDS[r.pl.signIdx]}</td><td>${r.kw}</td></tr>`).join('');
  document.getElementById('vLagna').textContent = `${signEn(v.lagna)} · ${formatLongitude(v.lagna.long)}`;
  document.getElementById('vLagnaLord').textContent = v.lagnaLord;
  document.getElementById('vRashi').textContent = signEn(v.rashi);
  document.getElementById('vRashiLord').textContent = v.rashiLord;
  document.getElementById('vNakshatra').textContent = `${v.nakshatra.en} (${v.nakshatra.hi}) · Pada ${v.pada}`;
  document.getElementById('vNakshatraLord').textContent = `Lord: ${v.nakshatra.lord} · Gana: ${v.nakshatra.gana} · Animal: ${v.nakshatra.animal}`;
  document.getElementById('vMahadasha').textContent = vInt.mahadasha;
  document.getElementById('vNakInterp').innerHTML = `<strong>${v.nakshatra.en} (${v.nakshatra.hi}).</strong> ${vInt.nakshatra}`;
  document.getElementById('vLagnaInterp').innerHTML = `<strong>Lagna Analysis.</strong> ${vInt.lagna}`;
  document.getElementById('vSummary').textContent = vInt.summary;
  renderKundliSvg(v);
  const dh = document.getElementById('dashaList');
  dh.innerHTML = v.dashas.list.slice(0, 9).map(d => {
    const pct = d.isCurrent ? '100%' : d.startDate < new Date() ? Math.round((Math.min(d.endDate, new Date()) - d.startDate) / (d.endDate - d.startDate) * 100) + '%' : '0%';
    return `<div class="dasha-item ${d.isCurrent ? 'current' : ''}"><div class="dasha-row"><span class="dasha-planet">${d.planet}</span><span class="dasha-dates">${d.startDate.getFullYear()} – ${d.endDate.getFullYear()}</span><span class="dasha-years">${d.years} yrs</span></div><div class="dasha-bar"><div class="dasha-bar-fill" style="width:${pct}"></div></div></div>`;
  }).join('');
}

function renderKundliSvg(v) {
  const group = document.getElementById('kundliHousesGroup');
  if (!group) return;
  const coords = {
    1: { rX: 200, rY: 130, pX: 200, pY: 155 },
    2: { rX: 120, rY: 60,  pX: 120, pY: 85 },
    3: { rX: 60,  rY: 120, pX: 60,  pY: 145 },
    4: { rX: 130, rY: 200, pX: 130, pY: 225 },
    5: { rX: 60,  rY: 280, pX: 60,  pY: 305 },
    6: { rX: 120, rY: 340, pX: 120, pY: 365 },
    7: { rX: 200, rY: 270, pX: 200, pY: 295 },
    8: { rX: 280, rY: 340, pX: 280, pY: 365 },
    9: { rX: 340, rY: 280, pX: 340, pY: 305 },
    10: { rX: 270, rY: 200, pX: 270, pY: 225 },
    11: { rX: 340, rY: 120, pX: 340, pY: 145 },
    12: { rX: 280, rY: 60,  pX: 280, pY: 85 }
  };
  const planetMap = {
    sun: 'Su', moon: 'Mo', mercury: 'Me', venus: 'Ve', mars: 'Ma',
    jupiter: 'Ju', saturn: 'Sa', rahu: 'Ra', ketu: 'Ke'
  };
  const byHouse = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  Object.keys(planetMap).forEach(pk => {
    const p = v[pk];
    if (p && p.house) byHouse[p.house].push(planetMap[pk]);
  });
  let html = '';
  for (let h = 1; h <= 12; h++) {
    const house = v.houses[h - 1];
    const c = coords[h];
    const rashiNum = house.signIdx + 1;
    const planets = byHouse[h].join(' ');
    html += `<text x="${c.rX}" y="${c.rY}" text-anchor="middle" class="house-num-text">${rashiNum}</text>`;
    if (planets) html += `<text x="${c.pX}" y="${c.pY}" text-anchor="middle" class="planet-symbol-text">${planets}</text>`;
  }
  group.innerHTML = html;
  document.getElementById('chartAscendantText').textContent = `Lagna: ${v.lagna.sign.en} (${v.lagna.sign.hi})`;
}

function renderInfluencesSection(p, wInt, vInt) {
  document.getElementById('infMindEmo').innerHTML = `
    <h4 style="color:var(--color-gold);margin-bottom:8px;">Mental & Emotional Blueprint</h4>
    <p>${wInt.emotions}</p>
    <p style="margin-top:8px;">${wInt.mind}</p>
    <div style="margin-top:12px;"><strong>Emotional Nature:</strong> Rooted in ${p.western.moon.sign.en} Moon. Your first response is typically ${SIGN_PERSONALITY[p.western.moon.signIdx].strengths[0].toLowerCase()} and ${SIGN_PERSONALITY[p.western.moon.signIdx].strengths[1].toLowerCase()}.</div>
    <div style="margin-top:8px;"><strong>Thinking Patterns:</strong> ${p.western.mercury.sign.en} Mercury creates a naturally ${SIGN_PERSONALITY[p.western.mercury.signIdx].strengths[0].toLowerCase()} and ${SIGN_PERSONALITY[p.western.mercury.signIdx].strengths[1].toLowerCase()} cognitive style.</div>
    <div style="margin-top:8px;"><strong>Stress Response:</strong> ${SIGN_PERSONALITY[p.western.moon.signIdx].challenges[0]} and ${SIGN_PERSONALITY[p.western.moon.signIdx].challenges[1] || 'withdrawal'} may surface under pressure; conscious ${SIGN_PERSONALITY[p.western.ascendant.signIdx].strengths[0]} mitigates this.</div>
    <div style="margin-top:8px;"><strong>Intuition:</strong> The Moon in ${p.vedic.nakshatra.en} Nakshatra (${p.vedic.nakshatra.lord} lord) grants specific intuitive channels tuned to ${p.vedic.nakshatra.gana.toLowerCase()} perception.</div>
  `;
  document.getElementById('infLifePred').innerHTML = `
    <h4 style="color:var(--color-gold);margin-bottom:8px;">Personalized Life Overview</h4>
    <p><strong>Personal Development:</strong> ${wInt.summary}</p>
    <p style="margin-top:10px;"><strong>Career Direction:</strong> ${wInt.career}</p>
    <p style="margin-top:10px;"><strong>Relationships:</strong> Astrologically, your partnership potential leans toward ${SIGN_PERSONALITY[p.western.venus.signIdx].strengths.join(', ').toLowerCase()} expressions. ${wInt.relationships}</p>
    <p style="margin-top:10px;"><strong>Financial Themes:</strong> With ${p.western.jupiter.sign.en} Jupiter and ${p.vedic.rashi.sign.en} Rashi Lord ${p.vedic.rashiLord}, resources flow most naturally through ${SIGN_PERSONALITY[p.western.jupiter.signIdx].themes[0].toLowerCase()} channels.</p>
    <p style="margin-top:10px;"><strong>Important Transitions:</strong> Saturn's return around ages 29-30 and 58-60, plus your current ${p.vedic.dashas.current.planet} Mahadasha, flag the current decade as a major structural transition.</p>
    <p style="margin-top:10px;opacity:.75;font-style:italic;">Astrologically, these themes suggest tendencies — individual free will always shapes the final outcome.</p>
  `;
}

function renderPeriodsSection(p, periods) {
  const container = document.getElementById('periodsTimeline');
  const catClass = { past: 'past', current: 'current', future: 'future' };
  container.innerHTML = periods.map(per => {
    const start = per.startDate.toLocaleDateString();
    const end = per.endDate.toLocaleDateString();
    return `<div class="timeline-node ${catClass[per.period]}">
      <div class="timeline-dot ${per.isPeak ? 'dot-peak' : per.isChallenge ? 'dot-challenge' : ''}"></div>
      <div class="timeline-card">
        <span class="timeline-phase-tag">${per.planet.toUpperCase()} MAHADASHA · ${per.period.toUpperCase()} · ${per.years} yrs</span>
        <h4>${per.planet} Period (${start} – ${end})</h4>
        <p style="margin:6px 0;"><strong>Theme:</strong> ${per.theme}</p>
        <div class="period-intensity">
          <div class="pi-item"><span>Career</span><div class="bar"><div class="bar-fill gold" style="width:${per.career}%"></div></div><em>${per.career}%</em></div>
          <div class="pi-item"><span>Money</span><div class="bar"><div class="bar-fill magenta" style="width:${per.money}%"></div></div><em>${per.money}%</em></div>
          <div class="pi-item"><span>Relationship</span><div class="bar"><div class="bar-fill cyan" style="width:${per.relationships}%"></div></div><em>${per.relationships}%</em></div>
          <div class="pi-item"><span>Growth</span><div class="bar"><div class="bar-fill emerald" style="width:${per.growth}%"></div></div><em>${per.growth}%</em></div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderPeakChallengeSections(periods) {
  const past = periods.filter(p => p.period === 'past');
  const curr = periods.find(p => p.period === 'current');
  const fut = periods.filter(p => p.period === 'future');
  const card = (p, extra = '') => `<div class="glass-card period-item-card">
    <div class="pi-header"><h4>${p.planet} Period</h4><span class="intensity-tag ${p.intensity >= 78 ? 'tag-gold' : p.intensity <= 55 ? 'tag-magenta' : 'tag-cyan'}">${p.intensity}% Intensity</span></div>
    <div class="pi-dates">${p.startDate.getFullYear()} – ${p.endDate.getFullYear()}</div>
    <p style="margin:8px 0;"><strong>Theme:</strong> ${p.theme.split('.')[0]}.</p>
    <div class="pi-mini"><span>Career ${p.career}%</span><span>Money ${p.money}%</span><span>Rel ${p.relationships}%</span><span>Growth ${p.growth}%</span></div>
    ${extra}</div>`;
  document.getElementById('pastPeaks').innerHTML = past.filter(p => p.isPeak).slice(0, 3).map(p => card(p)).join('') || '<p class="empty-state">No distinctly flagged historical peak periods in range.</p>';
  document.getElementById('currentPhase').innerHTML = curr ? card(curr) : '<p class="empty-state">Current period loading…</p>';
  document.getElementById('futurePeaks').innerHTML = fut.filter(p => p.isPeak).slice(0, 3).map(p => card(p)).join('') || '<p class="empty-state">No distinctly flagged future peaks in range.</p>';
  document.getElementById('pastChallenges').innerHTML = past.filter(p => p.isChallenge).slice(0, 3).map(p => card(p, `<p class="pi-approach"><strong>Constructive approach:</strong> Saturnine discipline, realistic expectations, and deliberate action through this period builds lasting strength.</p>`)).join('') || '<p class="empty-state">No distinctly flagged past challenge periods.</p>';
  document.getElementById('currentChallenge').innerHTML = curr && curr.isChallenge ? card(curr, `<p class="pi-approach"><strong>Constructive approach:</strong> Lean into structure, reduce exposure, and treat this as a strengthening, not threatening, cycle. Nothing is guaranteed.</p>`) : '<p class="empty-state">Current period is not flagged as a major challenge window.</p>';
  document.getElementById('futureChallenges').innerHTML = fut.filter(p => p.isChallenge).slice(0, 3).map(p => card(p, `<p class="pi-approach"><strong>Preparation:</strong> Build financial reserves, avoid over-commitment, and plan support structures in advance for this astrologically cautious window.</p>`)).join('') || '<p class="empty-state">No distinctly flagged future challenge periods.</p>';
}

function renderNumerologySection(p, num) {
  const mkCard = (title, value, subtitle) => {
    const meaning = NumerologyService.meaning(value);
    return `<div class="glass-card num-card">
      <div class="num-value">${value}</div>
      <h4>${title}</h4>
      <div class="num-sub">${subtitle}</div>
      <p style="margin-top:10px;">${meaning.en || ''}</p>
      <p style="margin-top:4px;opacity:.75">${meaning.hi || ''}</p>
    </div>`;
  };
  document.getElementById('numLifePath').innerHTML = mkCard(App.t('lifePath'), num.lifePath, 'Path of your soul journey');
  document.getElementById('numDestiny').innerHTML = mkCard(App.t('destiny'), num.destiny, 'Expression of your outer gifts');
  document.getElementById('numSoulUrge').innerHTML = mkCard(App.t('soulUrge'), num.soulUrge, "What your heart truly desires");
  document.getElementById('numPersonality').innerHTML = mkCard(App.t('personalityNum'), num.personality, 'How the world sees you');
  document.getElementById('numBirthday').innerHTML = mkCard(App.t('birthdayNum'), num.birthday, 'Your birth-day vibration');
  document.getElementById('numPersonalYear').innerHTML = mkCard(App.t('personalYear'), num.personalYear, 'Theme of this solar year');
  document.getElementById('numCalcMethod').innerHTML = `
    <div class="glass-card"><h4>Calculation Methodology</h4><ul style="margin-top:10px;line-height:1.8;padding-left:20px;">
      <li><strong>Life Path:</strong> Reduce DOB Y+M+D (master numbers 11, 22, 33 preserved)</li>
      <li><strong>Destiny / Expression:</strong> Sum all letters (A=1, B=2… I=9 repeating) of full name</li>
      <li><strong>Soul Urge (Heart's Desire):</strong> Sum vowels (A, E, I, O, U) in full name</li>
      <li><strong>Personality:</strong> Sum consonants in full name</li>
      <li><strong>Birthday Number:</strong> Reduce birth day to single digit</li>
      <li><strong>Personal Year:</strong> M + D + Current Year digits reduced</li>
    </ul></div>`;
}

function renderMonsterTattooSection(p, monster, tattoo) {
  const mImg = document.getElementById('monthMonsterImage');
  mImg.src = `assets/monsters/month_${p.month}.jpg`;
  document.getElementById('monsterMonthBadge').textContent = `${monster.month} Shadow Guardian`;
  document.getElementById('monsterName').textContent = monster.name;
  document.getElementById('monsterQuote').textContent = `"${monster.quote}"`;
  document.getElementById('monsterLore').textContent = monster.lore;
  document.getElementById('monsterAffinity').textContent = monster.affinity;
  document.getElementById('monsterPower').textContent = monster.power;
  const tImg = document.getElementById('dateTattooImage');
  tImg.src = `assets/tattoos/day_${p.day}.jpg`;
  document.getElementById('tattooDateBadge').textContent = `Day ${p.day} Sacred Symbol`;
  document.getElementById('tattooName').textContent = tattoo.name;
  document.getElementById('tattooMantra').textContent = `"${tattoo.quote}"`;
  document.getElementById('tattooMeaning').textContent = tattoo.meaning;
  document.getElementById('tattooAffirmation').textContent = tattoo.mantra;
  document.getElementById('tattooChakra').textContent = tattoo.chakra;
}

async function handleKundaliSubmit(e) {
  e.preventDefault();
  if (!validateKundaliUpload(document.getElementById('groomKundali')) || !validateKundaliUpload(document.getElementById('brideKundali'))) return;
  const g = {
    name: document.getElementById('groomName').value || 'Groom',
    dob: document.getElementById('groomDob').value,
    tob: document.getElementById('groomTob').value || '12:00',
    pob: document.getElementById('groomPob').value || 'India'
  };
  const b = {
    name: document.getElementById('brideName').value || 'Bride',
    dob: document.getElementById('brideDob').value,
    tob: document.getElementById('brideTob').value || '12:00',
    pob: document.getElementById('bridePob').value || 'India'
  };
  if (!g.dob || !b.dob) { alert('Please enter both birth dates.'); return; }
  let result;
  try {
    const [groomPlace, bridePlace] = await Promise.all([resolvePlaceOnline(g.pob), resolvePlaceOnline(b.pob)]);
    g.resolvedPlace = groomPlace;
    b.resolvedPlace = bridePlace;
    result = App.kundaliMilan(g, b);
  } catch (error) {
    alert(error.message || "We couldn't calculate your chart. Please verify your birth details and try again.");
    return;
  }
  const kmTb = document.getElementById('kundaliMilanTableBody');
  kmTb.innerHTML = result.kootas.map(k => {
    const pct = Math.round((k.points / k.max) * 100);
    return `<tr><td style="font-weight:700;color:#fff;">${k.en}<br/><small style="opacity:.6">${k.hi}</small></td><td style="color:var(--color-gold);font-weight:600;">${k.points} / ${k.max}</td><td><div class="bar small"><div class="bar-fill gold" style="width:${pct}%"></div></div></td><td style="color:var(--color-cyan);">${pct}%</td></tr>`;
  }).join('');
  document.getElementById('kmTotal').textContent = `${result.totalPoints} / ${result.maxPoints} (${result.percentage}%)`;
  document.getElementById('kmVerdict').textContent = result.verdict;
  const tb = document.getElementById('kmInfoTableBody');
  const gp = App.groom, bp = App.bride;
  tb.innerHTML = `
    <tr><td style="font-weight:700">Groom / वर</td><td>${g.name}</td><td>${g.dob}</td><td>${g.tob}</td><td>${g.pob}</td><td>${gp.vedic.rashi.sign.en} (${gp.vedic.rashi.sign.hi})</td><td>${gp.vedic.nakshatra.en} Pada ${gp.vedic.pada}</td><td>${gp.vedic.lagna.sign.en}</td></tr>
    <tr><td style="font-weight:700">Bride / वधू</td><td>${b.name}</td><td>${b.dob}</td><td>${b.tob}</td><td>${b.pob}</td><td>${bp.vedic.rashi.sign.en} (${bp.vedic.rashi.sign.hi})</td><td>${bp.vedic.nakshatra.en} Pada ${bp.vedic.pada}</td><td>${bp.vedic.lagna.sign.en}</td></tr>`;
  document.getElementById('kmStrengths').innerHTML = `
    <li>Varna alignment is ${result.kootas[0].points}/1, reflecting appropriate social compatibility.</li>
    <li>Vashya score ${result.kootas[1].points}/2 — level of mutual influence and magnetism.</li>
    <li>Tara (health/wellness) — ${result.kootas[2].points}/3 indicates ${result.kootas[2].points >= 2 ? 'good' : 'moderate'} mutual life-force harmony.</li>
    <li>Graha Maitri (friendship of Rashi lords): ${result.kootas[4].points}/5 — core mental rapport.</li>
    <li>Bhakoot (domestic stability): ${result.kootas[6].points}/7 — indicates ${result.kootas[6].points >= 4 ? 'strong home-building capacity' : 'needs conscious attention to harmony'}.</li>
    <li>Nadi Dosha check: ${result.kootas[7].points === 0 ? '<span style="color:#f72585">Same Nadi — observe health and progeny considerations</span>' : '<span style="color:#06d6a0">Different Nadis — favorable, no Nadi Dosha</span>'}.</li>
  `;
  document.getElementById('kmChallenges').innerHTML = `
    <li>Any Koota scoring below half-maximum suggests areas for conscious effort.</li>
    <li>Mutual planetary friendships beyond Rashi lord must be examined separately in the full charts (not only Rashi).</li>
    <li>Mangal Dosha assessment requires detailed Mars placement, Rashi, and aspect analysis (not shown on this summary page).</li>
    <li>No astrological score guarantees relationship success or failure — individual free will, maturity, and communication always dominate.</li>
  `;
  document.getElementById('kmGuidance').innerHTML = `
    <p><strong>Relationship Guidance:</strong> Overall compatibility of ${result.percentage}% falls in the <em>${result.verdict.toLowerCase()}</em> range. The most important success factors are mutual respect, shared life vision, and emotional maturity. Use these traditional measurements as supporting information rather than the sole basis for a life decision.</p>
    <p style="margin-top:10px;"><strong>Important Considerations:</strong> Additional factors like individual dashas at time of marriage, 9th and 10th house alignment, Upapada Lagna, Arudha analysis, and divisional (D9 Navamsa) charts contribute significantly beyond this 8-Koota summary.</p>
  `;
  showSection('sectionKundaliResults');
}

async function handleCompatSubmit(e) {
  e.preventDefault();
  const p1 = {
    name: document.getElementById('cp1Name').value || 'Person 1',
    dob: document.getElementById('cp1Dob').value,
    tob: document.getElementById('cp1Tob').value || '12:00',
    pob: document.getElementById('cp1Pob').value || 'India'
  };
  const p2 = {
    name: document.getElementById('cp2Name').value || 'Person 2',
    dob: document.getElementById('cp2Dob').value,
    tob: document.getElementById('cp2Tob').value || '12:00',
    pob: document.getElementById('cp2Pob').value || 'India'
  };
  if (!p1.dob || !p2.dob) { alert('Please enter both birth dates.'); return; }
  let r;
  try {
    const [personOnePlace, personTwoPlace] = await Promise.all([resolvePlaceOnline(p1.pob), resolvePlaceOnline(p2.pob)]);
    p1.resolvedPlace = personOnePlace;
    p2.resolvedPlace = personTwoPlace;
    r = App.compatibilityMarriage(p1, p2);
  } catch (error) {
    alert(error.message || "We couldn't calculate your chart. Please verify your birth details and try again.");
    return;
  }
  const dims = [
    { key: 'emotional', label: '❤️ Emotional Compatibility', color: 'gold' },
    { key: 'communication', label: '💬 Communication', color: 'cyan' },
    { key: 'marriage', label: '💍 Marriage Potential', color: 'gold' },
    { key: 'lifestyle', label: '🏠 Lifestyle Harmony', color: 'magenta' },
    { key: 'financial', label: '💰 Financial Tendencies', color: 'emerald' },
    { key: 'attraction', label: '🔥 Attraction & Chemistry', color: 'magenta' },
    { key: 'mental', label: '🧠 Mental Compatibility', color: 'cyan' },
    { key: 'longTerm', label: '🌱 Long-Term Growth', color: 'emerald' }
  ];
  document.getElementById('compatOverall').textContent = `${r.overall}%`;
  document.getElementById('compatVerdict').textContent = r.overall >= 70 ? 'Strong alignment' : r.overall >= 55 ? 'Good with effort' : r.overall >= 40 ? 'Moderate, conscious work needed' : 'Significant conscious attention required';
  document.getElementById('compatBars').innerHTML = dims.map(d => {
    const val = Math.min(100, Math.max(0, r[d.key]));
    return `<div class="dim-row"><span>${d.label}</span><div class="bar"><div class="bar-fill ${d.color}" style="width:${val}%"></div></div><em>${val}%</em></div>`;
  }).join('');
  showSection('sectionCompatResults');
}

window.handleKundaliSubmit = handleKundaliSubmit;
window.handleCompatSubmit = handleCompatSubmit;
window.__PROPHECY_ASTRONOMY__ = { julianDay, calcGST, calcAscendant, calcMidheaven, normDeg, getSignIndex, getSignDegree, estimateUTCOffsetMinutes };
