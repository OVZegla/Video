import React, {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {fontsReady} from '../fonts';

/**
 * Measures `text` with the real (loaded) font and returns the largest font
 * size that fits `maxWidth`, capped at `maxSize`. Blocks the render until the
 * measurement is done so the first frame is already correct.
 */
export const useFitSize = (
	text: string,
	font: string, // canvas font with `{s}` for the size, e.g. '800 extra-condensed {s}px Archivo'
	maxWidth: number,
	maxSize: number,
	letterSpacingEm = 0,
) => {
	const [size, setSize] = useState<number | null>(null);
	const [handle] = useState(() => delayRender(`fit ${text}`));
	useEffect(() => {
		fontsReady.then(() => {
			const ctx = document.createElement('canvas').getContext('2d')!;
			ctx.font = font.replace('{s}', '100');
			const w100 = ctx.measureText(text).width + letterSpacingEm * 100 * (text.length - 1);
			setSize(Math.min(maxSize, (maxWidth / w100) * 100));
			continueRender(handle);
		});
	}, [text, font, maxWidth, maxSize, letterSpacingEm, handle]);
	return size;
};

/** Per-letter masked rise, staggered. */
export const RiseLetters: React.FC<{
	text: string;
	lf: number;
	start: number;
	style: React.CSSProperties;
	stagger?: number;
	dur?: number;
	ease: (t: number) => number;
}> = ({text, lf, start, style, stagger = 2, dur = 18, ease}) => (
	<div style={{display: 'flex', overflow: 'hidden', whiteSpace: 'pre', ...style}}>
		{text.split('').map((ch, k) => {
			const t = Math.max(0, Math.min(1, (lf - start - k * stagger) / dur));
			return (
				<span key={k} style={{display: 'inline-block', transform: `translateY(${(1 - ease(t)) * 110}%)`}}>
					{ch}
				</span>
			);
		})}
	</div>
);
