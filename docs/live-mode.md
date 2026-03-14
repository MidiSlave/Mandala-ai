# Mandala Live

Mandala Live transforms the generator into a real-time news visualization. Each mandala ring represents a headline — rendered with sharp Lucide icons and circular text, completely isolated from the hand-drawn pattern system.

![Live Mode](live-mode-panel.png)

## How It Works

1. **News fetching** — headlines from CurrentsAPI (with key) or RSS feeds (Google News, BBC, Reuters)
2. **Classification** — Google Gemini classifies into 16 themes + sentiment, or falls back to keyword matching
3. **Text rings** — small/inner rings show the headline text wrapping along circular arcs
4. **Icon rings** — as rings grow larger, text transitions to sharp Lucide icons representing the story's keywords
5. **Sentiment** — negative news increases roughness and spin; positive news is smoother and calmer

## Text-to-Icon Transition

The key visual feature: rings smaller than ~35px show **headline text** curving along the arc (illegible but textural). As the tunnel zoom brings rings outward and they grow, they transition to **recognizable icons** that tell the story.

For example, *"Iran launches missile strike against Israel defense forces"* renders as:
- **Small ring**: `IRAN LAUNCHES MISSILE STRIKE AGAINST ISRAEL DEFENSE FORCES` wrapping in a circle
- **Large ring**: swords, rocket, flag, shield icons arranged radially

## Icon System

Live mode uses **Lucide's 1,800+ icon library** rendered directly on canvas via Path2D — sharp and crisp, not hand-drawn.

A keyword index maps 500+ words to specific Lucide icons across 20+ categories:

| Category | Example keywords | Icons |
|----------|-----------------|-------|
| Conflict | war, missile, troops, bomb | swords, rocket, shield, bomb |
| Economy | market, inflation, bank, crypto | chart-line, trending-up, landmark, bitcoin |
| Weather | hurricane, flood, wildfire | tornado, waves, flame |
| Health | vaccine, hospital, virus | syringe, hospital, bug |
| Politics | election, congress, vote | vote, landmark, gavel |
| Technology | AI, cyber, chip, hack | brain-circuit, lock, cpu |
| Space | rocket, satellite, mars | rocket, satellite-dish, telescope |
| Transport | plane, ship, train, car | plane, ship, train, car |
| Crime | arrest, murder, police | handcuffs, gavel, siren |
| Disaster | earthquake, tsunami, explosion | alert-triangle, waves, bomb |
| ... | 10+ more categories | |

## 16 News Themes

`conflict` `economy` `weather` `health` `politics` `technology` `sports` `culture` `environment` `science` `crime` `disaster` `diplomacy` `education` `space` `general`

## Usage

1. Click **Live Mode** in the control panel
2. Pattern dropdown is disabled — rings are driven by news
3. Color themes remain selectable
4. Headlines appear in the panel with sentiment dots (green/red/gray)
5. Click **Refresh** to fetch new headlines (auto-refreshes every 10 minutes)
6. Optionally add API keys under **API Keys** for richer results

## Works Without API Keys

Live mode works out of the box:

| Feature | With keys | Without keys |
|---------|-----------|-------------|
| **News source** | CurrentsAPI (more sources) | RSS feeds (Google News, BBC, Reuters) |
| **Classification** | Gemini LLM (nuanced) | Keyword matching (functional) |
| **Icon mapping** | Same | Same |

API keys are optional enhancements — the keyword-based pipeline handles the full visualization.

## Architecture

Live mode rendering is **completely isolated** from the hand-drawn pattern pipeline:

```
src/live/
  render.ts        # Isolated canvas renderer (text + icons, sharp, no wobble)
  lucide-canvas.ts # Lucide icon → Canvas2D Path2D conversion
  icon-loader.ts   # Async dynamic loader for Lucide icons (1,800+ available)
  icon-index.ts    # 500+ keyword → Lucide icon name mappings
  classify.ts      # Gemini LLM + keyword fallback classification
  news.ts          # CurrentsAPI + RSS feed fetching
  themes.ts        # Theme → color/pattern mapping
  types.ts         # TypeScript interfaces
```
