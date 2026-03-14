import type { NewsTheme, Sentiment, ClassifiedHeadline, LiveLayerConfig } from './types';
import { THEME_ICONS } from '../patterns/icons/data';

/** Index of iconPatterns in ALL_PATTERN_SETS */
const ICON_PATTERN_INDEX = 29;

/**
 * Maps news themes to pattern set indices in ALL_PATTERN_SETS.
 *
 * Index reference:
 *  0: aztec, 1: lace, 2: nordic, 3: chevron, 4: lotus, 5: greekkey,
 *  6: tribal, 7: artdeco, 8: sacred, 9: japanese, 10: celtic,
 *  11: egyptian, 12: mesoamerican, 13: generative, 14: guilloche,
 *  15: fractal, 16: spirals, 17: harmonograph, 18: truchet,
 *  19: islamic, 20: opart, 21: artnouveau, 22: aboriginal,
 *  23: polynesian, 24: embroidery, 25: maze, 26: flowfield,
 *  27: noisestrata, 28: organiccells, 29: icons (News Icons)
 */
const THEME_PATTERNS: Record<NewsTheme, number[]> = {
    conflict:    [15, 25, 6, 0],      // fractal, maze, tribal, aztec — complex, intense
    economy:     [14, 7, 5, 18],      // guilloche, artdeco, greekkey, truchet — structured
    weather:     [26, 16, 17, 21],    // flowfield, spirals, harmonograph, artnouveau — flowing
    health:      [8, 28, 4, 24],      // sacred, organiccells, lotus, embroidery — organic
    politics:    [5, 19, 11, 12],     // greekkey, islamic, egyptian, mesoamerican — monumental
    technology:  [13, 18, 20, 3],     // generative, truchet, opart, chevron — geometric
    sports:      [3, 17, 20, 13],     // chevron, harmonograph, opart, generative — dynamic
    culture:     [4, 21, 9, 10],      // lotus, artnouveau, japanese, celtic — ornate
    environment: [26, 21, 28, 16],    // flowfield, artnouveau, organiccells, spirals — natural
    science:     [13, 15, 16, 17],    // generative, fractal, spirals, harmonograph — mathematical
    crime:       [25, 6, 27, 15],     // maze, tribal, noisestrata, fractal — dark, complex
    disaster:    [15, 27, 26, 6],     // fractal, noisestrata, flowfield, tribal — chaotic
    diplomacy:   [19, 5, 1, 7],       // islamic, greekkey, lace, artdeco — formal
    education:   [8, 1, 24, 4],       // sacred, lace, embroidery, lotus — nurturing
    space:       [13, 16, 17, 22],    // generative, spirals, harmonograph, aboriginal — cosmic
    general:     [8, 13, 4, 16],      // sacred, generative, lotus, spirals — neutral fallback
};

/** Color theme indices that pair well with each news theme */
const THEME_COLORS: Record<NewsTheme, number[]> = {
    // 0:Monochrome, 1:Pastel, 2:Neon, 3:Sepia, 4:Sunset, 5:Ocean, 6:Forest, 7:Royal, 8:Vaporwave, 9:Terracotta
    conflict:    [4, 9, 0],    // sunset, terracotta — warm, intense
    economy:     [7, 0, 3],    // royal, monochrome — formal
    weather:     [5, 1, 6],    // ocean, pastel, forest — natural
    health:      [1, 6, 5],    // pastel, forest — gentle
    politics:    [7, 0, 9],    // royal, monochrome — authoritative
    technology:  [2, 8, 5],    // neon, vaporwave — futuristic
    sports:      [2, 4, 9],    // neon, sunset — energetic
    culture:     [1, 8, 3],    // pastel, vaporwave, sepia — artistic
    environment: [6, 5, 1],    // forest, ocean — natural
    science:     [5, 2, 0],    // ocean, neon — analytical
    crime:       [0, 4, 9],    // monochrome, sunset — dark
    disaster:    [4, 9, 0],    // sunset, terracotta — urgent
    diplomacy:   [7, 1, 0],    // royal, pastel — diplomatic
    education:   [1, 3, 6],    // pastel, sepia — warm
    space:       [2, 8, 5],    // neon, vaporwave, ocean — cosmic
    general:     [0, 1, 3],    // monochrome, pastel — neutral
};

/** Sentiment affects rendering parameters */
function sentimentParams(sentiment: Sentiment, intensity: number) {
    const i = Math.max(0, Math.min(1, intensity));
    switch (sentiment) {
        case 'negative':
            return {
                roughness: 1.5 + i * 3,      // rougher = more tense
                spinFactor: 1 + i * 2,        // faster = more urgent
                filledBias: 0.7,              // more filled = denser
            };
        case 'positive':
            return {
                roughness: 0.5 + i * 0.5,    // smoother = calmer
                spinFactor: 0.5 + i * 0.5,   // moderate speed
                filledBias: 0.3,              // more outlines = lighter
            };
        case 'neutral':
        default:
            return {
                roughness: 1,
                spinFactor: 1,
                filledBias: 0.5,
            };
    }
}

/**
 * Map a theme name to the starting index in the flat ALL_ICONS array.
 * THEME_ICONS keys are ordered: conflict(0), economy(3), weather(6), ...
 * Each theme has 3 icons.
 */
const THEME_ICON_OFFSETS: Record<string, number> = (() => {
    const offsets: Record<string, number> = {};
    let idx = 0;
    for (const key of Object.keys(THEME_ICONS)) {
        offsets[key] = idx;
        idx += THEME_ICONS[key].length;
    }
    return offsets;
})();

/** Convert a classified headline into layer rendering config */
export function headlineToLayerConfig(
    headline: ClassifiedHeadline,
    layerIndex: number,
    seed: number,
): LiveLayerConfig {
    const patterns = THEME_PATTERNS[headline.theme] ?? THEME_PATTERNS.general;
    const colors = THEME_COLORS[headline.theme] ?? THEME_COLORS.general;
    const params = sentimentParams(headline.sentiment, headline.intensity);

    const themeIndex = colors[layerIndex % colors.length];

    // Deterministic motif selection based on seed + layer
    const motifSeed = ((seed + layerIndex * 137) >>> 0) % 100;

    // Every 3rd layer uses an icon pattern for visual "readability"
    const useIcon = layerIndex % 3 === 0;

    if (useIcon) {
        // Pick a themed icon from the flat ALL_ICONS array
        const iconOffset = THEME_ICON_OFFSETS[headline.theme] ?? THEME_ICON_OFFSETS.general ?? 0;
        const iconCount = THEME_ICONS[headline.theme]?.length ?? 3;
        const iconMotif = iconOffset + (motifSeed % iconCount);

        return {
            patternSetIndex: ICON_PATTERN_INDEX,
            motif: iconMotif,
            filled: Math.random() < params.filledBias,
            roughness: params.roughness,
            spinFactor: params.spinFactor,
            themeIndex,
        };
    }

    // Standard abstract pattern layer
    const patternSetIndex = patterns[layerIndex % patterns.length];

    return {
        patternSetIndex,
        motif: motifSeed, // will be modulo'd by pattern count at render time
        filled: Math.random() < params.filledBias,
        roughness: params.roughness,
        spinFactor: params.spinFactor,
        themeIndex,
    };
}

/** Convert an array of classified headlines into layer configs */
export function headlinesToLayerConfigs(
    headlines: ClassifiedHeadline[],
    layerCount: number,
    seed: number,
): LiveLayerConfig[] {
    if (headlines.length === 0) return [];

    const configs: LiveLayerConfig[] = [];
    for (let i = 0; i < layerCount; i++) {
        // Cycle through headlines if we have more layers than headlines
        const headline = headlines[i % headlines.length];
        configs.push(headlineToLayerConfig(headline, i, seed));
    }
    return configs;
}

/** Keyword-based fallback classification (no LLM needed) */
export function classifyByKeywords(title: string): { theme: NewsTheme; sentiment: Sentiment; intensity: number } {
    const lower = title.toLowerCase();

    const themeKeywords: [NewsTheme, string[]][] = [
        ['conflict', ['war', 'attack', 'military', 'bomb', 'weapon', 'troops', 'invasion', 'missile', 'combat', 'battle', 'strike', 'soldier']],
        ['economy', ['market', 'stock', 'economy', 'inflation', 'gdp', 'trade', 'bank', 'finance', 'dollar', 'price', 'tax', 'debt', 'recession', 'growth']],
        ['weather', ['storm', 'hurricane', 'flood', 'drought', 'temperature', 'rain', 'snow', 'heat', 'cold', 'wind', 'tornado', 'forecast']],
        ['health', ['health', 'vaccine', 'hospital', 'disease', 'covid', 'virus', 'medical', 'drug', 'treatment', 'cancer', 'mental', 'wellness']],
        ['politics', ['president', 'election', 'vote', 'congress', 'senate', 'parliament', 'government', 'minister', 'law', 'policy', 'democrat', 'republican']],
        ['technology', ['ai', 'tech', 'software', 'app', 'robot', 'data', 'cyber', 'digital', 'startup', 'apple', 'google', 'microsoft', 'computer']],
        ['sports', ['game', 'championship', 'tournament', 'player', 'team', 'score', 'win', 'match', 'league', 'olympic', 'football', 'basketball']],
        ['culture', ['art', 'music', 'film', 'movie', 'book', 'festival', 'theater', 'museum', 'concert', 'exhibition', 'award', 'celebrity']],
        ['environment', ['climate', 'emission', 'pollution', 'energy', 'solar', 'green', 'carbon', 'recycle', 'forest', 'wildlife', 'ocean', 'species']],
        ['science', ['research', 'study', 'scientist', 'discovery', 'experiment', 'physics', 'biology', 'chemistry', 'nasa', 'quantum', 'gene']],
        ['crime', ['crime', 'murder', 'arrest', 'police', 'prison', 'court', 'trial', 'guilty', 'theft', 'fraud', 'shooting', 'suspect']],
        ['disaster', ['earthquake', 'tsunami', 'wildfire', 'explosion', 'crash', 'collapse', 'disaster', 'emergency', 'evacuation', 'death toll']],
        ['diplomacy', ['diplomat', 'treaty', 'summit', 'alliance', 'sanction', 'negotiate', 'ambassador', 'united nations', 'nato', 'peace']],
        ['education', ['school', 'university', 'student', 'education', 'teacher', 'college', 'academic', 'learning', 'scholarship']],
        ['space', ['space', 'rocket', 'satellite', 'astronaut', 'mars', 'moon', 'orbit', 'spacex', 'telescope', 'asteroid']],
    ];

    let theme: NewsTheme = 'general';
    let maxHits = 0;
    for (const [t, keywords] of themeKeywords) {
        const hits = keywords.filter(k => lower.includes(k)).length;
        if (hits > maxHits) {
            maxHits = hits;
            theme = t;
        }
    }

    // Simple sentiment from keywords
    const negativeWords = ['kill', 'death', 'crash', 'crisis', 'fear', 'threat', 'attack', 'fail', 'worst', 'warn', 'danger', 'risk', 'collapse', 'disaster', 'murder', 'bomb'];
    const positiveWords = ['win', 'success', 'growth', 'hope', 'peace', 'record', 'best', 'breakthrough', 'celebrate', 'award', 'improve', 'heal', 'rescue', 'save'];

    const negHits = negativeWords.filter(w => lower.includes(w)).length;
    const posHits = positiveWords.filter(w => lower.includes(w)).length;

    let sentiment: Sentiment = 'neutral';
    let intensity = 0.5;
    if (negHits > posHits) {
        sentiment = 'negative';
        intensity = Math.min(1, negHits * 0.3);
    } else if (posHits > negHits) {
        sentiment = 'positive';
        intensity = Math.min(1, posHits * 0.3);
    }

    return { theme, sentiment, intensity };
}
