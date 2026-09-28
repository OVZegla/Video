import React from 'react';
import {C, FONT_DISPLAY} from '../theme';
import {E, prog} from '../lib/anim';

/**
 * Typographic reveal: each word rises out of its own mask, with a small
 * stagger. Exit lifts the words out the top. `lines` are explicit line
 * breaks so the rag is always controlled.
 */
export const Headline: React.FC<{
	lines: (string | {text: string; color?: string})[];
	f: number; // local frame
	start: number;
	end?: number; // frame at which the exit begins
	size?: number;
	weight?: number;
	color?: string;
	stagger?: number;
	align?: 'left' | 'center';
	lineHeight?: number;
	tracking?: number;
	style?: React.CSSProperties;
}> = ({
	lines,
	f,
	start,
	end,
	size = 96,
	weight = 640,
	color = C.ink,
	stagger = 3,
	align = 'left',
	lineHeight = 1.02,
	tracking = -0.035,
	style,
}) => {
	let wi = 0;
	return (
		<div
			style={{
				fontFamily: FONT_DISPLAY,
				fontSize: size,
				fontWeight: weight,
				letterSpacing: `${tracking}em`,
				lineHeight,
				color,
				textAlign: align,
				...style,
			}}
		>
			{lines.map((ln, li) => {
				const text = typeof ln === 'string' ? ln : ln.text;
				const lc = typeof ln === 'string' ? undefined : ln.color;
				const words = text.split(' ');
				return (
					<div key={li} style={{whiteSpace: 'nowrap'}}>
						{words.map((w, i) => {
							const k = wi++;
							const pin = prog(f, start + k * stagger, start + k * stagger + 22, E.out);
							const pout = end === undefined ? 0 : prog(f, end + k * 1.5, end + k * 1.5 + 14, E.in);
							const y = (1 - pin) * 160 - pout * 160;
							return (
								<span
									key={i}
									style={{
										display: 'inline-block',
										overflow: 'hidden',
										verticalAlign: 'top',
										padding: '0.14em 0.02em 0.2em',
										margin: '-0.14em -0.02em -0.2em',
									}}
								>
									<span
										style={{
											display: 'inline-block',
											transform: `translateY(${y}%)`,
											color: lc,
										}}
									>
										{w}
									</span>
									{i < words.length - 1 ? ' ' : ''}
								</span>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
