# Mandala Live — Research Report

> Turning the Mandala generator into a living data visualization fed by news, events, and text input.

---

## Table of Contents

1. [Free LLM APIs (Client-Side)](#1-free-llm-apis-client-side)
2. [Free News/Events APIs](#2-free-newsevents-apis)
3. [SVG/Icon/Emoji Libraries](#3-svgiconemoji-libraries)
4. [SVG-to-UV Conversion Feasibility](#4-svg-to-uv-conversion-feasibility)
5. [Approach Evaluation (A through E)](#5-approach-evaluation)
6. [Recommended Stack & Architecture](#6-recommended-stack--architecture)
7. [Constraints & Risks](#7-constraints--risks)

---

## 1. Free LLM APIs (Client-Side)

The core challenge: we need an LLM to classify headlines into themes/sentiments. This is a small task (~500 tokens in, ~200 tokens out). Must work from a static GitHub Pages site with **no backend**.

### Google Gemini (generativelanguage.googleapis.com) — **Best Option**

| Metric | Free Tier |
|--------|-----------|
| Gemini 2.5 Flash-Lite | 15 RPM, **1,000 RPD** |
| Gemini 2.5 Flash | 10 RPM, 250 RPD |
| Gemini 2.5 Pro | 5 RPM, 100 RPD |
| Token limit | 250,000 TPM (all models) |
| Credit card | Not required |
| Context window | 1M tokens |

**CORS:** **YES — confirmed working.** The `@google/genai` SDK ships a browser-specific build and `generativelanguage.googleapis.com` returns proper CORS headers. This is one of the few major LLM APIs that actually works natively from browser-side `fetch()`.

**Key security:** API keys can be restricted by HTTP referrer in Google Cloud Console (e.g., limit to `*.github.io`), and scoped to only the Generative Language API. Referrer restrictions can be spoofed from server-side scripts, but since this is a free tier with no billing, abuse is limited to quota exhaustion.

**Firebase AI Logic** is Google's recommended path for production client-side apps — it adds Firebase App Check for security. But it requires a Firebase project (adds complexity).

**Response latency:** Flash-Lite is very fast, typically under 1 second for small classification tasks.

**Browser SDK:** `@google/genai` (npm, current v1.44.0) — works natively in browser with API key auth.

**Verdict:** **Clear winner for static GitHub Pages.** 1,000 req/day on Flash-Lite is generous for 5-15 min refresh intervals. CORS works natively. Domain-restricted keys. Fast responses. No credit card.

### Groq

| Metric | Free Tier |
|--------|-----------|
| Rate limit | ~30 RPM |
| Daily limit | ~14,400 RPD |
| Token limit | Varies by model |
| Credit card | Not required |
| Latency | Extremely fast (~100-500ms) |

**CORS:** **NO.** The `api.groq.com` endpoint does **not** return CORS headers for browser origins. The TypeScript SDK has a `dangerouslyAllowBrowser` flag but the API itself blocks cross-origin requests. Direct browser `fetch()` calls will fail.

**Key security:** No domain-restriction option. Keys are plain bearer tokens.

**Verdict:** Fastest inference available (~sub-500ms) with generous limits (14,400 RPD). But **unusable without a CORS proxy or backend**. Not viable for a pure static site.

### OpenRouter

| Metric | Free Tier |
|--------|-----------|
| Rate limit | 50 RPD (free), 1,000 RPD ($10 credit purchase) |
| Models | 24+ free models (Gemini, Llama, Mistral, etc.) |
| API format | OpenAI-compatible |
| Credit card | Not required for free |

**CORS:** **NO.** OpenRouter's API does not return CORS headers for browser origins. Needs a proxy for client-side use.

**Verdict:** Good model diversity but **unusable without a proxy**. Low free limits (50/day). The `openrouter/free` endpoint auto-selects models.

### Cloudflare Workers AI

| Metric | Free Tier |
|--------|-----------|
| Compute | 10,000 Neurons/day |
| Models | Multiple open-source models |
| Credit card | Not required |

**CORS:** Not applicable — it's a serverless compute platform. You deploy a Worker script (~10 lines of code) that holds your API key securely and proxies requests. Free to deploy, runs on Cloudflare's edge network.

**Verdict:** **Best for solving the API key exposure problem.** 100,000 AI requests/day free tier is enormous. A Cloudflare Worker can securely proxy both LLM and news API calls. But requires deploying a Worker (not purely static site anymore).

### Summary Table

| Provider | Free RPD | CORS from Browser | Key Security | Latency | Usable from Static Site? |
|----------|----------|-------------------|-------------|---------|--------------------------|
| **Gemini** | **1,000** (Flash-Lite) | **YES (native)** | HTTP referrer restrict | <1s | **YES — best option** |
| Groq | ~14,400 | **NO** | None | ~0.1-0.5s | No (needs proxy) |
| OpenRouter | 50-200 | **NO** | None | 1-3s | No (needs proxy) |
| CF Workers AI | 100K | N/A (is the proxy) | Secure (server-side) | ~1-2s | Yes, but needs Worker deploy |
| Hugging Face | Limited | Mostly yes | None | 10-30s cold start | Too slow |

---

## 2. Free News/Events APIs

### The CORS Problem

**Most news APIs block browser-side requests on free tiers.** This is the single biggest constraint for a static GitHub Pages deployment. CORS restrictions are server-side — there's no client-side fix.

### NewsAPI.org

| Metric | Free (Developer) Tier |
|--------|-----------------------|
| Rate limit | 100 requests/day |
| Articles | Max 20 per request |
| Historical | 24 months |
| Languages | 14 |

**CORS:** **Explicitly blocked.** Returns `corsNotAllowed` error for browser requests. Only allows requests from `localhost`. This is intentional and well-documented.

**Verdict:** Unusable for client-side on GitHub Pages. Would need a proxy.

### CurrentsAPI (**Best Option**)

| Metric | Free Tier |
|--------|-----------|
| Rate limit | **600 requests/day** |
| Articles | Structured JSON with full-text extraction |
| Sources | 90,000+ articles ingested daily |
| Categories | Yes (business, sports, tech, etc.) |
| Languages | 18+ |
| Countries | 70+ |
| Historical | 6 months |

**CORS:** **Yes, CORS-enabled.** Browser-side `fetch()` calls work from any origin.

**Verdict:** **Most generous free tier with working CORS.** 6x more requests than GNews. Built-in categories reduce LLM classification needs.

### GNews.io

| Metric | Free Tier |
|--------|-----------|
| Rate limit | 100 requests/day, max 1 req/sec |
| Articles | Max 10 per request |
| Sources | 80,000+ (based on Google News rankings) |
| Features | Category/language filtering, full content via deep-learning extractor |

**CORS:** **Yes, confirmed CORS-enabled for all origins.** Browser-side calls work.

**Verdict:** Good quality, confirmed CORS. Non-commercial use only on free tier. 100 req/day is sufficient for 5-15 min refresh intervals.

### NewsData.io

| Metric | Free Tier |
|--------|-----------|
| Rate limit | 200 credits/day (10 articles/credit = 2,000 articles/day) |
| Articles | Max 10 per request |
| Sources | 79,451 across 206 countries |
| Languages | 89 |
| Categories | Yes (built-in) + AI sentiment analysis |

**CORS:** **Localhost only on free tier.** Production CORS requires paid plan.

**Verdict:** Excellent data quality but unusable for static site (same CORS block as NewsAPI.org).

### Webz.io News API Lite

| Metric | Free Tier |
|--------|-----------|
| Rate limit | 1,000 calls/month (~33/day) |
| Articles | Max 10 per call |
| Features | Sentiment analysis, IPTC categories, entity extraction |
| Languages | 170+ |

**CORS:** Not documented.

**Verdict:** Lower volume but includes sentiment analysis and categorization. CORS status uncertain.

### Wikipedia Current Events

| Metric | Free Tier |
|--------|-----------|
| Rate limit | Unlimited (be polite, set User-Agent) |
| API key | Not required |
| Languages | 15+ |
| Content | Curated daily events by Wikipedia editors |

**CORS:** **Yes**, with `&origin=*` query parameter.

**Verdict:** Free, no key, CORS works. Good for "events of the day" summaries. Not a live news feed — more encyclopedic/curated.

### Reddit JSON API

| Metric | Free Tier |
|--------|-----------|
| Rate limit | ~10 requests/minute (unauthenticated) |
| API key | Not required — append `.json` to any subreddit URL |
| Endpoints | `/r/news/hot.json`, `/r/worldnews/top.json`, `/r/technology/hot.json` |

**CORS:** **Mostly yes** — sends `Access-Control-Allow-Origin: *`. However, Firefox strict tracking protection blocks Reddit (flagged as tracker).

**Verdict:** Useful supplement, no API key needed. Firefox compatibility concern. Community-curated, not editorial.

### RSS-to-JSON Services (CORS-Friendly)

These are the **most viable option** for a static site:

| Service | CORS | Free Tier | Notes |
|---------|------|-----------|-------|
| **rss2json.com** | Yes | Free with rate limits | Most established |
| **AllOrigins** | Yes (proxy) | Unlimited* | Prepend `api.allorigins.win/raw?url=` |
| **Toptal feed2json** | Yes | Free | Simple, reliable |
| **x2j.dev** | Yes | Free | Fast, minimalist |

**How it works:** Fetch Google News RSS, BBC RSS, Reuters RSS, etc. via an RSS-to-JSON proxy. Parse the headlines client-side. No API key needed.

**Key RSS feeds for news:**
- Google News: `https://news.google.com/rss` (by topic/country)
- BBC: `http://feeds.bbci.co.uk/news/rss.xml`
- Reuters: `https://www.reutersagency.com/feed/`
- NPR: `https://feeds.npr.org/1001/rss.xml`
- Al Jazeera, The Guardian, etc. all have RSS

**Verdict:** **Best approach for static site.** RSS feeds are free, no API key, and RSS-to-JSON proxies solve CORS. Quality is high (major news outlets). Downside: no built-in sentiment/category data — need LLM for that.

### Puter.js (CORS Bypass)

A JS library (`puter.net.fetch()`) that acts as a drop-in `fetch()` replacement, bypassing CORS restrictions via WebSocket relay. No API key, no backend.

**Verdict:** Could unlock any news API from client-side. But adds a dependency on Puter's infrastructure. Worth investigating as a fallback.

### CORS-Support Summary

| API/Service | CORS from browser? | Free tier limits | Best for |
|---|---|---|---|
| **CurrentsAPI** | **Yes** | 600 req/day | Primary — most generous with CORS |
| **GNews.io** | **Yes** | 100 req/day | Secondary — good quality (non-commercial) |
| **rss2json.com + RSS feeds** | **Yes** | ~10,000 req/day | Most flexible — any RSS feed as JSON |
| **Toptal feed2json + RSS** | **Yes** | Free (unknown limits) | Backup RSS-to-JSON converter |
| **Wikipedia Current Events** | **Yes** (with `origin=*`) | Unlimited | Curated daily event summaries |
| **Reddit .json** | Mostly (not Firefox strict) | ~10 req/min | Supplemental, community-curated |
| NewsAPI.org | **No** (localhost only) | 100 req/day | Unusable without proxy |
| Newsdata.io | **No** (localhost only) | 200 credits/day | Unusable without proxy |
| Mediastack | **No** (+ HTTP only) | 100 req/month | Unusable |

### Recommended News Strategy

1. **Primary:** CurrentsAPI (600 req/day, CORS-enabled, built-in categories) — reduces LLM classification burden
2. **Secondary:** RSS feeds via rss2json.com (Google News, BBC, Reuters) — no API key, unlimited sources
3. **Supplement:** GNews.io (100 req/day, CORS-enabled) for additional coverage
4. **Fallback:** Wikipedia Current Events for curated daily summaries (no key needed)
5. **User input:** Also accept pasted text/URLs as manual data source

---

## 3. SVG/Icon/Emoji Libraries

### OpenMoji

| Metric | Details |
|--------|---------|
| Icons | 4,400+ |
| License | CC BY-SA 4.0 |
| Format | SVG, PNG (72px, 618px) |
| Categories | Full Unicode emoji categories |
| Searchable | Yes, by keyword/group |

Follows Unicode emoji standard. Categories include: faces, people, animals, plants, food, travel, activities, objects, symbols, flags. Thematic coverage for news topics: yes (fire, water, money, warning, peace, weapons, medical, etc.).

### Lucide Icons (already in project)

| Metric | Details |
|--------|---------|
| Icons | 1,500+ |
| License | ISC (permissive) |
| Categories | By semantic tags |
| Already imported | Yes |

Good coverage of abstract/UI concepts. Less thematic diversity than emoji sets but already a dependency.

### Tabler Icons

| Metric | Details |
|--------|---------|
| Icons | 5,800+ |
| License | MIT |
| Categories | 70+ categories |

Largest free icon set. Great category tagging. Line-art style would work well with the mandala's hand-drawn aesthetic.

### Noto Emoji (Google)

| Metric | Details |
|--------|---------|
| Icons | 3,600+ |
| License | Apache 2.0 (very permissive) |
| Format | SVG |
| Style | Colorful, detailed |

Part of Google's Noto fonts project. Available as individual SVG files on GitHub. Very detailed — may be too complex for UV conversion.

### Material Symbols / Pictogrammers MDI

| Metric | Google Material Symbols | Pictogrammers MDI (community) |
|--------|------------------------|-------------------------------|
| Icons | 2,500+ | 7,200+ |
| License | Apache 2.0 | Apache 2.0 |
| Categories | Well-organized | Category + tag metadata in `data.json` |
| Styles | Outlined, rounded, sharp | Outline + filled |

Clean geometric style. Good for abstract concept representation. Pictogrammers MDI is the largest single Apache 2.0 set.

### Iconify (Meta-Library / Aggregator)

| Metric | Details |
|--------|---------|
| Icons | 275,000+ from 200+ icon sets |
| License | Varies per set (respects originals) |
| API | REST search by keyword, category, prefix, style |
| SVG access | `https://api.iconify.design/{prefix}/{name}.svg` |

One API to search across all major icon sets. Could be used during curation to find the best icons per theme across all libraries simultaneously. Can be self-hosted.

### Theme-to-Icon Mapping Feasibility

A curated mapping is very feasible. Example:

| News Theme | Icon Sources |
|------------|-------------|
| Conflict/War | swords, shield, explosion, fire |
| Economy/Finance | trending-up, coins, bank, chart |
| Weather/Climate | cloud, sun, wind, thermometer |
| Health/Medical | heart-pulse, pill, stethoscope |
| Politics | landmark, scale, gavel, flag |
| Technology | cpu, smartphone, wifi, code |
| Sports | trophy, medal, activity |
| Culture/Arts | palette, music, film, book |
| Environment | leaf, tree, globe, recycle |
| Science | atom, microscope, flask |

Most of these exist across all libraries listed above. Building a table of ~50-100 themed icons is straightforward.

---

## 4. SVG-to-UV Conversion Feasibility

### Libraries Available

**Parsing SVG path `d` attributes:**

| Library | What It Does | Browser? | License |
|---------|-------------|----------|---------|
| **svg-path-parser** (hughsk) | PEG.js grammar → command objects with x,y; `makeAbsolute()` | Yes | MIT |
| **svgpath** (npm) | Chainable transforms; `.unarc()` arcs→beziers; `.abs()` | Yes | MIT |
| **svg-pathdata** (nfroidure) | Streaming parser; transformer architecture | Yes | MIT |
| **parse-svg-path** (jkroso) | Minimal → `[command, ...args]` arrays (~1KB) | Yes | MIT |
| **PathToPoints** (Shinao) | SVG paths → point arrays directly | Yes | MIT |

**Sampling points along paths (flattening curves):**

| Library | What It Does | Browser? |
|---------|-------------|----------|
| **svg-path-properties** | Pure JS `getPointAtLength(t)` and `getTotalLength()` — no DOM needed | Yes |
| **De Casteljau** (manual) | ~10 lines of code for Bezier subdivision | Yes |

### Conversion Pipeline

```
SVG icon file
  → Extract <path d="..."> attribute
  → Parse with svg-path-parser (handles M, L, C, Q, A, Z commands)
  → Convert arcs to beziers (svgpath .unarc())
  → Flatten curves via svg-path-properties getPointAtLength(t)
  → Normalize to [0,1] × [0,1] bounding box
  → Output as [number, number][] array
  → Feed into drawUV()
```

### Curve Flattening

SVG paths contain curved segments (Cubic Bezier `C`, Quadratic Bezier `Q`, Arcs `A`). These need to be flattened to polylines:

- **`svg-path-properties.getPointAtLength(t)`** — cleanest approach, handles all command types transparently
- **`svgpath.unarc()`** — converts arcs to cubic beziers first, then De Casteljau subdivide
- **Adaptive subdivision** — more points where curvature is high, fewer on straight sections
- **Resolution:** 30-60 points per subpath is the sweet spot for mandala UV cells

### Will It Look Good Through the Mandala Renderer?

**Yes, with caveats:**

1. **Simple, bold icons work best.** The mandala renderer applies hand-drawn wobble (roughness perturbation) and Catmull-Rom curve smoothing. Thin/detailed SVGs will become muddy.
2. **Emoji-style icons** (OpenMoji, Noto) tend to have bold outlines and simple fills — ideal.
3. **The UV cell is small.** Each pattern draws in a unit cell that maps to one symmetry slice of one ring layer. Complex 20-path SVGs won't be legible at that scale.
4. **Decompose multi-path SVGs.** Many icons have multiple `<path>` elements or `M` (moveTo) commands. Each subpath becomes a separate `drawUV()` call with its own style.
5. **Pre-conversion recommended.** Converting SVGs at build time (not runtime) avoids performance overhead. Ship the point arrays as JSON data.
6. **Limit to 1-3 subpaths per icon.** Icons with 10+ subpaths will be slow and visually muddy. Existing cultural patterns already generate 60-130+ `drawUV` calls per cell — icon patterns should stay within this budget.

### Point Count Guidelines

| Icon Complexity | Points per Subpath | Examples |
|-----------------|-------------------|----------|
| Simple shapes | 20-40 | star, heart, circle, arrow |
| Medium | 40-80 | animals, vehicles, tools |
| Complex (avoid) | 80-150+ | detailed faces, buildings |

### Estimated Effort

- **Parse + flatten pipeline:** ~100-200 lines of TypeScript utility code
- **Build ~50 themed icon point arrays:** 2-4 hours with a script (use Iconify API to search + fetch SVGs across libraries)
- **Integration with PatternSet interface:** New `PatternSet` that indexes into the icon array by theme

---

## 5. Approach Evaluation

### Approach A: LLM as Pattern Selector

**Feasibility: HIGH** | **Effort: LOW** | **Visual Impact: MEDIUM**

The LLM reads headlines, classifies them into themes (conflict, economy, weather, etc.), and maps each to existing pattern sets + parameters.

| Pros | Cons |
|------|------|
| Simplest to implement | Limited visual expressiveness |
| Uses all 29 existing pattern sets | Mapping is somewhat arbitrary |
| No new rendering code needed | Users may not "read" the connection |
| Fast — just config changes | Pattern sets weren't designed for semantic meaning |

**Architecture:** Headlines → LLM → `{ patternSet: 'fractal', motif: 3, filled: true, spinSpeed: 0.8 }` → feed into existing renderer.

**Mapping logic:** Could be a hardcoded lookup table with LLM only doing the classification:
- War/conflict → fractal, maze (complex, threatening)
- Economy → guilloche (banknote aesthetic)
- Nature/weather → flowfield, spirals
- Culture → lotus, artnouveau, celtic
- Technology → generative, truchet
- Health → sacred, organic cells

### Approach B: LLM Generates UV Geometry Directly

**Feasibility: LOW** | **Effort: HIGH** | **Visual Impact: UNCERTAIN**

The LLM outputs point arrays in UV space.

| Pros | Cons |
|------|------|
| Maximum creative freedom | LLMs are bad at precise coordinates |
| Could produce truly novel patterns | Output validation is hard |
| | Expensive (large output tokens) |
| | Likely produces garbage geometry |
| | Slow (generating 50+ point arrays per layer) |

**Verdict: Not recommended.** LLMs don't have spatial reasoning for coordinate generation. Even with few-shot examples, the geometry would be noisy and unpredictable. The token cost for generating point arrays is high relative to the simple classification task.

### Approach C: SVG/Icon Libraries as Visual Vocabulary

**Feasibility: HIGH** | **Effort: MEDIUM** | **Visual Impact: HIGH**

Convert SVG icons to UV point arrays. Map themes to icons. LLM classifies, icons visualize.

| Pros | Cons |
|------|------|
| Recognizable visual symbols | SVG conversion pipeline needed |
| Curated quality (pro-designed icons) | Some icons won't suit mandala aesthetic |
| Huge library to draw from (4000+ icons) | Pre-processing step required |
| LLM only needs classification | Icon legibility at small UV scale |
| Users can "read" the mandala | |

**Architecture:** Headlines → LLM classifies theme → lookup theme-to-icon table → draw icon point arrays via `drawUV()`.

**Key insight:** The mandala's hand-drawn wobble + Catmull-Rom smoothing will actually make icons look MORE interesting — like rough sketches or woodcut prints. This is a feature, not a bug.

### Approach D: Hybrid — Curated Base + LLM Creativity

**Feasibility: HIGH** | **Effort: MEDIUM-HIGH** | **Visual Impact: HIGHEST**

Combine approaches A + C. Pre-built icon library for known themes. LLM selects patterns + icons + parameters. Novel themes fall back to abstract pattern selection.

| Pros | Cons |
|------|------|
| Best of both worlds | More complex architecture |
| Graceful degradation | Larger codebase |
| Rich visual variety | More upfront curation work |
| Both symbolic + abstract | |

**Architecture:**
1. Headlines → LLM classifies theme + sentiment
2. Known theme? → Use themed icon from curated library
3. Unknown theme? → Fall back to abstract pattern selection (Approach A)
4. Sentiment → Adjust parameters (roughness, speed, color warmth)

### Approach E: Sentiment/Emotion Driven (Abstract Only)

**Feasibility: HIGH** | **Effort: LOW** | **Visual Impact: MEDIUM**

Skip icons entirely. Extract emotional tone and map to abstract visual qualities.

| Pros | Cons |
|------|------|
| No icon pipeline needed | Less visually "readable" |
| Elegant simplicity | Users can't decode specific topics |
| Works with any language/topic | More subtle — may feel random |
| No curated asset library | |

**Mapping:**
- Tension/conflict → high roughness, fast spin, warm colors, jagged patterns (fractal, maze)
- Calm/peace → low roughness, slow spin, cool colors, smooth patterns (artnouveau, spirals)
- Urgency → fast animation, dense layers, high contrast
- Joy/celebration → bright colors, ornate patterns (lotus, celtic)

**Verdict:** Good as a **complement** to other approaches, not standalone. The sentiment-to-parameters mapping should be part of any solution.

### Final Ranking

| Rank | Approach | Recommended? |
|------|----------|-------------|
| 1 | **D: Hybrid** | YES — Best overall. Combine icons + pattern selection + sentiment parameters. |
| 2 | **C: SVG Icons** | YES — If D is too ambitious, start here. High impact. |
| 3 | **A+E: Pattern Select + Sentiment** | YES — Simplest MVP. Good starting point. |
| 4 | **A: Pattern Selector only** | Partial — Too limited alone. |
| 5 | **B: LLM Geometry** | NO — Not feasible. |

---

## 6. Recommended Stack & Architecture

### Phase 1: MVP (Approach A+E — Pattern Selection + Sentiment)

**Zero new rendering code.** Just wire up data → LLM → config.

```
[RSS Feeds] → [rss2json proxy] → [Headlines JSON]
                                        ↓
                                  [Gemini API]
                                  (classify theme + sentiment)
                                        ↓
                              [Theme-to-Config Mapper]
                              (pattern set, motif, fill, speed, colors)
                                        ↓
                              [Existing Mandala Renderer]
                              (each layer = one headline/theme)
```

**Stack:**
- **News:** CurrentsAPI (600 req/day, CORS, built-in categories) + Google News RSS via rss2json.com (fallback)
- **LLM:** Google Gemini free tier via `@google/genai` JS SDK (domain-restricted key)
- **Mapping:** Hardcoded lookup table (theme → pattern set + parameters)
- **Fallback:** Random patterns if APIs fail (current behavior)

**API calls per refresh (every 10-15 min):**
- 1 CurrentsAPI call (600/day budget → supports refresh every ~2.5 min)
- 1 LLM call with ~10 headlines (~500 tokens, Gemini free = 100+ calls/day)
- CurrentsAPI provides categories, which reduces LLM classification work

**Data flow timing:**
- Fetch news every 5-15 minutes (stale news is fine — mandala is ambient)
- LLM classification cached for 5-15 minutes
- Layer transitions animate smoothly via existing zoom/tunnel system
- Outer rings = older news, inner rings = current (tunnel = time axis)

### Phase 2: Icon Integration (Approach C/D)

Add themed SVG icons as a new pattern set.

```
[Build Time]
  OpenMoji/Lucide SVGs → svg-path-parser → normalized [x,y][] arrays → icons.json

[Runtime]
  Theme classification → icon lookup → drawUV(iconPoints, style)
```

**New code:**
- `src/patterns/thematic.ts` — new `PatternSet` that renders icon point arrays
- `src/data/icons.json` — pre-converted icon geometries (~50-100 icons)
- Build script to convert SVGs → point arrays

### Phase 3: Production Hardening

If the project grows beyond prototyping:
- **Deploy a Cloudflare Worker** as API proxy (holds API keys securely, proxies both news + LLM calls)
- **Add user controls:** text input field for custom themes, RSS feed URL input
- **Caching layer:** Service worker caches API responses for offline resilience

### Recommended Tech Choices

| Component | Choice | Reason |
|-----------|--------|--------|
| **News source** | CurrentsAPI (primary) + RSS via rss2json.com (fallback) | 600 req/day CORS-enabled + unlimited RSS fallback |
| **LLM provider** | Google Gemini (free tier) | Best free limits, domain-restricted keys, JS SDK works in browser |
| **LLM fallback** | Local classification (no LLM) | Keyword-based theme mapping if Gemini is down |
| **Icon source** | Lucide (already imported) + OpenMoji | Permissive licenses, good thematic coverage |
| **SVG parser** | svg-path-parser (npm) | MIT, browser-compatible, well-maintained |
| **CORS backup** | Puter.js `puter.net.fetch()` | Drop-in fetch replacement, no config |

---

## 7. Constraints & Risks

### Hard Constraints
- **Static site only** (GitHub Pages) — no server-side code in the main deployment
- **Existing renderer untouched** — only change what feeds into it
- **Graceful degradation** — must fall back to random patterns if all APIs fail

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API key exposed in client JS | High | Medium | Domain-restrict Gemini key; rate limits protect against abuse; keys are free to regenerate |
| RSS proxy service goes down | Low | High | Multiple fallbacks (rss2json, AllOrigins, Toptal feed2json) |
| Gemini free tier limits reduced | Medium | Medium | Aggressive caching (5-15 min); fallback to Groq/OpenRouter |
| Icons look bad through wobble renderer | Low | Medium | Pre-test with screenshots; use bold/simple icons only |
| CORS policies change | Low | Medium | Puter.js as universal CORS bypass fallback |
| LLM classification is slow | Low | Low | Cache results; mandala animates with stale data while waiting |

### API Key Security (Honest Assessment)

For a **free, open-source art project** hosted on GitHub Pages:
- Exposed API keys are acceptable for prototyping/demo purposes
- All APIs used have free tiers — abuse is rate-limited, not financially damaging
- Domain-restricted keys (Gemini) add a layer of protection
- The project can always be upgraded to use a Cloudflare Worker proxy later
- This is the same trade-off every client-side Firebase/Supabase app makes

---

## Sources

### LLM APIs
- [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini JS SDK](https://github.com/googleapis/js-genai)
- [Gemini API Key Security](https://ai.google.dev/gemini-api/docs/api-key)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [Groq TypeScript SDK](https://github.com/groq/groq-typescript)
- [OpenRouter Free Models](https://openrouter.ai/collections/free-models)
- [Free LLM API Resources](https://github.com/cheahjs/free-llm-api-resources)
- [Cloudflare Workers AI](https://developers.cloudflare.com/ai-gateway/usage/providers/groq/)

### News APIs
- [CurrentsAPI](https://currentsapi.services/en) — 600 req/day, CORS-enabled
- [GNews API Docs](https://docs.gnews.io/) — 100 req/day, CORS-enabled
- [NewsAPI.org Pricing](https://newsapi.org/pricing) — CORS blocked on free tier
- [NewsData.io Free News APIs](https://newsdata.io/blog/best-free-news-api/)
- [Free News API Comparison](https://github.com/free-news-api/news-api)
- [Wikipedia Current Events API](https://api.wikimedia.org/wiki/Current_events)
- [rss2json.com](https://rss2json.com/)
- [AllOrigins CORS Proxy](https://allorigins.win/)
- [Toptal feed2json](https://www.toptal.com/developers/feed2json/)

### SVG/Icons
- [OpenMoji](https://openmoji.org/)
- [Lucide Icons](https://lucide.dev/)
- [Tabler Icons](https://tabler.io/icons)
- [Google Noto Emoji](https://github.com/googlefonts/noto-emoji)
- [Google Material Symbols](https://fonts.google.com/icons)
- [Pictogrammers MDI](https://materialdesignicons.com/)
- [Iconify API](https://iconify.design/docs/api/)
- [svg-path-parser](https://www.npmjs.com/package/svg-path-parser)
- [svgpath](https://www.npmjs.com/package/svgpath)
- [svg-path-properties](https://github.com/rveciana/svg-path-properties)
- [PathToPoints](https://github.com/Shinao/PathToPoints)

### CORS Solutions
- [Puter.js CORS-Free Fetch](https://developer.puter.com/tutorials/cors-free-fetch-api/)
- [How Google AI Studio Proxies Gemini](https://glaforge.dev/posts/2026/02/09/decoded-how-google-ai-studio-securely-proxies-gemini-api-requests/)
