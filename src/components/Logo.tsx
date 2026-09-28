import React from 'react';
import {Img, staticFile} from 'remotion';
import {C} from '../theme';

/** Official Vision Urbaine logo, recoloured for LED (navy → white, transparent ground). */
export const LOGO_SRC = staticFile('brand/vision-urbaine-logo-led.png');
export const LOGO_RATIO = 1940 / 223;

export const LogoImage: React.FC<{width: number}> = ({width}) => (
	<Img src={LOGO_SRC} style={{width, height: width / LOGO_RATIO, display: 'block'}} />
);

/**
 * The "eye" from the logo's "o" — ring, red sector, blue pupil — as a vector
 * motif for engravings and markings. `p` (0→1) draws it in:
 * ring traces, sector sweeps, pupil pops.
 */
export const EyeMark: React.FC<{
	size: number;
	p?: number;
	ink?: string;
	mono?: boolean;
}> = ({size, p = 1, ink = C.white, mono = false}) => {
	const ring = Math.min(1, p / 0.6);
	const sector = Math.max(0, Math.min(1, (p - 0.4) / 0.4));
	const pupil = Math.max(0, Math.min(1, (p - 0.6) / 0.4));
	const r = 36;
	const a0 = (-62 * Math.PI) / 180;
	const a1 = a0 + ((50 * Math.PI) / 180) * sector;
	const pt = (a: number, rr: number) => `${rr * Math.cos(a)} ${rr * Math.sin(a)}`;
	return (
		<svg width={size} height={size} viewBox="-50 -50 100 100">
			<circle
				r={r}
				fill="none"
				stroke={ink}
				strokeWidth={20}
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - ring}
				transform="rotate(-50)"
			/>
			{sector > 0 ? (
				<path
					d={`M ${pt(a0, r - 10)} L ${pt(a0, r + 10)} A ${r + 10} ${r + 10} 0 0 1 ${pt(a1, r + 10)} L ${pt(a1, r - 10)} A ${r - 10} ${r - 10} 0 0 0 ${pt(a0, r - 10)} Z`}
					fill={mono ? ink : C.red}
					opacity={mono ? 0.55 : 1}
				/>
			) : null}
			{/* the slit that separates the sector */}
			<line x1={0} y1={0} x2={50 * Math.cos(a0)} y2={50 * Math.sin(a0)} stroke={C.black} strokeWidth={4} opacity={ring} />
			<circle r={27} fill={C.black} opacity={ring} />
			<circle r={17 * pupil} fill={mono ? ink : C.blue} />
		</svg>
	);
};
