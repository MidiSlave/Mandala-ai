import type { LiveState, ClassifiedHeadline } from './types';
import { fetchHeadlines } from './news';
import { classifyHeadlines } from './classify';
import { headlinesToLayerConfigs } from './themes';

export type { LiveState, ClassifiedHeadline, LiveLayerConfig, NewsTheme, Sentiment } from './types';
export { headlinesToLayerConfigs } from './themes';
export { buildLiveLayers, renderLiveMode, buildPhotoLiveLayers, renderPhotoLiveMode } from './render';
export type { LiveLayer, PhotoLiveLayer } from './render';
export { clearImageCache } from './image-loader';

const STORAGE_KEYS = {
    geminiKey: 'mandala-live-gemini-key',
    currentsKey: 'mandala-live-currents-key',
    enabled: 'mandala-live-enabled',
    cachedHeadlines: 'mandala-live-cached-headlines',
    cachedTimestamp: 'mandala-live-cached-timestamp',
};

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/** Load API keys from localStorage */
export function loadApiKeys(): { geminiKey: string; currentsKey: string } {
    return {
        geminiKey: localStorage.getItem(STORAGE_KEYS.geminiKey) ?? '',
        currentsKey: localStorage.getItem(STORAGE_KEYS.currentsKey) ?? '',
    };
}

/** Save API keys to localStorage */
export function saveApiKeys(geminiKey: string, currentsKey: string) {
    localStorage.setItem(STORAGE_KEYS.geminiKey, geminiKey);
    localStorage.setItem(STORAGE_KEYS.currentsKey, currentsKey);
}

/** Load cached headlines if still fresh */
function loadCachedHeadlines(): ClassifiedHeadline[] | null {
    try {
        const ts = localStorage.getItem(STORAGE_KEYS.cachedTimestamp);
        if (!ts || Date.now() - parseInt(ts) > CACHE_TTL) return null;
        const data = localStorage.getItem(STORAGE_KEYS.cachedHeadlines);
        if (!data) return null;
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/** Cache classified headlines */
function cacheHeadlines(headlines: ClassifiedHeadline[]) {
    try {
        localStorage.setItem(STORAGE_KEYS.cachedHeadlines, JSON.stringify(headlines));
        localStorage.setItem(STORAGE_KEYS.cachedTimestamp, String(Date.now()));
    } catch {
        // localStorage full or unavailable
    }
}

/**
 * Main pipeline: fetch news → classify → map to layer configs.
 * Uses caching to minimize API calls.
 */
export async function refreshLiveData(
    geminiKey: string,
    currentsKey: string,
    layerCount: number,
    seed: number,
): Promise<{
    headlines: ClassifiedHeadline[];
    layerConfigs: ReturnType<typeof headlinesToLayerConfigs>;
    fromCache: boolean;
}> {
    // Check cache first
    const cached = loadCachedHeadlines();
if (cached && cached.length > 0) {
        return {
            headlines: cached,
            layerConfigs: headlinesToLayerConfigs(cached, layerCount, seed),
            fromCache: true,
        };
    }

    // Fetch fresh headlines with a hard 8s timeout to prevent hanging
const fetchPromise = fetchHeadlines(currentsKey || undefined, 15);
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Fetch timed out')), 3000)
    );
    const raw = await Promise.race([fetchPromise, timeoutPromise]);
if (raw.length === 0) {
        throw new Error('No headlines fetched from any source');
    }

    // Classify
    const classified = await classifyHeadlines(raw, geminiKey || undefined);

    // Cache
    cacheHeadlines(classified);

    return {
        headlines: classified,
        layerConfigs: headlinesToLayerConfigs(classified, layerCount, seed),
        fromCache: false,
    };
}

/** Force clear the cache (for manual refresh) */
export function clearCache() {
    localStorage.removeItem(STORAGE_KEYS.cachedHeadlines);
    localStorage.removeItem(STORAGE_KEYS.cachedTimestamp);
}
