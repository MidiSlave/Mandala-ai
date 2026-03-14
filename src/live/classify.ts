import type { RawHeadline, ClassifiedHeadline, NewsTheme, Sentiment } from './types';
import { classifyByKeywords } from './themes';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

interface GeminiClassification {
    theme: NewsTheme;
    sentiment: Sentiment;
    intensity: number;
}

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

const SYSTEM_PROMPT = `You are a headline classifier. For each headline, return a JSON object with:
- "theme": one of: conflict, economy, weather, health, politics, technology, sports, culture, environment, science, crime, disaster, diplomacy, education, space, general
- "sentiment": one of: positive, negative, neutral
- "intensity": a number from 0 to 1 (how strong the sentiment is)

Return ONLY a JSON array of objects, one per headline. No markdown, no explanation.`;

/**
 * Classify headlines using Google Gemini API directly via fetch.
 * Uses the REST API to avoid SDK bundle size.
 */
export async function classifyWithGemini(
    headlines: RawHeadline[],
    apiKey: string,
): Promise<ClassifiedHeadline[]> {
    const titles = headlines.map((h, i) => `${i + 1}. ${h.title}`).join('\n');
    const prompt = `Classify these headlines:\n${titles}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }],
            }],
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
            },
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1024,
                responseMimeType: 'application/json',
            },
        }),
    });

    if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data: GeminiResponse = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');

    const classifications: GeminiClassification[] = JSON.parse(text);

    return headlines.map((h, i) => {
        const c = classifications[i] ?? { theme: 'general', sentiment: 'neutral', intensity: 0.5 };
        return {
            title: h.title,
            theme: c.theme,
            sentiment: c.sentiment,
            intensity: Math.max(0, Math.min(1, c.intensity)),
            source: h.source,
            url: h.url,
            category: h.category,
        };
    });
}

/**
 * Classify headlines with fallback:
 * 1. Gemini API (if key provided)
 * 2. Keyword-based local classification
 */
export async function classifyHeadlines(
    headlines: RawHeadline[],
    geminiApiKey?: string,
): Promise<ClassifiedHeadline[]> {
    if (geminiApiKey) {
        try {
            return await classifyWithGemini(headlines, geminiApiKey);
        } catch {
            // Fall through to keyword classification
        }
    }

    // Fallback: keyword-based classification (no API needed)
    return headlines.map(h => {
        const c = classifyByKeywords(h.title);
        return {
            title: h.title,
            theme: c.theme,
            sentiment: c.sentiment,
            intensity: c.intensity,
            source: h.source,
            url: h.url,
            category: h.category,
        };
    });
}
