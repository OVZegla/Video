import React, {useId} from 'react';
import {Img, staticFile} from 'remotion';

export type MuralStyle = 'arches' | 'waves' | 'botanical' | 'blobs' | 'lines' | 'geo' | 'horizon';

/**
 * Wall artwork, generated in vector so it stays crisp at any size.
 * `print` (0 → 1) reveals it the way a vertical wall printer works:
 * column after column, each swath laid down from top to bottom.
 * If `image` is given, a real project photo is used instead of the artwork.
 */
export const Mural: React.FC<{
	style: MuralStyle;
	palette: string[];
	width: number;
	height: number;
	print?: number;
	swaths?: number;
	image?: string;
}> = ({style, palette, width, height, print = 1, swaths = 9, image}) => {
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const id = (n: string) => `${n}-${uid}`;
	const W = width;
	const H = height;
	const [a, b, c, d, e] = [...palette, ...palette, ...palette];

	// swath i starts when print passes i/n; each swath takes ~1.8/n of the progress to finish
	const sw = W / swaths;
	const span = 1.8 / swaths;
	const cols = Array.from({length: swaths}).map((_, i) => {
		const start = (i / swaths) * (1 - span);
		const p = Math.max(0, Math.min(1, (print - start) / span));
		return {x: i * sw, h: H * p, p};
	});

	let art: React.ReactNode = null;
	switch (style) {
		case 'arches':
			art = (
				<g>
					<rect width={W} height={H} fill={a} />
					{[0, 1, 2, 3].map((i) => {
						const r = W * (0.34 - i * 0.07);
						const cx = W * 0.36;
						return <path key={i} d={`M ${cx - r} ${H} L ${cx - r} ${H * 0.62} A ${r} ${r} 0 0 1 ${cx + r} ${H * 0.62} L ${cx + r} ${H} Z`} fill={[b, c, d, e][i]} />;
					})}
					<circle cx={W * 0.76} cy={H * 0.3} r={H * 0.13} fill={c} />
					<path d={`M ${W * 0.62} ${H} L ${W * 0.62} ${H * 0.72} A ${W * 0.16} ${W * 0.16} 0 0 1 ${W * 0.94} ${H * 0.72} L ${W * 0.94} ${H} Z`} fill={d} opacity={0.9} />
				</g>
			);
			break;
		case 'waves':
			art = (
				<g>
					<rect width={W} height={H} fill={a} />
					{[b, c, d, e].map((col, i) => {
						const y0 = H * (0.35 + i * 0.16);
						const amp = H * (0.08 - i * 0.01);
						const dpath = `M 0 ${y0} C ${W * 0.2} ${y0 - amp * 2}, ${W * 0.35} ${y0 + amp * 2}, ${W * 0.55} ${y0} S ${W * 0.85} ${y0 - amp * 1.5}, ${W} ${y0 + amp} L ${W} ${H} L 0 ${H} Z`;
						return <path key={i} d={dpath} fill={col} />;
					})}
					<circle cx={W * 0.72} cy={H * 0.2} r={H * 0.08} fill={e} opacity={0.9} />
				</g>
			);
			break;
		case 'botanical':
			art = (
				<g>
					<rect width={W} height={H} fill={a} />
					{Array.from({length: 26}).map((_, i) => {
						const x = ((i * 0.618) % 1) * W;
						const y = H * (0.15 + ((i * 0.37) % 1) * 0.95);
						const rot = ((i * 47) % 120) - 60;
						const s = H * (0.28 + ((i * 0.29) % 1) * 0.3);
						const col = [b, c, d, e][i % 4];
						return (
							<g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
								<path d={`M 0 0 C ${s * 0.35} ${-s * 0.3}, ${s * 0.35} ${-s * 0.75}, 0 ${-s} C ${-s * 0.35} ${-s * 0.75}, ${-s * 0.35} ${-s * 0.3}, 0 0 Z`} fill={col} opacity={0.92} />
								<path d={`M 0 0 L 0 ${-s * 0.95}`} stroke={a} strokeOpacity={0.35} strokeWidth={Math.max(1, s * 0.012)} />
							</g>
						);
					})}
				</g>
			);
			break;
		case 'blobs':
			art = (
				<g>
					<defs>
						<filter id={id('bl')} x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation={H * 0.12} />
						</filter>
					</defs>
					<rect width={W} height={H} fill={a} />
					<g filter={`url(#${id('bl')})`}>
						<circle cx={W * 0.2} cy={H * 0.3} r={H * 0.45} fill={b} />
						<circle cx={W * 0.55} cy={H * 0.75} r={H * 0.5} fill={c} />
						<circle cx={W * 0.85} cy={H * 0.25} r={H * 0.42} fill={d} />
						<circle cx={W * 0.6} cy={H * 0.1} r={H * 0.25} fill={e} />
					</g>
				</g>
			);
			break;
		case 'lines':
			art = (
				<g>
					<rect width={W} height={H} fill={a} />
					{Array.from({length: 38}).map((_, i) => {
						const y0 = H * (0.08 + i * 0.024);
						const dpath = `M 0 ${y0} C ${W * 0.3} ${y0 - H * 0.18 * Math.sin(i * 0.2)}, ${W * 0.6} ${y0 + H * 0.2 * Math.cos(i * 0.15)}, ${W} ${y0 - H * 0.05}`;
						return <path key={i} d={dpath} fill="none" stroke={i % 7 === 3 ? c : b} strokeWidth={Math.max(1, H * 0.0035)} opacity={0.85} />;
					})}
				</g>
			);
			break;
		case 'geo':
			art = (
				<g>
					<rect width={W} height={H} fill={a} />
					<rect x={0} y={H * 0.55} width={W * 0.42} height={H * 0.45} fill={b} />
					<circle cx={W * 0.42} cy={H * 0.55} r={H * 0.3} fill={c} />
					<rect x={W * 0.58} y={0} width={W * 0.18} height={H * 0.7} fill={d} />
					<path d={`M ${W * 0.76} ${H} L ${W} ${H * 0.45} L ${W} ${H} Z`} fill={e} />
					<circle cx={W * 0.84} cy={H * 0.22} r={H * 0.1} fill={b} />
				</g>
			);
			break;
		case 'horizon':
			art = (
				<g>
					<defs>
						<linearGradient id={id('sky')} x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor={a} />
							<stop offset="0.6" stopColor={b} />
							<stop offset="1" stopColor={c} />
						</linearGradient>
					</defs>
					<rect width={W} height={H} fill={`url(#${id('sky')})`} />
					<circle cx={W * 0.62} cy={H * 0.56} r={H * 0.16} fill={e} opacity={0.95} />
					<path d={`M 0 ${H * 0.66} C ${W * 0.2} ${H * 0.58}, ${W * 0.35} ${H * 0.7}, ${W * 0.55} ${H * 0.62} S ${W * 0.85} ${H * 0.6}, ${W} ${H * 0.66} L ${W} ${H} L 0 ${H} Z`} fill={d} />
					<path d={`M 0 ${H * 0.78} C ${W * 0.25} ${H * 0.72}, ${W * 0.5} ${H * 0.84}, ${W} ${H * 0.76} L ${W} ${H} L 0 ${H} Z`} fill={c} opacity={0.9} />
				</g>
			);
			break;
	}

	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', overflow: 'hidden'}}>
			<defs>
				<mask id={id('print')}>
					{cols.map((col, i) => (
						<rect key={i} x={col.x - 0.5} y={0} width={sw + 1} height={col.h} fill="#fff" />
					))}
				</mask>
			</defs>
			<g mask={print < 1 ? `url(#${id('print')})` : undefined}>
				{image ? (
					<foreignObject width={W} height={H}>
						<Img src={staticFile(image)} style={{width: W, height: H, objectFit: 'cover'}} />
					</foreignObject>
				) : (
					art
				)}
			</g>
		</svg>
	);
};
