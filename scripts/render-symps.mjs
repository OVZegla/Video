// Renders the Symp's film in chunks (retrying any chunk that fails), then
// joins them without re-encoding into out/symps-wall-printers.mp4.
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, rmSync, writeFileSync, existsSync} from 'node:fs';
import {join, resolve} from 'node:path';

const COMP = 'SympsWallPrinters';
const OUT = 'out/symps-wall-printers.mp4';
const CHUNK = 300;
const TMP = 'out/.symps-chunks';

const info = execFileSync('npx', ['remotion', 'compositions'], {encoding: 'utf8'});
const line = info.split('\n').find((l) => l.startsWith(COMP));
const total = Number(line.match(/(\d+) \(/)[1]);
mkdirSync(TMP, {recursive: true});

const parts = [];
for (let start = 0; start < total; start += CHUNK) {
	const end = Math.min(total, start + CHUNK) - 1;
	const file = join(TMP, `part-${String(start).padStart(5, '0')}.mp4`);
	parts.push(file);
	if (existsSync(file)) continue;
	for (let attempt = 1; ; attempt++) {
		console.log(`frames ${start}-${end} (attempt ${attempt})`);
		const r = spawnSync('npx', ['remotion', 'render', COMP, file, `--frames=${start}-${end}`, '--log=error'], {stdio: 'inherit'});
		if (r.status === 0) break;
		if (attempt === 4) throw new Error(`chunk ${start}-${end} failed`);
	}
}

const list = join(TMP, 'list.txt');
writeFileSync(list, parts.map((p) => `file '${resolve(p)}'`).join('\n'));
const ffmpeg = 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg';
execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', OUT], {stdio: 'inherit'});
rmSync(TMP, {recursive: true, force: true});
console.log(`→ ${OUT}`);
