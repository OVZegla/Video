import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Room, WALL, type RoomKind} from '../components/Room';
import type {MuralStyle} from '../components/Mural';
import {RevealLine, fontBase} from '../components/Typography';
import {PROJECT_IMAGES} from '../data/assets.generated';
import {C, ease, inOut, lerp, prog} from '../theme';

type Space = {kind: RoomKind; label: string; mural: {style: MuralStyle; palette: string[]}};

export const SPACES: Space[] = [
	{kind: 'hotel', label: 'Hôtellerie', mural: {style: 'horizon', palette: ['#1B2A4A', '#6C7FA6', '#C9A98A', '#2C3550', '#F2D7B0']}},
	{kind: 'restaurant', label: 'Restauration', mural: {style: 'arches', palette: ['#E8D9C4', '#C56B4A', '#E0A77A', '#8B4A36', '#F1C9A0']}},
	{kind: 'retail', label: 'Commerce', mural: {style: 'blobs', palette: ['#F3EEE8', '#F6B8C8', '#9FC7F5', '#F7D59A', '#C7B6F2']}},
	{kind: 'office', label: 'Bureaux', mural: {style: 'lines', palette: ['#10151F', '#8FA3BF', '#2F7BFF']}},
	{kind: 'home', label: 'Habitat', mural: {style: 'botanical', palette: ['#E6E2D6', '#7C9A7E', '#4E6B55', '#A9BFA0', '#2F4A3A']}},
	{kind: 'event', label: 'Événementiel & art', mural: {style: 'geo', palette: ['#0D1B3D', '#2F7BFF', '#E0233D', '#F2EFE8', '#F5B83D']}},
];

export const APPS_DURATION = 270;
const FIRST = 112; // the first space: blank wall, then the print
const EACH = 34; // the following spaces
const XF = 12; // cross-fade

const SpaceShot: React.FC<{space: Space; index: number; dur: number; print: (f: number) => number}> = ({space, index, dur, print}) => {
	const f = useCurrentFrame();
	const push = lerp(1, 1.07, prog(f, 0, dur, ease.linear));
	const photo = PROJECT_IMAGES[index];
	return (
		<AbsoluteFill style={{background: '#000', transformOrigin: `${WALL.x + WALL.w / 2}px ${WALL.y + WALL.h / 2}px`, transform: `scale(${push})`}}>
			{photo ? (
				<Img src={staticFile(photo)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			) : (
				<Room kind={space.kind} mural={space.mural} print={print(f)} />
			)}
		</AbsoluteFill>
	);
};

export const ApplicationScene: React.FC = () => {
	const f = useCurrentFrame();
	const starts = SPACES.map((_, i) => (i === 0 ? 0 : FIRST - XF + (i - 1) * (EACH - XF / 2)));
	const lastEnd = APPS_DURATION;

	const labelFor = (i: number) => {
		const s = starts[i];
		const e = i + 1 < SPACES.length ? starts[i + 1] + XF : lastEnd;
		return inOut(f, s + (i === 0 ? 70 : 8), s + (i === 0 ? 86 : 20), e - 10, e, ease.inOut);
	};

	return (
		<AbsoluteFill style={{background: '#000'}}>
			{SPACES.map((space, i) => {
				const from = starts[i];
				const dur = (i + 1 < SPACES.length ? starts[i + 1] + XF : lastEnd) - from;
				const o = i === 0 ? 1 : prog(f, from, from + XF, ease.inOut);
				return (
					<Sequence key={space.kind} from={from} durationInFrames={dur} layout="none">
						<AbsoluteFill style={{opacity: o}}>
							<SpaceShot
								space={space}
								index={i}
								dur={dur}
								print={(lf) => (i === 0 ? prog(lf, 44, 104, ease.inOut) : 1)}
							/>
						</AbsoluteFill>
					</Sequence>
				);
			})}

			{/* ceiling-zone darkening so type always reads */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 22%)'}} />

			{/* space labels */}
			{SPACES.map((s, i) => (
				<div
					key={s.kind}
					style={{
						...fontBase,
						position: 'absolute',
						left: 96,
						bottom: 80,
						fontSize: 20,
						fontWeight: 500,
						letterSpacing: '0.32em',
						textTransform: 'uppercase',
						color: C.ink,
						opacity: labelFor(i) * 0.85,
					}}
				>
					{s.label}
				</div>
			))}

			<AbsoluteFill style={{alignItems: 'center', paddingTop: 44}}>
				<RevealLine at={8} out={60}>
					<div style={{...fontBase, fontSize: 60, fontWeight: 300, letterSpacing: '-0.025em', color: C.ink}}>Du mur blanc…</div>
				</RevealLine>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 44}}>
				<RevealLine at={176} out={APPS_DURATION - 14} outDur={14}>
					<div style={{...fontBase, fontSize: 60, fontWeight: 500, letterSpacing: '-0.025em', color: C.ink}}>…à l’espace qui vous ressemble.</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
