#!/usr/bin/env npx tsx
/**
 * Mandala Pattern CLI — headless render, analyze, compare, and improve patterns.
 *
 * Commands:
 *   render-tiles [--set <name>] [--size <px>]     Render all pattern tiles to PNG
 *   render-mandalas [--size <px>] [--seed <n>]    Render full mandalas for each set + mix
 *   render-all [--size <px>]                      Render both tiles and mandalas
 *   analyze [--dir <path>]                        Analyze rendered tiles, produce report
 *   report                                        Render + analyze in one shot (full pipeline)
 *   reference <url|path> [--name <label>]         Download/load reference image and analyze
 *   compare <ref> <render>                        Side-by-side comparison image
 *
 * Output goes to tools/output/ by default.
 *
 * Usage:
 *   npx tsx tools/cli.ts render-tiles
 *   npx tsx tools/cli.ts render-mandalas --size 1200 --seed 99
 *   npx tsx tools/cli.ts analyze
 *   npx tsx tools/cli.ts report
 *   npx tsx tools/cli.ts reference https://example.com/pattern.png --name celtic_knot
 *   npx tsx tools/cli.ts compare tools/output/ref_celtic_knot.png tools/output/tile_nordic_0_filled.png
 */

import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
    ALL_PATTERN_SETS,
    getPatternSetByName,
    renderTile,
    renderMandala,
    renderAllTiles,
    renderAllMandalas,
    savePNG,
} from './renderer';
import { analyzeTile, analyzeAllTiles, formatReport } from './analyzer';
import { downloadImage, analyzeReference, formatReferenceReport, createComparison } from './reference';

const OUTPUT_DIR = path.resolve(__dirname, 'output');

function parseArgs(args: string[]): { command: string; flags: Record<string, string> } {
    const command = args[0] || 'help';
    const flags: Record<string, string> = {};
    for (let i = 1; i < args.length; i++) {
        if (args[i].startsWith('--') && i + 1 < args.length) {
            flags[args[i].slice(2)] = args[i + 1];
            i++;
        } else {
            // Positional arg
            if (!flags._positional) flags._positional = args[i];
            else flags._positional2 = args[i];
        }
    }
    return { command, flags };
}

async function main() {
    const { command, flags } = parseArgs(process.argv.slice(2));
    const size = parseInt(flags.size || '800');
    const tileSize = parseInt(flags['tile-size'] || '400');
    const seed = parseInt(flags.seed || '42');

    switch (command) {
        case 'render-tiles': {
            console.log(`Rendering all pattern tiles (${tileSize}px)...`);
            const setFilter = flags.set;
            if (setFilter) {
                const ps = getPatternSetByName(setFilter);
                if (!ps) {
                    console.error(`Pattern set "${setFilter}" not found. Available: ${ALL_PATTERN_SETS.map(s => s.name).join(', ')}`);
                    process.exit(1);
                }
                const safeName = ps.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                let count = 0;
                for (let t = 0; t < ps.count; t++) {
                    for (const filled of [true, false]) {
                        const canvas = renderTile(ps, t, filled, tileSize);
                        const fname = `tile_${safeName}_${t}_${filled ? 'filled' : 'outline'}.png`;
                        savePNG(canvas, path.join(OUTPUT_DIR, fname));
                        count++;
                    }
                }
                console.log(`  Rendered ${count} tiles for "${ps.name}" → ${OUTPUT_DIR}`);
            } else {
                const files = renderAllTiles(OUTPUT_DIR, tileSize);
                console.log(`  Rendered ${files.length} tiles → ${OUTPUT_DIR}`);
            }
            break;
        }

        case 'render-mandalas': {
            console.log(`Rendering mandalas (${size}px, seed=${seed})...`);
            const files = renderAllMandalas(OUTPUT_DIR, { size, seed });
            console.log(`  Rendered ${files.length} mandalas → ${OUTPUT_DIR}`);
            break;
        }

        case 'render-all': {
            console.log(`Rendering all tiles and mandalas...`);
            const tiles = renderAllTiles(OUTPUT_DIR, tileSize);
            console.log(`  ${tiles.length} tiles`);
            const mandalas = renderAllMandalas(OUTPUT_DIR, { size, seed });
            console.log(`  ${mandalas.length} mandalas`);
            console.log(`  All output → ${OUTPUT_DIR}`);
            break;
        }

        case 'analyze': {
            const dir = flags.dir || OUTPUT_DIR;
            console.log(`Analyzing tiles in ${dir}...`);
            const tileFiles = fs.readdirSync(dir).filter(f => f.startsWith('tile_') && f.endsWith('.png'));
            if (tileFiles.length === 0) {
                console.log('No tile images found. Run "render-tiles" first.');
                process.exit(1);
            }
            const metrics = await analyzeAllTiles(dir);
            const report = formatReport(metrics);
            console.log(report);

            // Save report
            const reportPath = path.join(dir, 'analysis_report.txt');
            fs.writeFileSync(reportPath, report);
            console.log(`\nReport saved to ${reportPath}`);

            // Also save as JSON for programmatic use
            const jsonPath = path.join(dir, 'analysis_report.json');
            fs.writeFileSync(jsonPath, JSON.stringify(metrics, null, 2));
            console.log(`JSON data saved to ${jsonPath}`);
            break;
        }

        case 'report': {
            // Full pipeline: render + analyze
            console.log('=== FULL PIPELINE: Render + Analyze ===\n');

            console.log('Step 1: Rendering tiles...');
            const tiles = renderAllTiles(OUTPUT_DIR, tileSize);
            console.log(`  ${tiles.length} tiles rendered`);

            console.log('\nStep 2: Rendering mandalas...');
            const mandalas = renderAllMandalas(OUTPUT_DIR, { size, seed });
            console.log(`  ${mandalas.length} mandalas rendered`);

            console.log('\nStep 3: Analyzing tiles...');
            const metrics = await analyzeAllTiles(OUTPUT_DIR);
            const report = formatReport(metrics);
            console.log(report);

            const reportPath = path.join(OUTPUT_DIR, 'analysis_report.txt');
            fs.writeFileSync(reportPath, report);
            const jsonPath = path.join(OUTPUT_DIR, 'analysis_report.json');
            fs.writeFileSync(jsonPath, JSON.stringify(metrics, null, 2));
            console.log(`\nFull report saved to ${reportPath}`);
            break;
        }

        case 'reference': {
            const src = flags._positional;
            if (!src) {
                console.error('Usage: reference <url|path> [--name <label>]');
                process.exit(1);
            }
            const label = flags.name || 'reference';
            const destPath = path.join(OUTPUT_DIR, `ref_${label}.png`);

            if (src.startsWith('http')) {
                console.log(`Downloading ${src}...`);
                await downloadImage(src, destPath);
                console.log(`  Saved to ${destPath}`);
            } else {
                // Local file — copy
                if (!fs.existsSync(src)) {
                    console.error(`File not found: ${src}`);
                    process.exit(1);
                }
                fs.copyFileSync(src, destPath);
                console.log(`  Copied to ${destPath}`);
            }

            console.log('Analyzing reference image...');
            const analysis = await analyzeReference(destPath);
            const report = formatReferenceReport(analysis);
            console.log(report);

            const reportPath = path.join(OUTPUT_DIR, `ref_${label}_analysis.txt`);
            fs.writeFileSync(reportPath, report);
            console.log(`\nAnalysis saved to ${reportPath}`);
            break;
        }

        case 'compare': {
            const ref = flags._positional;
            const render = flags._positional2;
            if (!ref || !render) {
                console.error('Usage: compare <reference-image> <render-image>');
                process.exit(1);
            }
            const outName = `comparison_${path.basename(ref, '.png')}_vs_${path.basename(render, '.png')}.png`;
            const outPath = path.join(OUTPUT_DIR, outName);
            await createComparison(ref, render, outPath);
            console.log(`Comparison image saved to ${outPath}`);
            break;
        }

        case 'list': {
            console.log('Available pattern sets:');
            for (const ps of ALL_PATTERN_SETS) {
                console.log(`  ${ps.name} (${ps.count} variants)`);
            }
            break;
        }

        case 'help':
        default:
            console.log(`
Mandala Pattern CLI — headless render, analyze, and improve patterns.

Commands:
  render-tiles [--set <name>] [--tile-size <px>]    Render pattern tiles to PNG
  render-mandalas [--size <px>] [--seed <n>]        Render full mandalas
  render-all [--size <px>]                          Render tiles + mandalas
  analyze [--dir <path>]                            Analyze rendered tiles
  report                                            Full pipeline: render + analyze
  reference <url|path> [--name <label>]             Download/analyze reference image
  compare <ref-image> <render-image>                Side-by-side comparison
  list                                              List all pattern sets
  help                                              Show this help

Examples:
  npx tsx tools/cli.ts render-tiles
  npx tsx tools/cli.ts render-tiles --set nordic
  npx tsx tools/cli.ts render-mandalas --size 1200
  npx tsx tools/cli.ts report
  npx tsx tools/cli.ts reference https://example.com/mandala.png --name inspiration
  npx tsx tools/cli.ts compare tools/output/ref_inspiration.png tools/output/tile_nordic_0_filled.png
`);
            break;
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
