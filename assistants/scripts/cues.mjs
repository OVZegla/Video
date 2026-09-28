// Sound-design cues, in absolute frames @ 30 fps, matched to the scene timings
// (src/timeline.ts + local constants in each scene). Retime here, then `npm run audio`.
const S3 = 420; // Voice
const S4 = 780; // Chantier (local t = 0)
const S5 = 1200; // Brief
const S6 = 1470; // Decide

export const CUES = [
	// 00–07 overload: every new request lands with a small tick, faster and faster
	...[16, 38, 56, 96, 105, 113, 120, 126, 131, 136, 140].map((f, i) => ({f, type: 'tick', v: 0.55 + i * 0.03, pitch: i})),
	{f: 166, type: 'whoosh', dur: 0.9, v: 0.5, dir: 'out'}, // space opens in the centre
	{f: 196, type: 'pop', v: 0.6}, // shared folder
	{f: 208, type: 'whoosh', dur: 1.2, v: 0.35, dir: 'in'}, // items gather into assistants
	{f: 246, type: 'chime', v: 0.4, notes: [72, 79]}, // the team is formed
	...[282, 300, 318, 338, 354].map((f, i) => ({f, type: 'blip', v: 0.22, pitch: i})),
	{f: 394, type: 'whoosh', dur: 0.9, v: 0.5, dir: 'in'}, // card → phone
	// 14–26 voice request
	{f: S3 + 22, type: 'voiceOn', v: 0.55},
	{f: S3 + 96, type: 'send', v: 0.45},
	{f: S3 + 116, type: 'card', v: 0.55},
	{f: S3 + 124, type: 'whoosh', dur: 0.6, v: 0.3, dir: 'out'},
	{f: S3 + 204, type: 'voiceOn', v: 0.55},
	{f: S3 + 250, type: 'send', v: 0.45},
	{f: S3 + 268, type: 'card', v: 0.5},
	{f: S3 + 300, type: 'ready', v: 0.6},
	{f: S4 - 24, type: 'whoosh', dur: 1.0, v: 0.5, dir: 'out'}, // circle wipe
	// 26–40 the job folder feeds four deliverables
	{f: S4 + 46, type: 'drop', v: 0.6},
	{f: S4 + 52, type: 'voiceOn', v: 0.4},
	...[116, 154, 192, 230].map((t, i) => ({f: S4 + t + 4, type: 'ready', v: 0.42, pitch: i})),
	{f: S4 + 306, type: 'whoosh', dur: 0.8, v: 0.3, dir: 'in'},
	{f: S4 + 318, type: 'card', v: 0.45},
	{f: S5 - 24, type: 'whoosh', dur: 1.1, v: 0.45, dir: 'in'}, // night grows from the panel
	// 40–49 daily brief
	{f: S5 + 4, type: 'card', v: 0.35},
	...[48, 61, 74].map((t, i) => ({f: S5 + t, type: 'tick', v: 0.45, pitch: 4 + i * 2})),
	{f: S5 + 124, type: 'blip', v: 0.2, pitch: 2},
	{f: S6 - 24, type: 'whoosh', dur: 0.9, v: 0.4, dir: 'out'},
	// 49–56 validation
	{f: S6 + 56, type: 'validate', v: 0.75},
	{f: S6 + 176, type: 'whoosh', dur: 1.2, v: 0.25, dir: 'in'},
];
