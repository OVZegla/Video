// Render a handful of frames to out/stills/ for visual QA.
// Usage: node scripts/stills.mjs 60 150 400   (frames)   or   node scripts/stills.mjs 0-1800:30
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const frames = args.flatMap((a) => {
	const m = a.match(/^(\d+)-(\d+):(\d+)$/);
	if (!m) return [Number(a)];
	const out = [];
	for (let i = +m[1]; i < +m[2]; i += +m[3]) out.push(i);
	return out;
});
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const browser = await openBrowser('chrome', {browserExecutable});
const id = process.env.COMP ?? 'Publicite';
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
fs.mkdirSync(path.join(root, 'out/stills'), {recursive: true});
for (const frame of frames) {
	const output = path.join(root, `out/stills/${id}-${String(frame).padStart(4, '0')}.jpg`);
	await renderStill({composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 88, puppeteerInstance: browser});
	console.log(output);
}
await browser.close({silent: true});
