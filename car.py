"""
=============================================================================
 🔮 DESTINY NEXUS: HOROSCOPE • NUMEROLOGY • FUTURE TELLING
            "Mystic Insights, Infinite Possibilities."
=============================================================================
 Features:
 1. Direct Input (Name, DOB, Time of Birth, Place of Birth) - No Login Required
 2. Where is Your Destiny? (Astro-Cartography Direction, Material Calling, Apex Age)
 3. Month's Shadow Monster Lore & Birth Date Sacred Tattoo
 4. Vedic Lagna Kundali (Ascendant, Rashi, Nakshatra, 12 Houses, Graha Placements)
 5. Complete Life History & Epoch Evolutionary Timeline
 6. Future Prophecy, Wealth & Career Horizon
=============================================================================
"""

from datetime import datetime, date

MONSTERS_DB = {
    1: ("Frost Wraith", "Born from winter's silence, it feeds on warmth.", "Glacial Frost & Stillness", "Cryo-Shield & Absolute Focus"),
    2: ("Heartless", "It was once human, until love betrayed it.", "Obsidian Core & Karmic Steel", "Emotional Fortress & Unyielding Will"),
    3: ("Dusk Stalker", "It walks between light and dark, stealing hope.", "Twilight Shadows & Phase", "Shadow Stealth & Intuitive Perception"),
    4: ("Twilight Jester", "It brings laughter first, then your end.", "Chaos Magic & Spark", "Reality Inversion & Strategic Subversion"),
    5: ("Bloom Fiend", "It feasts on beauty and leaves decay.", "Dark Flora & Transmutation", "Regeneration & Rapid Manifestation"),
    6: ("Abyssal Serpent", "It lurks in the deep, waiting for the weak.", "Tidal Pressure & Oceanic Dark", "Deep Subconscious Sight & Depth"),
    7: ("Cinder Lord", "He rules the ashes of what was once alive.", "Solar Fire & Molten Magma", "Charismatic Rebirth & Sovereign Command"),
    8: ("Eclipse Beast", "It comes when the sky forgets the sun.", "Solar Eclipse & Cosmic Flame", "Berserker Drive & Fear Domination"),
    9: ("Void Weaver", "It weaves nightmares into reality.", "Quantum Void & Cosmic String", "Master Architectural Synthesis"),
    10: ("Harvester", "It collects souls when fear is ripe.", "Harvest Moon & Temporal Scythe", "Karmic Execution & Maximum Yield"),
    11: ("Grave Watcher", "It guards the dead and marks the cursed.", "Crypt Gate & Luminescence", "Psychic Shield & Truth Discernment"),
    12: ("Winter King", "He brings the end so the cycle begins.", "Eternal Frost & Solstice Crown", "Generational Authority & Cycle Mastery")
}

TATTOOS_DB = {
    1: ("1. New Beginning", "New paths. New you.", "The Sacred Sword of Initiation: Cut through past hesitations and forge bold new frontiers."),
    2: ("2. Inner Strength", "Power within.", "The Sovereign Lion Triangle: An unshakable reservoir of internal courage and dignity."),
    3: ("3. Focus", "Clear mind. Sharp soul.", "The Eye of the North Compass: Laser-like cognitive precision and unshakeable attention."),
    4: ("4. Protection", "Shielded in silence.", "The Aegis Shield and Laurel: Impenetrable boundaries against negative energies."),
    5: ("5. Courage", "Fear bows. I rise.", "The Lunar Wolf Pack Totem: Instinctive fearlessness in uncharted wilderness."),
    6: ("6. Discipline", "Control today, freedom tomorrow.", "The Spartan Helm & Spear: Self-mastery that translates daily habits into greatness."),
    7: ("7. Wisdom", "See more. Know more.", "The Owl of Nocturnal Sight: Profound comprehension of hidden truths and esoteric science."),
    8: ("8. Transformation", "I burn. I rise. I become.", "The Solar Phoenix Rebirth: Complete reinvention through life's trials."),
    9: ("9. Faith", "Trust the unseen.", "The Celestial Hands of Devotion: Deep alignment with cosmic synchronicity and grace."),
    10: ("10. Balance", "Light and dark. One within.", "The Radiant Yin-Yang Mandala: Integrating logic and emotion into complete harmony."),
    11: ("11. Resilience", "Unbreakable. Unshakable.", "The Cosmic Yggdrasil Tree: Deep roots that weather every hurricane."),
    12: ("12. Intuition", "I listen. I know.", "The Goddess of the Crescent Moon: Direct channel to subconscious knowing and telepathy."),
    13: ("13. Harmony", "Aligned soul, peaceful heart.", "The Sacred Lotus of Geometry: Peaceful resonance that calms turbulent environments."),
    14: ("14. Ambition", "Dream. Plan. Conquer.", "The Crowned Royal Lion: Relentless drive to build an empire of excellence."),
    15: ("15. Letting Go", "Release. Reset. Rise.", "The Transmuted Skull of Rebirth: Shedding obsolete attachments into freedom."),
    16: ("16. Gratitude", "Grateful heart, magnetic life.", "The Vortex Sun of Abundance: Magnetizing prosperity through pure appreciation."),
    17: ("17. Patience", "Good things take time.", "The Cosmic Chrono Hourglass: Harmonizing with the compounding power of time."),
    18: ("18. Loyalty", "Till the end. Through all.", "The Wolf Brotherhood Sigil: Fierce devotion to those who walk beside you."),
    19: ("19. Clarity", "Clear today. Better tomorrow.", "The Quartz Crystal Obelisk: Total mental lucidity and sharp decision making."),
    20: ("20. Self Love", "You first. Always.", "The Anatomical Heart of Blooms: Unconditional self-worth as the fountain of creation."),
    21: ("21. Determination", "Decide. Commit. Succeed.", "The Crowned Chained Fist of Will: Breaking every shackle to achieve your goal."),
    22: ("22. Adventure", "Explore. Learn. Grow.", "The Alpine Mountain Horizon: Boundless curiosity to conquer new physical and mental heights."),
    23: ("23. Creativity", "Imagine. Create. Inspire.", "The Celestial Wave & Crescent Swirl: Channeling original inspiration into art."),
    24: ("24. Leadership", "Lead with vision. Inspire with heart.", "The Sovereign Compass Crown: Leading teams through moral authority and courage."),
    25: ("25. Healing", "Healing is becoming.", "The Winged Caduceus of Hermes: Restoring balance to body, mind, and spirit."),
    26: ("26. Confidence", "I am enough. I am ready.", "The Sun-Moon Eclipse Seal: Total self-assurance without need for external validation."),
    27: ("27. Purpose", "Find it. Live it. Be it.", "The Labyrinth Target: Aligning daily actions with your grand soul mission."),
    28: ("28. Rebirth", "Endings are new beginnings.", "The Crystal Butterfly: Metamorphosis from struggle into radiant elegance."),
    29: ("29. Courage to Change", "Change is growth. Embrace it.", "The Half-Floral Wing: Embracing evolutionary shifts as invitations to flourish."),
    30: ("30. Legacy", "What you build outlives you.", "The Eternal Tree of Generations: Building systems and knowledge that outlast time."),
    31: ("31. Victory", "All efforts. All earned. All yours.", "The Winged Laurel Sword of Triumph: The triumphant realization of all your dreams.")
}

RASHIS = [
    "Aries (Mesha) ♈", "Taurus (Vrishabha) ♉", "Gemini (Mithuna) ♊",
    "Cancer (Karka) ♋", "Leo (Simha) ♌", "Virgo (Kanya) ♍",
    "Libra (Tula) ♎", "Scorpio (Vrischika) ♏", "Sagittarius (Dhanu) ♐",
    "Capricorn (Makara) ♑", "Aquarius (Kumbha) ♒", "Pisces (Meena) ♓"
]

LORDS = [
    "Mars (Mangal)", "Venus (Shukra)", "Mercury (Budha)",
    "Moon (Chandra)", "Sun (Surya)", "Mercury (Budha)",
    "Venus (Shukra)", "Mars (Mangal)", "Jupiter (Guru)",
    "Saturn (Shani)", "Saturn (Shani)", "Jupiter (Guru)"
]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]


def calculate_kundli(birth_date: date, birth_time_str: str) -> dict:
    try:
        hour, minute = [int(p) for p in birth_time_str.split(":")]
    except Exception:
        hour, minute = 12, 0

    day_of_year = birth_date.timetuple().tm_yday
    sun_idx = int(((day_of_year + 285) % 365) / 30.4) % 12
    time_progress = (hour + minute / 60) / 2.0
    lagna_idx = int((sun_idx + time_progress) % 12)
    moon_idx = (day_of_year + 7) % 12
    nakshatra_idx = (day_of_year * 3 + birth_date.day) % 27

    return {
        "lagna_idx": lagna_idx,
        "lagna": RASHIS[lagna_idx],
        "lagna_lord": LORDS[lagna_idx],
        "moon_sign": RASHIS[moon_idx],
        "sun_sign": RASHIS[sun_idx],
        "nakshatra": f"{NAKSHATRAS[nakshatra_idx]} (Pada {(birth_date.day % 4) + 1})"
    }


def calculate_destiny_coordinates(name: str, birth_date: date, hour: int, lagna_idx: int) -> dict:
    directions = [
        ("North-East (Ishanya Zenith)", "Coastal High-Tech Metropolises & Intellectual Capitals", "Activates cosmic expansion and unprecedented mentors."),
        ("North (Kubera Treasury Axis)", "Commercial Megacities & Financial Innovation Districts", "Triggers massive liquid wealth compounding and business authority."),
        ("East (Indra Royal Dawn)", "Pioneering Frontier Cities & Sunlit Capital Hubs", "Solar power ignites rapid executive promotions and sovereign autonomy."),
        ("South-East (Agni Creation Grid)", "Dynamic Industrial Clusters & High-Velocity Media Hubs", "Sparks monumental creative output and viral global influence."),
        ("West (Varuna Oceanic Horizon)", "International Port Metropolises & Global Trade Gateways", "Saturn's domain yields massive international trade leverage."),
        ("North-West (Vayu Wind Velocity)", "Aviation Corridors & Rapid Exchange Corridors", "Promotes swift multi-territory expansion and agile scaling.")
    ]
    dir_info = directions[(lagna_idx + birth_date.month + (hour % 6)) % len(directions)]

    materials = [
        ("Scalable AI Software, Digital IP & Autonomous Systems", "24K Gold & Pure Titanium", "Electric Ether & Solar Fire"),
        ("Prime Spatial Infrastructure, Real Estate & Strategic Land", "Refined Copper & Rose Gold", "Crystalline Earth & Deep Gravity"),
        ("Global Financial Markets, Venture Capital & Asset Systems", "Sterling Silver & Platinum", "Liquid Water & Kinetic Trade"),
        ("Creative Media Franchises, Cultural IP & Cinematic Arts", "Electrum & Obsidian", "Magnetic Radiance & Astral Light")
    ]
    mat_info = materials[(birth_date.day + len(name) + lagna_idx) % len(materials)]

    peak_base = 26 + ((birth_date.day + birth_date.month) % 9)
    peak_age = f"Ages {peak_base} - {peak_base + 7} (Solar Ascendance Window)"

    return {
        "direction": dir_info[0],
        "landscape": dir_info[1],
        "geo_desc": dir_info[2],
        "material": mat_info[0],
        "metal": mat_info[1],
        "force": mat_info[2],
        "peak_age": peak_age
    }


def generate_dossier(name: str, dob_str: str, tob_str: str, pob_str: str) -> str:
    birth_date = datetime.strptime(dob_str, "%Y-%m-%d").date()
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    days_lived = (today - birth_date).days
    hours_lived = days_lived * 24
    heartbeats = int(days_lived * 24 * 60 * 75)

    try:
        hour = int(tob_str.split(":")[0])
    except Exception:
        hour = 12

    # Calculations
    monster_name, monster_quote, monster_affinity, monster_power = MONSTERS_DB.get(birth_date.month, MONSTERS_DB[1])
    tattoo_name, tattoo_quote, tattoo_meaning = TATTOOS_DB.get(birth_date.day, TATTOOS_DB[1])
    kundli = calculate_kundli(birth_date, tob_str)
    destiny = calculate_destiny_coordinates(name, birth_date, hour, kundli["lagna_idx"])

    border = "=" * 84
    sub_border = "-" * 84

    lines = [
        border,
        f" 🔮 DESTINY NEXUS: VEDIC KUNDALI, DESTINY COORDINATES & MONSTER ORACLE",
        f"          HOROSCOPE • NUMEROLOGY • FUTURE TELLING",
        f"         \"Mystic Insights, Infinite Possibilities.\"",
        border,
        f"  👤 Subject Name     : {name.upper()}",
        f"  🎂 Date of Birth    : {birth_date.strftime('%B %d, %Y')} ({age} Solar Orbits)",
        f"  ⏰ Time of Birth    : {tob_str}",
        f"  📍 Place of Birth   : {pob_str}",
        f"  ⏱️  Chronometry     : ~{days_lived:,} Days Lived | ~{hours_lived:,} Hours Lived",
        f"  💓 Heartbeats Taken : ~{heartbeats:,} beats (@ 75 bpm)",
        sub_border,
        "  🧭 WHERE IS YOUR DESTINY? (ASTRO-CARTOGRAPHY & MATERIAL VEHICLE)",
        sub_border,
        f"  • Power Direction   : {destiny['direction']}",
        f"  • Destined Landscape: {destiny['landscape']}",
        f"  • Geographic Impact : {destiny['geo_desc']}",
        f"  • Material Vehicle  : {destiny['material']}",
        f"  • Auspicious Metal  : {destiny['metal']}",
        f"  • Sacred Element    : {destiny['force']}",
        f"  • Apex Age Window   : {destiny['peak_age']}",
        sub_border,
        "  👹 YOUR MONTH'S SHADOW MONSTER GUARDIAN",
        sub_border,
        f"  • Month Monster     : {monster_name} (Month {birth_date.month})",
        f"  • Inscription Quote : \"{monster_quote}\"",
        f"  • Elemental Affinity: {monster_affinity}",
        f"  • Guardian Power    : {monster_power}",
        sub_border,
        "  🗡️ YOUR BIRTH DATE SACRED TATTOO (DAY OF BIRTH)",
        sub_border,
        f"  • Sacred Tattoo     : {tattoo_name}",
        f"  • Sacred Mantra     : \"{tattoo_quote}\"",
        f"  • Symbolic Meaning  : {tattoo_meaning}",
        sub_border,
        "  🕉️ VEDIC JANAM KUNDALI & PLANETARY ALIGNMENTS",
        sub_border,
        f"  • Ascendant (Lagna) : {kundli['lagna']}",
        f"  • Lagna Lord        : {kundli['lagna_lord']}",
        f"  • Moon Sign (Rashi) : {kundli['moon_sign']}",
        f"  • Sun Sign (Surya)  : {kundli['sun_sign']}",
        f"  • Birth Nakshatra   : {kundli['nakshatra']}",
        sub_border,
        "  📜 LIFE HISTORY & EVOLUTIONARY TIMELINE",
        sub_border,
        f"  • Phase 1 (Ages 0-14) : Formative roots influenced by {kundli['moon_sign']} & 4th house roots.",
        f"  • Phase 2 (Ages 15-28): Breakthrough self-identity, skill acquisition & overcoming early trials.",
        f"  • Phase 3 (Ages 29-45): Prime career ascension, massive asset growth & leadership authority.",
        f"  • Phase 4 (Ages 46+)  : Legacy mastery, karmic fruition, and transmitting wisdom.",
        sub_border,
        "  🔮 UNCHARTED FUTURE ORACLE",
        sub_border,
        "  • Career Horizon    : Major leadership expansion; your strategic acumen creates lasting autonomy.",
        "  • Wealth Alignment  : Strong 2nd & 11th house compounding through high-value assets and innovation.",
        "  • Cosmic Advice     : Trust the daily compounding of effort; your breakthrough is ripening.",
        border
    ]

    return "\n".join(lines)


def main():
    print("""
╔════════════════════════════════════════════════════════════════════════════════╗
║                              🔮 DESTINY NEXUS                                  ║
║                  HOROSCOPE • NUMEROLOGY • FUTURE TELLING                       ║
║                 "Mystic Insights, Infinite Possibilities."                     ║
╚════════════════════════════════════════════════════════════════════════════════╝
    """)

    name = input("Enter your Full Name: ").strip() or "Cosmic Traveler"

    while True:
        dob_in = input("Enter Date of Birth (YYYY-MM-DD, e.g. 2002-08-15): ").strip()
        try:
            datetime.strptime(dob_in, "%Y-%m-%d")
            break
        except ValueError:
            print("❌ Invalid format. Please use YYYY-MM-DD.")

    tob_in = input("Enter Time of Birth (HH:MM, 24-hour e.g. 10:30 or 22:15) [default 12:00]: ").strip() or "12:00"
    pob_in = input("Enter Place of Birth (City / Country e.g. Mumbai, India): ").strip() or "Global"

    print("\n🔮 Calculating your Destiny Coordinates, Vedic Kundli, Month Monster & Birth Date Tattoo...")
    report = generate_dossier(name, dob_in, tob_in, pob_in)
    print("\n" + report)


if __name__ == "__main__":
    main()
