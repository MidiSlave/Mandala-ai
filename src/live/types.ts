/** Theme categories that news headlines can be classified into */
export type NewsTheme =
    | 'conflict' | 'economy' | 'weather' | 'health'
    | 'politics' | 'technology' | 'sports' | 'culture'
    | 'environment' | 'science' | 'crime' | 'disaster'
    | 'diplomacy' | 'education' | 'space' | 'general';

/** Sentiment of a headline */
export type Sentiment = 'positive' | 'negative' | 'neutral';

/** A classified headline ready for visualization */
export interface ClassifiedHeadline {
    title: string;
    theme: NewsTheme;
    sentiment: Sentiment;
    intensity: number; // 0-1, how strong the sentiment is
    source?: string;
    url?: string;
    category?: string; // raw category from news API
}

/** Layer configuration derived from a classified headline */
export interface LiveLayerConfig {
    patternSetIndex: number;
    motif: number;
    filled: boolean;
    roughness: number;   // sentiment-driven
    spinFactor: number;  // sentiment-driven
    themeIndex: number;   // color theme index
    /** Icon motif indices for each symmetry slice (story-specific icon sequence) */
    iconSequence?: number[];
}

/** Raw headline from news API */
export interface RawHeadline {
    title: string;
    description?: string;
    source?: string;
    url?: string;
    category?: string;
    published?: string;
}

/** State of the live data pipeline */
export interface LiveState {
    enabled: boolean;
    headlines: ClassifiedHeadline[];
    layerConfigs: LiveLayerConfig[];
    lastFetch: number;    // timestamp
    lastClassify: number; // timestamp
    error: string | null;
    loading: boolean;
}
