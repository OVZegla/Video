import {continueRender, delayRender} from 'remotion';

type FontSpec = {family: string; url: string; weight: string};

/**
 * Declares the fonts with plain CSS @font-face and holds the render until the
 * browser reports them loaded. The wait is capped, so a stalled load in a
 * freshly opened headless tab can never time out the whole render.
 */
const loadNow = (fonts: FontSpec[]) => {
	const css = fonts
		.map(
			(f) =>
				`@font-face{font-family:'${f.family}';src:url('${f.url}') format('woff2');font-weight:${f.weight};font-style:normal;font-display:block;}`,
		)
		.join('\n');
	const style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);

	const handle = delayRender(`fonts: ${fonts[0]?.family}`, {timeoutInMilliseconds: 60000});
	const loaded = Promise.all(fonts.map((f) => document.fonts.load(`${f.weight} 16px '${f.family}'`)));
	const cap = new Promise((r) => setTimeout(r, 8000));
	return Promise.race([loaded, cap])
		.catch((err) => console.error('font loading failed', err))
		.finally(() => continueRender(handle));
};

/**
 * Returns an `ensure()` to call from the composition that needs the fonts:
 * they are loaded once, on first use, so a composition never waits on
 * fonts it does not use.
 */
export const lazyFonts = (fonts: () => FontSpec[]) => {
	let started: Promise<unknown> | null = null;
	return () => {
		if (!started) started = loadNow(fonts());
		return started;
	};
};
