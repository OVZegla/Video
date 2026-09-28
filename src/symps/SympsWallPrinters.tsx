import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {LINE_DURATION, LineTransition, lineMask, lineState} from './components/LineTransition';
import {Grain, Vignette} from './components/Stage';
import {ensureSympsFonts} from './fonts';
import {FIRST_ACT_COUNT, PRODUCTS, type Product} from './data/products';
import {mastScreenX} from './layout';
import {ApplicationScene, APPS_DURATION} from './scenes/ApplicationScene';
import {BrandStatement} from './scenes/BrandStatement';
import {INTRO_DURATION, Intro} from './scenes/Intro';
import {OUTRO_DURATION, Outro} from './scenes/Outro';
import {ProductLineup} from './scenes/ProductLineup';
import {PRINTHEAD_DURATION, PrintheadScene} from './scenes/PrintheadScene';
import {ProductReveal} from './scenes/ProductReveal';
import {TECH_DURATION, TechnologySection} from './scenes/TechnologySection';
import {ease, prog} from './theme';

/**
 * SYMP'S — the wall printer range. Master timeline.
 *
 * The film is a list of segments; each one says how it enters
 * ('fade' through a short cross-dissolve, or 'line' where the previous
 * machine's mast becomes a travelling line of light). Start frames are
 * derived, so segments can be re-timed, reordered or removed freely.
 */

const FADE = 22;
const HERO_DURATION = 190;
const PRODUCT_DURATION = 104;
const BRAND_DURATION = 180;
const LINEUP_DURATION = 210;

type Enter = 'fade' | 'line' | 'none';
type Segment = {key: string; dur: number; enter: Enter; product?: Product; render: () => React.ReactNode};

const hero = PRODUCTS[0];
const firstAct = PRODUCTS.slice(1, FIRST_ACT_COUNT);
const secondAct = PRODUCTS.slice(FIRST_ACT_COUNT);

const productSegment = (p: Product, enter: Enter, isHero = false): Segment => {
	const dur = isHero ? HERO_DURATION : PRODUCT_DURATION;
	return {key: `product-${p.id}`, dur, enter, product: p, render: () => <ProductReveal product={p} duration={dur} hero={isHero} />};
};

const SEGMENTS: Segment[] = [
	{key: 'intro', dur: INTRO_DURATION, enter: 'none', render: () => <Intro product={hero} />},
	productSegment(hero, 'fade', true),
	...firstAct.map((p) => productSegment(p, 'line')),
	{
		key: 'brand',
		dur: BRAND_DURATION,
		enter: 'fade',
		render: () => <BrandStatement products={PRODUCTS.slice(0, FIRST_ACT_COUNT)} duration={BRAND_DURATION} />,
	},
	...secondAct.map((p, i) => productSegment(p, i === 0 ? 'fade' : 'line')),
	{key: 'applications', dur: APPS_DURATION, enter: 'fade', render: () => <ApplicationScene />},
	{key: 'technology', dur: TECH_DURATION, enter: 'fade', render: () => <TechnologySection product={hero} />},
	{key: 'printheads', dur: PRINTHEAD_DURATION, enter: 'fade', render: () => <PrintheadScene />},
	{key: 'lineup', dur: LINEUP_DURATION, enter: 'fade', render: () => <ProductLineup products={PRODUCTS} duration={LINEUP_DURATION} />},
	{key: 'outro', dur: OUTRO_DURATION, enter: 'fade', render: () => <Outro />},
];

const overlap = (e: Enter) => (e === 'line' ? LINE_DURATION : e === 'fade' ? FADE : 0);

type Placed = Segment & {from: number; prev?: Segment; next?: Segment};

const TIMELINE: Placed[] = (() => {
	let t = 0;
	return SEGMENTS.map((s, i) => {
		const from = i === 0 ? 0 : t - overlap(s.enter);
		t = from + s.dur;
		return {...s, from, prev: SEGMENTS[i - 1], next: SEGMENTS[i + 1]};
	});
})();

export const SYMPS_DURATION = TIMELINE[TIMELINE.length - 1].from + TIMELINE[TIMELINE.length - 1].dur;

const lineDirection = (p: Product): 1 | -1 => (p.side === 'right' ? -1 : 1);

/** Applies the entry / exit treatment of a segment around its content. */
const Shell: React.FC<{seg: Placed; children: React.ReactNode}> = ({seg, children}) => {
	const f = useCurrentFrame();
	let style: React.CSSProperties = {};
	let dim = 0;

	if (seg.enter === 'fade') {
		style.opacity = prog(f, 0, FADE, ease.inOut);
	}
	if (seg.enter === 'line' && seg.prev?.product && f < LINE_DURATION) {
		const dir = lineDirection(seg.prev.product);
		const s = lineState(f, mastScreenX(seg.prev.product), dir);
		style = {...style, opacity: s.incoming, ...lineMask(s.x, dir)};
	}
	if (seg.next?.enter === 'fade') {
		// dip to black under the incoming shot so bright and dark scenes never mix
		dim = prog(f, seg.dur - FADE, seg.dur - FADE * 0.25, ease.inOut);
	}
	if (seg.next?.enter === 'line' && seg.product) {
		const lf = f - (seg.dur - LINE_DURATION);
		if (lf >= 0) dim = lineState(lf, mastScreenX(seg.product), lineDirection(seg.product)).dim * 0.92;
	}

	return (
		<AbsoluteFill style={style}>
			{children}
			{dim > 0 && <AbsoluteFill style={{background: '#000', opacity: dim}} />}
		</AbsoluteFill>
	);
};

export const SympsWallPrinters: React.FC = () => {
	ensureSympsFonts();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{TIMELINE.map((seg) => (
				<Sequence key={seg.key} name={seg.key} from={seg.from} durationInFrames={seg.dur}>
					<Shell seg={seg}>{seg.render()}</Shell>
				</Sequence>
			))}
			{TIMELINE.filter((s) => s.enter === 'line' && s.prev?.product).map((seg) => (
				<Sequence key={`line-${seg.key}`} name={`line → ${seg.key}`} from={seg.from} durationInFrames={LINE_DURATION}>
					<LineTransition fromX={mastScreenX(seg.prev!.product!)} direction={lineDirection(seg.prev!.product!)} />
				</Sequence>
			))}
			<Vignette strength={0.35} />
			<Grain opacity={0.07} />
		</AbsoluteFill>
	);
};
