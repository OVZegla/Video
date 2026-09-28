// Master timeline (frames @ 30 fps). Scenes may start a few frames early
// ("lead") to perform a shape transition over the previous scene.

export const TOTAL = 1800; // 60 s

export const SCENES = {
	team: {from: 0, to: 420}, // 00–14 s: overload → the team forms
	voice: {from: 420, to: 780}, // 14–26 s
	chantier: {from: 780, to: 1200, lead: 24}, // 26–40 s
	brief: {from: 1200, to: 1470, lead: 24}, // 40–49 s
	decide: {from: 1470, to: 1680, lead: 24}, // 49–56 s
	end: {from: 1680, to: 1800}, // 56–60 s
} as const;

// Sound design cues live in scripts/cues.mjs (absolute frames): keep them in
// step with the scene constants when retiming, then run `npm run audio`.
