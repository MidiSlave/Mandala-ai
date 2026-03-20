/**
 * Async image loader for Photo Live mode.
 * Loads news article images with CORS handling and caches them.
 * Falls back gracefully — if an image fails to load, it's simply unavailable.
 */

/** Cache of loaded images keyed by URL */
const imageCache = new Map<string, HTMLImageElement>();

/** Set of URLs currently being loaded */
const loading = new Set<string>();

/** Set of URLs that failed to load */
const failed = new Set<string>();

/**
 * Get a loaded image by URL, or null if not yet loaded / failed.
 */
export function getImage(url: string): HTMLImageElement | null {
    return imageCache.get(url) ?? null;
}

/**
 * Check if any images are available (at least one loaded successfully).
 */
export function hasAnyImages(): boolean {
    return imageCache.size > 0;
}

/**
 * Load a single image. Returns a promise that resolves to the image or null on failure.
 */
function loadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        if (imageCache.has(url)) { resolve(imageCache.get(url)!); return; }
        if (failed.has(url)) { resolve(null); return; }
        if (loading.has(url)) { resolve(null); return; }

        loading.add(url);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const timer = setTimeout(() => {
            loading.delete(url);
            failed.add(url);
            resolve(null);
        }, 8000);

        img.onload = () => {
            clearTimeout(timer);
            loading.delete(url);
            imageCache.set(url, img);
            resolve(img);
        };
        img.onerror = () => {
            clearTimeout(timer);
            loading.delete(url);
            failed.add(url);
            resolve(null);
        };
        img.src = url;
    });
}

/**
 * Ensure all given image URLs are loading/loaded.
 * Calls `onReady` once at least one image has loaded (for triggering redraws).
 */
export function ensureImagesLoaded(urls: string[], onReady?: () => void): void {
    const toLoad = urls.filter(u => u && !imageCache.has(u) && !failed.has(u) && !loading.has(u));
    if (toLoad.length === 0) return;

    let fired = false;
    for (const url of toLoad) {
        loadImage(url).then((img) => {
            if (img && !fired && onReady) {
                fired = true;
                onReady();
            }
        });
    }
}

/**
 * Clear the image cache (e.g. on live refresh).
 */
export function clearImageCache(): void {
    imageCache.clear();
    loading.clear();
    failed.clear();
}
