import type { RawHeadline } from './types';

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';
const CURRENTS_API_BASE = 'https://api.currentsapi.services/v1';

/** RSS feed URLs for fallback news fetching */
const RSS_FEEDS = [
    'https://news.google.com/rss?hl=en&gl=US&ceid=US:en',
    'https://feeds.bbci.co.uk/news/rss.xml',
];

interface CurrentsArticle {
    title: string;
    description: string;
    url: string;
    author: string;
    category: string[];
    published: string;
}

interface CurrentsResponse {
    status: string;
    news: CurrentsArticle[];
}

interface Rss2JsonItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    categories: string[];
}

interface Rss2JsonResponse {
    status: string;
    items: Rss2JsonItem[];
}

/** Fetch headlines from CurrentsAPI (primary source, 600 req/day, CORS-enabled) */
export async function fetchCurrentsAPI(apiKey: string, count = 10): Promise<RawHeadline[]> {
    const url = `${CURRENTS_API_BASE}/latest-news?apiKey=${encodeURIComponent(apiKey)}&language=en&page_size=${count}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CurrentsAPI error: ${res.status}`);

    const data: CurrentsResponse = await res.json();
    if (data.status !== 'ok') throw new Error('CurrentsAPI returned non-ok status');

    return data.news.map(article => ({
        title: article.title,
        description: article.description,
        source: article.author,
        url: article.url,
        category: article.category?.[0],
        published: article.published,
    }));
}

/** Fetch headlines from RSS feeds via rss2json.com (fallback, no API key needed) */
export async function fetchRSSHeadlines(count = 10): Promise<RawHeadline[]> {
    const allHeadlines: RawHeadline[] = [];

    for (const feedUrl of RSS_FEEDS) {
        try {
            const url = `${RSS2JSON_BASE}?rss_url=${encodeURIComponent(feedUrl)}`;
            const res = await fetch(url);
            if (!res.ok) continue;

            const data: Rss2JsonResponse = await res.json();
            if (data.status !== 'ok') continue;

            for (const item of data.items) {
                allHeadlines.push({
                    title: item.title,
                    description: item.description,
                    url: item.link,
                    category: item.categories?.[0],
                    published: item.pubDate,
                });
            }
        } catch {
            // Try next feed
            continue;
        }

        if (allHeadlines.length >= count) break;
    }

    return allHeadlines.slice(0, count);
}

/**
 * Fetch news headlines with automatic fallback:
 * 1. CurrentsAPI (if key provided)
 * 2. RSS feeds via rss2json.com
 */
export async function fetchHeadlines(currentsApiKey?: string, count = 10): Promise<RawHeadline[]> {
    // Try CurrentsAPI first if key is available
    if (currentsApiKey) {
        try {
            return await fetchCurrentsAPI(currentsApiKey, count);
        } catch {
            // Fall through to RSS
        }
    }

    // Fallback to RSS
    return fetchRSSHeadlines(count);
}
