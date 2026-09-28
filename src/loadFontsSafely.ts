import {continueRender, delayRender} from 'remotion';

type FontSpec = {family: string; url: string; weight: string};

/**
 * Loads fonts through the FontFace API, holding the render until they are ready.
 * In a freshly opened headless tab FontFace.load() can occasionally stall
 * forever; each attempt is therefore capped and retried instead of
 * timing out the whole render.
 */
export const loadFontsSafely = (fonts: FontSpec[]) => {
	const handle = delayRender(`fonts: ${fonts[0]?.family}`, {timeoutInMilliseconds: 90000});
	const loadOne = (f: FontSpec) =>
		new FontFace(f.family, `url('${f.url}') format('woff2')`, {weight: f.weight}).load().then((face) => {
			(document.fonts as unknown as Set<FontFace>).add(face);
		});
	const attempt = (tries: number): Promise<void> =>
		Promise.race([
			Promise.all(fonts.map(loadOne)).then(() => true),
			new Promise<boolean>((r) => setTimeout(() => r(false), 6000)),
		]).then((ok) => (ok || tries <= 1 ? undefined : attempt(tries - 1)));
	return attempt(5)
		.catch((err) => console.error('font loading failed', err))
		.finally(() => continueRender(handle));
};
