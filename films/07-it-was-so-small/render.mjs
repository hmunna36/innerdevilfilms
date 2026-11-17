#!/usr/bin/env node
// the shared engine does it: node render.mjs still|sheet|frames|cues …  =  node ../../stage/render.mjs <this folder> …
// On a Mac it adds --font=mac: film 07 was delivered in the Mac's Chalkboard SE (17 Nov 2026). Everything new, and
// this film anywhere else, is drawn in the bundled font (stage/fonts).
import { fileURLToPath } from 'node:url'; import path from 'node:path';
process.argv.splice(2, 0, path.dirname(fileURLToPath(import.meta.url)), ...(process.platform === 'darwin' ? ['--font=mac'] : []));
await import('../../stage/render.mjs');
