import type { RawHeadline } from './types';

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';
const CURRENTS_API_BASE = 'https://api.currentsapi.services/v1';

/** RSS feed URLs for fallback news fetching — diverse sources for variety */
const RSS_FEEDS = [
    'https://news.google.com/rss?hl=en&gl=US&ceid=US:en',
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://feeds.reuters.com/reuters/topNews',
    'https://feeds.npr.org/1001/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://feeds.washingtonpost.com/rss/national',
    'https://www.theguardian.com/world/rss',
    'https://rss.cnn.com/rss/edition.rss',
    'https://feeds.arstechnica.com/arstechnica/index',
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
export async function fetchRSSHeadlines(count = 20): Promise<RawHeadline[]> {
    const seenTitles = new Set<string>();
    const allHeadlines: RawHeadline[] = [];

    // Fetch from multiple feeds in parallel for speed and variety
    const results = await Promise.allSettled(
        RSS_FEEDS.map(async (feedUrl): Promise<RawHeadline[]> => {
            const url = `${RSS2JSON_BASE}?rss_url=${encodeURIComponent(feedUrl)}`;
            const res = await fetch(url);
            if (!res.ok) return [];
            const data: Rss2JsonResponse = await res.json();
            if (data.status !== 'ok') return [];
            return data.items.map(item => ({
                title: item.title,
                description: item.description,
                url: item.link,
                category: item.categories?.[0],
                published: item.pubDate,
            }));
        })
    );

    // Interleave results from different feeds for diversity
    const feedResults: RawHeadline[][] = results
        .filter((r): r is PromiseFulfilledResult<RawHeadline[]> => r.status === 'fulfilled')
        .map(r => r.value)
        .filter(arr => arr.length > 0);

    const maxPerFeed = Math.max(3, Math.ceil(count / feedResults.length));
    let round = 0;
    while (allHeadlines.length < count && round < maxPerFeed) {
        for (const feed of feedResults) {
            if (round < feed.length) {
                const h = feed[round];
                // Deduplicate by normalized title
                const key = h.title.toLowerCase().replace(/\s+/g, ' ').trim();
                if (!seenTitles.has(key)) {
                    seenTitles.add(key);
                    allHeadlines.push(h);
                }
            }
            if (allHeadlines.length >= count) break;
        }
        round++;
    }

    return allHeadlines.slice(0, count);
}

/**
 * Fetch news headlines with automatic fallback:
 * 1. CurrentsAPI (if key provided)
 * 2. RSS feeds via rss2json.com
 */
export async function fetchHeadlines(currentsApiKey?: string, count = 20): Promise<RawHeadline[]> {
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
