import React, {useId} from 'react';
import {Img, staticFile} from 'remotion';
import {PRODUCT_IMAGES} from '../data/assets.generated';
import type {MachineLook, Product} from '../data/products';

/**
 * A Symp's wall printer.
 *
 * If an official photo exists in public/symps/products/<id>.* it is shown as-is
 * (object-fit: contain, bottom-anchored: never cropped, never distorted).
 * Otherwise a parametric vector render of the machine is drawn.
 *
 * Every machine lives in the same 600 × 1000 box with the floor at the bottom
 * edge, so heights stay comparable between machines.
 */

export const BOX_W = 600;
export const BOX_H = 1000;
export const MACHINE_ASPECT = BOX_W / BOX_H;

const FLOOR = 1000;
const WHEEL_R = 24;
const BASE_BOTTOM = FLOOR - WHEEL_R * 2 - 10; // 942
const BASE_H = 40;
const BASE_TOP = BASE_BOTTOM - BASE_H; // 902
const DECK = BASE_TOP - 16; // 886: top face of the base
const CARRIAGE_H = 150;

/** Key points of a machine in box units, used to frame macro shots. */
export const machineGeometry = (look: MachineLook, head = 0.35) => {
	const topY = FLOOR - 40 - 900 * look.height;
	const yLow = 630;
	const yHigh = topY + 56;
	const carriageY = yLow + (yHigh - yLow) * head;
	const mastX = look.dualMast ? 300 - (look.baseWidth / 2 - 70) : 300;
	return {
		topY,
		carriageY,
		carriageCenter: {x: 300, y: carriageY + CARRIAGE_H / 2},
		cartridges: {x: 300, y: carriageY - 8},
		uv: {x: 300, y: carriageY + CARRIAGE_H + 4},
		wheel: {x: 300 - (look.baseWidth / 2 - 34), y: FLOOR - WHEEL_R},
		ink: {x: 300 - look.baseWidth / 4, y: DECK - 44},
		rail: {x: mastX, y: (topY + DECK) / 2},
		base: {x: 300, y: BASE_TOP},
	};
};

type MachineProps = {
	product: Product;
	/** rendered height in px (width follows the 0.6 box ratio) */
	height: number;
	/** printing carriage position along the mast, 0 (low) → 1 (high) */
	head?: number;
	/** UV lamp intensity 0 → 1 */
	uv?: number;
	/** edge/rim light intensity 0 → 1 */
	rim?: number;
	/** force the vector render even if a photo exists (macro shots) */
	forceVector?: boolean;
	style?: React.CSSProperties;
};

/** Where a machine's photo sits inside its box (contain, bottom-anchored), in px. */
export const photoRect = (product: Product, boxHeight: number) => {
	const photo = PRODUCT_IMAGES[product.id];
	if (!photo) return null;
	const bw = boxHeight * MACHINE_ASPECT;
	const k = Math.min(bw / photo.w, boxHeight / photo.h);
	const w = photo.w * k;
	const h = photo.h * k;
	return {x: (bw - w) / 2, y: boxHeight - h, w, h};
};

/** Screen offset from the box centre of a machine's (inner) mast, in px. */
export const mastOffset = (product: Product, boxHeight: number, side: 'left' | 'right') => {
	const r = photoRect(product, boxHeight);
	const top = product.details?.top;
	if (r && top) return r.x + top[0] * r.w - (boxHeight * MACHINE_ASPECT) / 2;
	if (!product.look.dualMast) return 0;
	const k = boxHeight / 1000;
	const off = (300 - machineGeometry(product.look).rail.x) * k;
	return side === 'right' ? -off : off;
};

export const Machine: React.FC<MachineProps> = ({product, height, head = 0.35, uv = 0, rim = 0, forceVector, style}) => {
	const photo = PRODUCT_IMAGES[product.id];
	const box: React.CSSProperties = {width: height * MACHINE_ASPECT, height, position: 'relative', ...style};
	if (photo && !forceVector) {
		const r = photoRect(product, height)!;
		// the photo keeps its own shape and colours; only a soft rim light is added on dark stages
		const glow = rim > 0 ? `drop-shadow(-1px 0 2px ${hexA(product.env.rim, 0.55 * rim)}) drop-shadow(0 0 14px ${hexA(product.env.rim, 0.12 * rim)})` : undefined;
		return (
			<div style={box}>
				<Img src={staticFile(photo.src)} style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, filter: glow}} />
			</div>
		);
	}
	return (
		<div style={box}>
			<MachineSvg look={product.look} head={head} uv={uv} rim={rim} rimColor={product.env.rim} />
		</div>
	);
};

const INKS = ['#00A3E0', '#E4007C', '#FFD400', '#16161A', '#F4F4F2', '#B9C2CE'];

export const MachineSvg: React.FC<{
	look: MachineLook;
	head: number;
	uv: number;
	rim: number;
	rimColor: string;
}> = ({look, head, uv, rim, rimColor}) => {
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const id = (n: string) => `${n}-${uid}`;
	const url = (n: string) => `url(#${id(n)})`;

	const cx = 300;
	const bw = look.baseWidth;
	const g = machineGeometry(look, head);
	const topY = g.topY;
	const cy = g.carriageY;
	const gloss = look.finish === 'gloss' ? 1 : look.finish === 'satin' ? 0.55 : 0.2;
	const d = look.detail;

	const mastW = look.dualMast ? 40 : 44;
	const masts = look.dualMast ? [cx - (bw / 2 - 70), cx + (bw / 2 - 70)] : [cx];
	const cw = look.carriageWidth;

	// Equipment on the deck
	const innerL = look.dualMast ? masts[0] + mastW / 2 + 14 : cx - bw / 2 + 22;
	const innerR = look.dualMast ? masts[1] - mastW / 2 - 14 : cx + bw / 2 - 22;
	const inkL = innerL;
	const inkR = look.dualMast ? cx - 24 : cx - mastW / 2 - 26;
	const ctrlL = look.dualMast ? cx + 24 : cx + mastW / 2 + 40;
	const ctrlR = innerR;
	const inkH = 84;
	const ctrlH = d > 0.5 ? 116 : 88;

	const chainX = masts[masts.length - 1] + mastW / 2 + 8;
	const carriageBottom = cy + CARRIAGE_H;

	return (
		<svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<linearGradient id={id('rail')} x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor={look.rail} stopOpacity={1} />
					<stop offset="0.08" stopColor={shade(look.rail, -0.35)} />
					<stop offset="0.3" stopColor={look.rail} />
					<stop offset="0.44" stopColor={look.railLight} />
					<stop offset="0.56" stopColor={look.rail} />
					<stop offset="0.9" stopColor={shade(look.rail, -0.25)} />
					<stop offset="1" stopColor={shade(look.rail, -0.5)} />
				</linearGradient>
				<linearGradient id={id('body')} x1="0" x2="1" y1="0" y2="1">
					<stop offset="0" stopColor={look.bodyLight} />
					<stop offset="0.45" stopColor={look.body} />
					<stop offset="1" stopColor={look.bodyDark} />
				</linearGradient>
				<linearGradient id={id('bodyV')} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={look.bodyLight} />
					<stop offset="0.35" stopColor={look.body} />
					<stop offset="1" stopColor={look.bodyDark} />
				</linearGradient>
				<linearGradient id={id('deck')} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={shade(look.bodyLight, 0.05)} />
					<stop offset="1" stopColor={look.body} />
				</linearGradient>
				<linearGradient id={id('dark')} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#2A2B2F" />
					<stop offset="1" stopColor="#0B0B0D" />
				</linearGradient>
				<radialGradient id={id('hub')} cx="0.4" cy="0.35" r="0.7">
					<stop offset="0" stopColor="#E6E8EB" />
					<stop offset="0.6" stopColor="#8D9299" />
					<stop offset="1" stopColor="#3B3E43" />
				</radialGradient>
				<linearGradient id={id('sheen')} x1="0" x2="1" y1="0" y2="0.4">
					<stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
					<stop offset="0.38" stopColor="#FFFFFF" stopOpacity={0} />
					<stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.35 * gloss} />
					<stop offset="0.62" stopColor="#FFFFFF" stopOpacity={0} />
					<stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
				</linearGradient>
				<linearGradient id={id('pearl')} x1="0" x2="1" y1="0" y2="1">
					<stop offset="0" stopColor="#FFD8EC" />
					<stop offset="0.5" stopColor="#D6ECFF" />
					<stop offset="1" stopColor="#FFF1D2" />
				</linearGradient>
				<linearGradient id={id('screen')} x1="0" x2="1" y1="0" y2="1">
					<stop offset="0" stopColor="#10213F" />
					<stop offset="1" stopColor="#05080F" />
				</linearGradient>
				<linearGradient id={id('glass')} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#FFFFFF" stopOpacity={0.22} />
					<stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.05} />
					<stop offset="1" stopColor="#FFFFFF" stopOpacity={0.12} />
				</linearGradient>
				<filter id={id('glow')} x="-50%" y="-200%" width="200%" height="500%">
					<feGaussianBlur stdDeviation="6" />
				</filter>
				<filter id={id('softglow')} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="2.2" />
				</filter>
			</defs>

			{/* ——— rear casters (further away, smaller, darker) ——— */}
			{[-1, 1].map((s) => (
				<g key={`rw${s}`} opacity={0.75}>
					<rect x={cx + s * (bw / 2 - 78) - 6} y={BASE_BOTTOM} width={12} height={14} fill="#1A1B1E" />
					<Wheel x={cx + s * (bw / 2 - 78)} y={FLOOR - 21 - 8} r={20} hub={url('hub')} />
				</g>
			))}

			{/* ——— stabiliser feet ——— */}
			{d >= 0.8 &&
				[-1, 1].map((s) => {
					const x = cx + s * (bw / 2 - 6);
					return (
						<g key={`foot${s}`}>
							<rect x={x - 3} y={BASE_BOTTOM - 4} width={6} height={FLOOR - BASE_BOTTOM - 4} fill={url('rail')} />
							{Array.from({length: 7}).map((_, i) => (
								<line key={i} x1={x - 3} x2={x + 3} y1={BASE_BOTTOM + 6 + i * 6} y2={BASE_BOTTOM + 3 + i * 6} stroke="#000" strokeOpacity={0.35} strokeWidth={1} />
							))}
							<rect x={x - 13} y={FLOOR - 8} width={26} height={8} rx={3} fill="#151618" />
						</g>
					);
				})}

			{/* ——— base ——— */}
			<g>
				{/* top face, in slight perspective */}
				<polygon
					points={`${cx - bw / 2 + 16},${DECK} ${cx + bw / 2 - 16},${DECK} ${cx + bw / 2},${BASE_TOP} ${cx - bw / 2},${BASE_TOP}`}
					fill={url('deck')}
				/>
				<rect x={cx - bw / 2} y={BASE_TOP} width={bw} height={BASE_H} rx={4} fill={url('bodyV')} />
				<rect x={cx - bw / 2} y={BASE_TOP} width={bw} height={BASE_H} rx={4} fill={url('sheen')} />
				<rect x={cx - bw / 2} y={BASE_TOP} width={bw} height={1.5} fill="#FFFFFF" opacity={0.25 + 0.3 * gloss} />
				<rect x={cx - bw / 2} y={BASE_BOTTOM - 3} width={bw} height={3} fill="#000" opacity={0.35} />
				{/* accent light strip */}
				<rect x={cx - 34} y={BASE_TOP + 20} width={68} height={3} rx={1.5} fill={look.accent} filter={url('softglow')} opacity={0.9} />
				<rect x={cx - 34} y={BASE_TOP + 20} width={68} height={3} rx={1.5} fill={shade(look.accent, 0.5)} />
			</g>

			{/* ——— front casters ——— */}
			{[-1, 1].map((s) => {
				const x = cx + s * (bw / 2 - 34);
				return (
					<g key={`fw${s}`}>
						<path d={`M ${x - 13} ${BASE_BOTTOM} L ${x + 13} ${BASE_BOTTOM} L ${x + 8} ${FLOOR - WHEEL_R} L ${x - 8} ${FLOOR - WHEEL_R} Z`} fill="#202125" />
						<rect x={x - 15} y={BASE_BOTTOM} width={30} height={5} fill={url('rail')} />
						<Wheel x={x} y={FLOOR - WHEEL_R} r={WHEEL_R} hub={url('hub')} />
					</g>
				);
			})}

			{/* ——— ink system ——— */}
			<g>
				<rect x={inkL} y={DECK - inkH} width={inkR - inkL} height={inkH} rx={6} fill={url('body')} />
				<rect x={inkL} y={DECK - inkH} width={inkR - inkL} height={1.5} fill="#FFFFFF" opacity={0.35 * gloss + 0.1} />
				{d >= 0.4 ? (
					<g>
						<rect x={inkL + 8} y={DECK - inkH + 12} width={inkR - inkL - 16} height={inkH - 22} rx={4} fill="#0C0D10" opacity={0.85} />
						{INKS.slice(0, 5).map((c, i, arr) => {
							const slot = (inkR - inkL - 28) / arr.length;
							const bx = inkL + 14 + i * slot;
							const bwid = slot - 6;
							const top = DECK - inkH + 20;
							const h = inkH - 36;
							const level = [0.7, 0.55, 0.8, 0.62, 0.74][i];
							return (
								<g key={c}>
									<rect x={bx} y={top} width={bwid} height={h} rx={3} fill="#FFFFFF" opacity={0.08} />
									<rect x={bx} y={top + h * (1 - level)} width={bwid} height={h * level} rx={2} fill={c} opacity={0.92} />
									<rect x={bx + 2} y={top + 2} width={2} height={h - 4} fill="#FFFFFF" opacity={0.25} />
								</g>
							);
						})}
						<rect x={inkL + 8} y={DECK - inkH + 12} width={inkR - inkL - 16} height={inkH - 22} rx={4} fill={url('glass')} />
					</g>
				) : (
					<rect x={inkL + 10} y={DECK - inkH + 14} width={inkR - inkL - 20} height={2} fill="#000" opacity={0.2} />
				)}
			</g>

			{/* ——— control unit ——— */}
			<g>
				<rect x={ctrlL} y={DECK - ctrlH} width={ctrlR - ctrlL} height={ctrlH} rx={6} fill={url('body')} />
				<rect x={ctrlL} y={DECK - ctrlH} width={ctrlR - ctrlL} height={ctrlH} rx={6} fill={url('sheen')} />
				<rect x={ctrlL} y={DECK - ctrlH} width={ctrlR - ctrlL} height={1.5} fill="#FFFFFF" opacity={0.35 * gloss + 0.1} />
				{d > 0.5 ? (
					<g>
						<rect x={ctrlL + 10} y={DECK - ctrlH + 12} width={ctrlR - ctrlL - 20} height={ctrlH * 0.5} rx={4} fill={url('screen')} />
						<rect x={ctrlL + 20} y={DECK - ctrlH + 24} width={(ctrlR - ctrlL - 40) * 0.6} height={3} rx={1.5} fill={look.accent} opacity={0.85} />
						<rect x={ctrlL + 20} y={DECK - ctrlH + 34} width={(ctrlR - ctrlL - 40) * 0.8} height={2} rx={1} fill="#FFFFFF" opacity={0.18} />
						<rect x={ctrlL + 20} y={DECK - ctrlH + 42} width={(ctrlR - ctrlL - 40) * 0.45} height={2} rx={1} fill="#FFFFFF" opacity={0.18} />
						<rect x={ctrlL + 10} y={DECK - ctrlH + 12} width={ctrlR - ctrlL - 20} height={ctrlH * 0.5} rx={4} fill={url('glass')} />
					</g>
				) : null}
				<circle cx={ctrlR - 16} cy={DECK - 16} r={3} fill={look.accent} filter={url('softglow')} />
				<circle cx={ctrlR - 16} cy={DECK - 16} r={2} fill={shade(look.accent, 0.6)} />
				{/* vents */}
				{Array.from({length: 4}).map((_, i) => (
					<rect key={i} x={ctrlL + 12} y={DECK - 30 + i * 5} width={34} height={1.6} rx={0.8} fill="#000" opacity={0.28} />
				))}
			</g>

			{/* ——— ink tubes to the cable chain ——— */}
			{d >= 0.6 && (
				<g fill="none" strokeLinecap="round">
					<path d={`M ${inkR - 12} ${DECK - inkH} C ${inkR + 10} ${DECK - inkH - 30}, ${chainX - 20} ${DECK - 60}, ${chainX + 7} ${DECK - 34}`} stroke="#0E0F12" strokeWidth={5} opacity={0.8} />
					<path d={`M ${inkR - 12} ${DECK - inkH} C ${inkR + 10} ${DECK - inkH - 30}, ${chainX - 20} ${DECK - 60}, ${chainX + 7} ${DECK - 34}`} stroke="#FFFFFF" strokeWidth={1} opacity={0.18} />
				</g>
			)}

			{/* ——— masts ——— */}
			{masts.map((mx, i) => (
				<g key={`mast${i}`}>
					<rect x={mx - mastW / 2} y={topY} width={mastW} height={DECK - topY} fill={url('rail')} />
					<rect x={mx - mastW / 2 + mastW * 0.28} y={topY + 20} width={1.6} height={DECK - topY - 30} fill="#000" opacity={0.35} />
					<rect x={mx - mastW / 2 + mastW * 0.72} y={topY + 20} width={1.6} height={DECK - topY - 30} fill="#000" opacity={0.35} />
					<rect x={mx - mastW / 2 + mastW * 0.44} y={topY} width={1.2} height={DECK - topY} fill="#FFFFFF" opacity={0.25 + 0.4 * gloss} />
					{/* foot bracket */}
					<rect x={mx - mastW / 2 - 12} y={DECK - 22} width={mastW + 24} height={22} rx={3} fill={url('dark')} />
					{/* top cap */}
					<rect x={mx - mastW / 2 - 8} y={topY - 18} width={mastW + 16} height={24} rx={4} fill={url('dark')} />
					<rect x={mx - mastW / 2 - 8} y={topY - 18} width={mastW + 16} height={1.5} fill="#FFFFFF" opacity={0.25} />
					{rim > 0 && (
						<>
							<rect x={mx - mastW / 2} y={topY} width={1.5} height={DECK - topY} fill={rimColor} opacity={rim} />
							<rect x={mx + mastW / 2 - 1.5} y={topY} width={1.5} height={DECK - topY} fill={rimColor} opacity={rim * 0.6} />
						</>
					)}
				</g>
			))}

			{/* dual-mast frame: top cross-beam */}
			{look.dualMast && (
				<g>
					<rect x={masts[0] - mastW / 2 - 8} y={topY - 18} width={masts[1] - masts[0] + mastW + 16} height={26} rx={4} fill={url('dark')} />
					<rect x={masts[0] - mastW / 2 - 8} y={topY - 18} width={masts[1] - masts[0] + mastW + 16} height={1.5} fill="#FFFFFF" opacity={0.3} />
				</g>
			)}

			{/* wall stand-off rollers at the top */}
			{d >= 0.5 && (
				<g>
					<rect x={cx - (look.dualMast ? bw / 2 - 40 : 78)} y={topY - 10} width={(look.dualMast ? bw / 2 - 40 : 78) * 2} height={8} rx={4} fill={url('rail')} />
					{[-1, 1].map((s) => (
						<g key={`roll${s}`}>
							<circle cx={cx + s * (look.dualMast ? bw / 2 - 40 : 78)} cy={topY - 6} r={13} fill="#121315" />
							<circle cx={cx + s * (look.dualMast ? bw / 2 - 40 : 78)} cy={topY - 6} r={5} fill={url('hub')} />
						</g>
					))}
				</g>
			)}

			{/* ——— cable chain ——— */}
			{d >= 0.6 && (
				<g>
					{Array.from({length: Math.max(0, Math.floor((DECK - 30 - carriageBottom) / 13))}).map((_, i) => {
						const y = DECK - 34 - (i + 1) * 13;
						return (
							<g key={i}>
								<rect x={chainX} y={y} width={15} height={11} rx={2} fill="#17181B" />
								<rect x={chainX + 2} y={y + 1} width={11} height={1.2} fill="#FFFFFF" opacity={0.14} />
								<circle cx={chainX + 7.5} cy={y + 6} r={1.4} fill="#3A3C41" />
							</g>
						);
					})}
				</g>
			)}

			{/* ——— printing carriage ——— */}
			<g>
				{look.dualMast && (
					<g>
						<rect x={masts[0] - mastW / 2 - 6} y={cy + 52} width={masts[1] - masts[0] + mastW + 12} height={40} rx={4} fill={url('rail')} />
						<rect x={masts[0] - mastW / 2 - 6} y={cy + 52} width={masts[1] - masts[0] + mastW + 12} height={1.5} fill="#FFFFFF" opacity={0.5} />
						<rect x={masts[0] - mastW / 2 - 6} y={cy + 88} width={masts[1] - masts[0] + mastW + 12} height={4} fill="#000" opacity={0.3} />
					</g>
				)}
				{/* rail blocks behind the carriage */}
				{!look.dualMast && (
					<rect x={cx - mastW / 2 - 14} y={cy - 12} width={mastW + 28} height={CARRIAGE_H + 24} rx={5} fill={url('dark')} />
				)}
				{/* cartridges */}
				{d >= 0.5 &&
					INKS.map((c, i) => {
						const n = INKS.length;
						const span = Math.min(cw - 60, 132);
						const x = cx - span / 2 + (i * span) / n + 2;
						const w = span / n - 4;
						return (
							<g key={`cart${i}`}>
								<rect x={x} y={cy - 26} width={w} height={30} rx={2.5} fill={c} />
								<rect x={x} y={cy - 26} width={w} height={30} rx={2.5} fill={url('glass')} />
								<rect x={x - 1} y={cy - 30} width={w + 2} height={7} rx={2} fill="#1A1B1E" />
							</g>
						);
					})}
				<rect x={cx - cw / 2} y={cy} width={cw} height={CARRIAGE_H} rx={10} fill={url('body')} />
				{look.pearl && <rect x={cx - cw / 2} y={cy} width={cw} height={CARRIAGE_H} rx={10} fill={url('pearl')} opacity={0.22} />}
				<rect x={cx - cw / 2} y={cy} width={cw} height={CARRIAGE_H} rx={10} fill={url('sheen')} />
				<rect x={cx - cw / 2 + 8} y={cy + 1} width={cw - 16} height={1.6} rx={0.8} fill="#FFFFFF" opacity={0.3 + 0.45 * gloss} />
				{/* panel split line */}
				<rect x={cx - cw / 2 + 12} y={cy + CARRIAGE_H * 0.64} width={cw - 24} height={1.2} fill="#000" opacity={0.22} />
				<rect x={cx - cw / 2 + 12} y={cy + CARRIAGE_H * 0.64 + 1.2} width={cw - 24} height={1} fill="#FFFFFF" opacity={0.12 + 0.2 * gloss} />
				{/* engraved wordmark */}
				<text
					x={cx - cw / 2 + 20}
					y={cy + CARRIAGE_H * 0.64 - 14}
					fontFamily="SympsInter, Inter, Helvetica, Arial"
					fontWeight={600}
					fontSize={13}
					letterSpacing={4}
					fill={shade(look.body, luminance(look.body) > 0.5 ? -0.35 : 0.35)}
					opacity={0.8}
				>
					SYMP’S
				</text>
				{/* status light */}
				<circle cx={cx + cw / 2 - 22} cy={cy + CARRIAGE_H * 0.64 - 18} r={4} fill={look.accent} filter={url('softglow')} />
				<circle cx={cx + cw / 2 - 22} cy={cy + CARRIAGE_H * 0.64 - 18} r={2.2} fill={shade(look.accent, 0.6)} />
				{/* vents */}
				{d >= 0.3 &&
					Array.from({length: 5}).map((_, i) => (
						<rect key={i} x={cx + cw / 2 - 64} y={cy + CARRIAGE_H * 0.72 + i * 6} width={44} height={2} rx={1} fill="#000" opacity={0.3} />
					))}
				{/* side handles */}
				{[-1, 1].map((s) => (
					<rect key={`h${s}`} x={s < 0 ? cx - cw / 2 - 6 : cx + cw / 2 - 2} y={cy + 30} width={8} height={CARRIAGE_H - 60} rx={3} fill={url('dark')} />
				))}
				{rim > 0 && (
					<rect x={cx - cw / 2 + 0.75} y={cy + 0.75} width={cw - 1.5} height={CARRIAGE_H - 1.5} rx={10} fill="none" stroke={rimColor} strokeWidth={1.5} opacity={rim * 0.8} />
				)}
				{/* UV lamp */}
				<rect x={cx - cw / 2 + 18} y={cy + CARRIAGE_H - 2} width={cw - 36} height={9} rx={3} fill="#1C1A26" />
				{uv > 0 && (
					<g>
						<rect x={cx - cw / 2 + 22} y={cy + CARRIAGE_H + 3} width={cw - 44} height={4} rx={2} fill="#8C7BFF" filter={url('glow')} opacity={uv} />
						<rect x={cx - cw / 2 + 22} y={cy + CARRIAGE_H + 3} width={cw - 44} height={3} rx={1.5} fill="#DCD6FF" opacity={uv} />
					</g>
				)}
			</g>

			{rim > 0 && (
				<rect x={cx - bw / 2} y={BASE_TOP} width={bw} height={1.5} fill={rimColor} opacity={rim} />
			)}
		</svg>
	);
};

const Wheel: React.FC<{x: number; y: number; r: number; hub: string}> = ({x, y, r, hub}) => (
	<g>
		<circle cx={x} cy={y} r={r} fill="#101113" />
		<circle cx={x} cy={y} r={r - 3} fill="none" stroke="#2A2B30" strokeWidth={1.5} />
		<circle cx={x} cy={y} r={r * 0.42} fill={hub} />
		{[0, 60, 120, 180, 240, 300].map((a) => (
			<circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r * 0.27} cy={y + Math.sin((a * Math.PI) / 180) * r * 0.27} r={1.1} fill="#2B2D31" />
		))}
		<circle cx={x} cy={y} r={2.2} fill="#1A1B1E" />
		<path d={`M ${x - r * 0.75} ${y - r * 0.55} A ${r * 0.9} ${r * 0.9} 0 0 1 ${x + r * 0.2} ${y - r * 0.88}`} stroke="#FFFFFF" strokeOpacity={0.14} strokeWidth={1.5} fill="none" />
	</g>
);

// ——— tiny colour helpers ———
const hex = (c: string) => {
	const n = parseInt(c.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const luminance = (c: string) => {
	const [r, g, b] = hex(c);
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
/** amt > 0 lightens toward white, amt < 0 darkens toward black. */
export const shade = (c: string, amt: number) => {
	const [r, g, b] = hex(c);
	const f = (v: number) => Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt));
	return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};
export const hexA = (c: string, a: number) => {
	const [r, g, b] = hex(c);
	return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
};
