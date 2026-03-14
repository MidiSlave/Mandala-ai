/**
 * Maps keywords found in headlines to icon names from the icon library.
 * Used to build narrative icon sequences for each news story.
 */

/**
 * Keyword → icon name mapping.
 * Each keyword maps to an icon name that exists in the icon library.
 * Multiple keywords can map to the same icon.
 */
const KEYWORD_ICONS: [string, string][] = [
    // Conflict / War
    ['war', 'sword'], ['attack', 'explosion'], ['military', 'shield'],
    ['bomb', 'explosion'], ['weapon', 'sword'], ['troops', 'shield'],
    ['invasion', 'explosion'], ['missile', 'rocket'], ['combat', 'sword'],
    ['battle', 'shield'], ['strike', 'explosion'], ['soldier', 'shield'],
    ['army', 'shield'], ['navy', 'satellite'], ['defense', 'shield'],
    ['nuclear', 'warning'], ['terror', 'warning'], ['drone', 'satellite'],

    // Economy / Finance
    ['market', 'trending-up'], ['stock', 'bar-chart'], ['economy', 'coins'],
    ['inflation', 'trending-up'], ['trade', 'globe'], ['bank', 'landmark'],
    ['finance', 'coins'], ['dollar', 'coins'], ['price', 'trending-up'],
    ['tax', 'landmark'], ['debt', 'bar-chart'], ['recession', 'trending-up'],
    ['growth', 'trending-up'], ['invest', 'coins'], ['profit', 'coins'],
    ['budget', 'bar-chart'], ['crypto', 'code'], ['bitcoin', 'coins'],

    // Weather / Climate
    ['storm', 'lightning'], ['hurricane', 'lightning'], ['flood', 'cloud'],
    ['drought', 'sun'], ['temperature', 'sun'], ['rain', 'cloud'],
    ['snow', 'cloud'], ['heat', 'sun'], ['cold', 'cloud'],
    ['wind', 'cloud'], ['tornado', 'lightning'], ['forecast', 'cloud'],
    ['wildfire', 'flame'], ['fire', 'flame'],

    // Health / Medical
    ['health', 'heart-pulse'], ['vaccine', 'medical-cross'], ['hospital', 'medical-cross'],
    ['disease', 'pill'], ['covid', 'medical-cross'], ['virus', 'pill'],
    ['medical', 'medical-cross'], ['drug', 'pill'], ['treatment', 'pill'],
    ['cancer', 'heart-pulse'], ['mental', 'heart-pulse'], ['wellness', 'heart-pulse'],
    ['surgeon', 'medical-cross'], ['patient', 'heart-pulse'], ['pandemic', 'warning'],
    ['outbreak', 'warning'],

    // Politics / Government
    ['president', 'landmark'], ['election', 'flag'], ['vote', 'flag'],
    ['congress', 'landmark'], ['senate', 'landmark'], ['parliament', 'landmark'],
    ['government', 'landmark'], ['minister', 'landmark'], ['law', 'scale'],
    ['policy', 'flag'], ['democrat', 'flag'], ['republican', 'flag'],
    ['campaign', 'flag'], ['debate', 'scale'], ['reform', 'scale'],
    ['legislation', 'landmark'],

    // Technology
    ['ai', 'cpu'], ['tech', 'cpu'], ['software', 'code'],
    ['app', 'code'], ['robot', 'cpu'], ['data', 'bar-chart'],
    ['cyber', 'lock'], ['digital', 'cpu'], ['startup', 'trending-up'],
    ['apple', 'cpu'], ['google', 'search'], ['microsoft', 'cpu'],
    ['computer', 'cpu'], ['internet', 'wifi'], ['chip', 'cpu'],
    ['algorithm', 'code'], ['cloud', 'cloud'], ['hack', 'lock'],

    // Sports
    ['game', 'trophy'], ['championship', 'trophy'], ['tournament', 'trophy'],
    ['player', 'medal'], ['team', 'medal'], ['score', 'target'],
    ['win', 'trophy'], ['match', 'trophy'], ['league', 'medal'],
    ['olympic', 'medal'], ['football', 'target'], ['basketball', 'target'],
    ['soccer', 'target'], ['tennis', 'target'], ['coach', 'medal'],
    ['champion', 'trophy'], ['record', 'medal'],

    // Culture / Arts
    ['art', 'palette'], ['music', 'music-note'], ['film', 'film'],
    ['movie', 'film'], ['book', 'book'], ['festival', 'music-note'],
    ['theater', 'film'], ['museum', 'palette'], ['concert', 'music-note'],
    ['exhibition', 'palette'], ['award', 'trophy'], ['celebrity', 'star'],
    ['singer', 'music-note'], ['director', 'film'], ['novel', 'book'],
    ['gallery', 'palette'],

    // Environment
    ['climate', 'tree'], ['emission', 'cloud'], ['pollution', 'warning'],
    ['energy', 'lightning'], ['solar', 'sun'], ['green', 'leaf'],
    ['carbon', 'cloud'], ['recycle', 'recycle'], ['forest', 'tree'],
    ['wildlife', 'leaf'], ['ocean', 'globe'], ['species', 'leaf'],
    ['conservation', 'tree'], ['sustainable', 'recycle'], ['deforestation', 'tree'],

    // Science
    ['research', 'flask'], ['study', 'microscope'], ['scientist', 'atom'],
    ['discovery', 'search'], ['experiment', 'flask'], ['physics', 'atom'],
    ['biology', 'microscope'], ['chemistry', 'flask'], ['nasa', 'rocket'],
    ['quantum', 'atom'], ['gene', 'microscope'], ['dna', 'microscope'],
    ['lab', 'flask'], ['theory', 'atom'],

    // Crime
    ['crime', 'lock'], ['murder', 'gavel'], ['arrest', 'lock'],
    ['police', 'shield'], ['prison', 'lock'], ['court', 'gavel'],
    ['trial', 'gavel'], ['guilty', 'gavel'], ['theft', 'lock'],
    ['fraud', 'lock'], ['shooting', 'warning'], ['suspect', 'fingerprint'],
    ['detective', 'search'], ['evidence', 'fingerprint'], ['jury', 'scale'],
    ['sentence', 'gavel'],

    // Disaster
    ['earthquake', 'earthquake'], ['tsunami', 'lightning'], ['explosion', 'explosion'],
    ['crash', 'warning'], ['collapse', 'earthquake'], ['disaster', 'flame'],
    ['emergency', 'warning'], ['evacuation', 'warning'], ['death', 'warning'],
    ['rescue', 'medical-cross'], ['survivor', 'heart-pulse'], ['damage', 'earthquake'],
    ['destroyed', 'flame'],

    // Diplomacy
    ['diplomat', 'handshake'], ['treaty', 'handshake'], ['summit', 'globe'],
    ['alliance', 'handshake'], ['sanction', 'flag'], ['negotiate', 'handshake'],
    ['ambassador', 'globe'], ['united nations', 'globe'], ['nato', 'shield'],
    ['peace', 'dove'], ['refugee', 'globe'], ['aid', 'heart-pulse'],
    ['humanitarian', 'dove'],

    // Education
    ['school', 'book'], ['university', 'graduation-cap'], ['student', 'graduation-cap'],
    ['education', 'book'], ['teacher', 'pencil'], ['college', 'graduation-cap'],
    ['academic', 'graduation-cap'], ['learning', 'book'], ['scholarship', 'medal'],
    ['degree', 'graduation-cap'], ['professor', 'book'], ['campus', 'landmark'],

    // Space
    ['space', 'rocket'], ['rocket', 'rocket'], ['satellite', 'satellite'],
    ['astronaut', 'rocket'], ['mars', 'star'], ['moon', 'star'],
    ['orbit', 'satellite'], ['spacex', 'rocket'], ['telescope', 'search'],
    ['asteroid', 'star'], ['galaxy', 'star'], ['cosmos', 'star'],
    ['launch', 'rocket'], ['station', 'satellite'],

    // Countries / regions (map to flag or globe)
    ['iran', 'flag'], ['israel', 'flag'], ['china', 'flag'],
    ['russia', 'flag'], ['ukraine', 'flag'], ['usa', 'flag'],
    ['america', 'flag'], ['europe', 'globe'], ['africa', 'globe'],
    ['asia', 'globe'], ['india', 'flag'], ['japan', 'flag'],
    ['korea', 'flag'], ['britain', 'flag'], ['france', 'flag'],
    ['germany', 'flag'], ['brazil', 'flag'], ['australia', 'globe'],
    ['mexico', 'flag'], ['canada', 'flag'], ['turkey', 'flag'],
    ['saudi', 'flag'], ['syria', 'flag'], ['iraq', 'flag'],
    ['afghanistan', 'flag'], ['pakistan', 'flag'],

    // General / People
    ['people', 'globe'], ['world', 'globe'], ['global', 'globe'],
    ['country', 'flag'], ['nation', 'flag'], ['international', 'globe'],
    ['crisis', 'warning'], ['protest', 'flag'], ['rally', 'flag'],
    ['death', 'warning'], ['kill', 'warning'], ['children', 'heart-pulse'],
    ['women', 'heart-pulse'], ['rights', 'scale'], ['freedom', 'dove'],
    ['democracy', 'scale'], ['oil', 'flame'], ['gas', 'flame'],
    ['ship', 'satellite'], ['transport', 'satellite'],
];

/**
 * Extract a sequence of icon names from a headline.
 * Returns an ordered list of icon names based on keyword matches.
 */
export function headlineToIconSequence(title: string, maxIcons = 12): string[] {
    const lower = title.toLowerCase();
    const matched: { icon: string; pos: number }[] = [];
    const seen = new Set<string>();

    for (const [keyword, iconName] of KEYWORD_ICONS) {
        const idx = lower.indexOf(keyword);
        if (idx >= 0) {
            // Track position for ordering, but deduplicate icons
            if (!seen.has(iconName + ':' + idx)) {
                matched.push({ icon: iconName, pos: idx });
                seen.add(iconName + ':' + idx);
            }
        }
    }

    // Sort by position in headline (narrative order)
    matched.sort((a, b) => a.pos - b.pos);

    // Deduplicate consecutive same icons
    const result: string[] = [];
    for (const m of matched) {
        if (result.length === 0 || result[result.length - 1] !== m.icon) {
            result.push(m.icon);
        }
        if (result.length >= maxIcons) break;
    }

    return result;
}

/**
 * If LLM is available, ask it to pick icons for a headline.
 * Falls back to keyword-based mapping.
 */
export function headlineToIconSequenceWithFallback(
    title: string,
    llmIcons?: string[], // Optional LLM-suggested icon names
    maxIcons = 12,
): string[] {
    if (llmIcons && llmIcons.length > 0) {
        return llmIcons.slice(0, maxIcons);
    }
    return headlineToIconSequence(title, maxIcons);
}
