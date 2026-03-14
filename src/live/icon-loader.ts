/**
 * Dynamically loads Lucide icon data and converts to Canvas2D Path2D objects.
 * Icons are loaded on-demand and cached for reuse.
 */

import { parseIconNode, type CanvasIcon, type IconNode } from './lucide-canvas';

/** Cache of loaded icons by name */
const loadedIcons = new Map<string, CanvasIcon>();

/** Set of icons currently being loaded (to avoid duplicate fetches) */
const loading = new Set<string>();

/** Callbacks waiting for icon loads */
const waiters = new Map<string, (() => void)[]>();

/**
 * Get a cached icon. Returns undefined if not yet loaded.
 * Call `ensureIconsLoaded` to trigger loading.
 */
export function getIcon(name: string): CanvasIcon | undefined {
    return loadedIcons.get(name);
}

/**
 * Check if an icon is loaded and ready.
 */
export function isIconLoaded(name: string): boolean {
    return loadedIcons.has(name);
}

/**
 * Load a single Lucide icon by name.
 * Returns the parsed CanvasIcon, or undefined if it fails.
 */
async function loadIcon(name: string): Promise<CanvasIcon | undefined> {
    if (loadedIcons.has(name)) return loadedIcons.get(name);
    if (loading.has(name)) {
        // Wait for existing load
        return new Promise<CanvasIcon | undefined>(resolve => {
            const list = waiters.get(name) ?? [];
            list.push(() => resolve(loadedIcons.get(name)));
            waiters.set(name, list);
        });
    }

    loading.add(name);
    try {
        // Dynamic import from lucide-react's ESM icons
        const mod = await import(`../../node_modules/lucide-react/dist/esm/icons/${name}.js`);
        const iconNode: IconNode = mod.__iconNode;
        if (iconNode) {
            const icon = parseIconNode(name, iconNode);
            loadedIcons.set(name, icon);

            // Notify waiters
            const list = waiters.get(name);
            if (list) {
                list.forEach(cb => cb());
                waiters.delete(name);
            }
            return icon;
        }
    } catch (e) {
        console.warn(`Failed to load Lucide icon: ${name}`, e);
    } finally {
        loading.delete(name);
    }
    return undefined;
}

/**
 * Ensure a list of icons are loaded. Non-blocking — starts loading
 * in background and returns immediately. Check with `getIcon()` later.
 * Optional `onReady` callback fires once all requested icons have loaded.
 */
export function ensureIconsLoaded(names: string[], onReady?: () => void): void {
    const pending: Promise<unknown>[] = [];
    for (const name of names) {
        if (!loadedIcons.has(name)) {
            pending.push(loadIcon(name));
        }
    }
    if (onReady && pending.length > 0) {
        Promise.all(pending).then(onReady);
    }
}

/**
 * Load all icons and return when complete.
 */
export async function loadAllIcons(names: string[]): Promise<void> {
    await Promise.all(names.map(n => loadIcon(n)));
}

/**
 * Get the number of currently loaded icons.
 */
export function loadedIconCount(): number {
    return loadedIcons.size;
}
