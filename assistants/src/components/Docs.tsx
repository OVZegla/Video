import React from 'react';
import {C, FONT_DISPLAY, FONT_UI, RoleId} from '../theme';
import {Icon} from './Icon';
import {JobTag, Pill, RoleTag} from './ui';
import {TerracePhoto} from './Illustrations';
import type {Tone} from './ui';
import type {IconName} from '../theme';

// Deliverables prepared from the same job folder. Each one carries the
// same JobTag (blue pin) so the viewer reads them as one job.

export const DOC = {w: 460, h: 360};

const Frame: React.FC<{
	role: RoleId;
	status: string;
	tone: Tone;
	icon?: IconName;
	children: React.ReactNode;
}> = ({role, status, tone, icon, children}) => (
	<div
		style={{
			width: DOC.w,
			height: DOC.h,
			position: 'relative',
			fontFamily: FONT_UI,
			color: C.ink,
			background: '#fff',
		}}
	>
		<div
			style={{
				position: 'absolute',
				top: 22,
				left: 24,
				right: 24,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<RoleTag role={role} size={15} />
			<JobTag size={13} />
		</div>
		<div style={{position: 'absolute', top: 66, left: 24, right: 24, bottom: 70}}>{children}</div>
		<div
			style={{
				position: 'absolute',
				left: 24,
				right: 24,
				bottom: 20,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<Pill tone={tone} size={14} icon={icon}>
				{status}
			</Pill>
		</div>
	</div>
);

const Title: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 25}) => (
	<div style={{fontFamily: FONT_DISPLAY, fontSize: size, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1}}>
		{children}
	</div>
);

const Row: React.FC<{k: string; v: string}> = ({k, v}) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: 36,
			borderBottom: `1px solid ${C.line}`,
			fontSize: 15.5,
		}}
	>
		<span style={{color: C.ink2}}>{k}</span>
		<span style={{fontWeight: 620}}>{v}</span>
	</div>
);

export const DocNote: React.FC = () => (
	<Frame role="secretaire" status="Classée · Chantiers 2026" tone="neutral" icon="folder">
		<Title>Note d’intervention</Title>
		<div style={{fontSize: 14.5, color: C.ink3, marginTop: 6}}>Lundi 28 septembre · 17:40</div>
		<div style={{display: 'flex', gap: 14, marginTop: 16}}>
			<TerracePhoto w={104} h={104} radius={12} id="tp-d1" />
			<div style={{flex: 1, fontSize: 15.5, lineHeight: 1.45, color: C.ink}}>
				Pose de la terrasse en bois terminée.
				<div style={{color: C.ink2, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6}}>
					<Icon name="image" size={16} color={C.ink3} /> 1 photo · 1 note vocale
				</div>
			</div>
		</div>
	</Frame>
);

export const DocInvoice: React.FC = () => (
	<Frame role="commercial" status="À vérifier" tone="wait" icon="eye">
		<Title>Éléments de facturation</Title>
		<div style={{fontSize: 14.5, color: C.ink3, marginTop: 6}}>Client : Mme Martin · selon devis accepté</div>
		<div style={{marginTop: 12}}>
			<Row k="Pose de la terrasse" v="1 forfait" />
			<Row k="Lames et lambourdes" v="selon devis" />
			<Row k="Acompte reçu" v="à déduire" />
		</div>
	</Frame>
);

export const DocWeb: React.FC = () => (
	<Frame role="web" status="Proposée pour le site" tone="ok" icon="browser">
		<div
			style={{
				borderRadius: 12,
				overflow: 'hidden',
				boxShadow: `0 0 0 1px ${C.line}`,
				height: 214,
				position: 'relative',
			}}
		>
			<div style={{height: 24, background: '#F1F0EC', display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px'}}>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{width: 7, height: 7, borderRadius: 4, background: 'rgba(21,23,28,0.18)'}} />
				))}
				<div style={{marginLeft: 10, fontSize: 11.5, color: C.ink3, fontWeight: 560}}>Nos réalisations</div>
			</div>
			<div style={{display: 'flex'}}>
				<TerracePhoto w={196} h={190} radius={0} id="tp-d3" />
				<div style={{padding: '16px 16px', flex: 1}}>
					<div style={{fontSize: 11.5, fontWeight: 650, color: '#6F63E6', letterSpacing: '0.06em', textTransform: 'uppercase'}}>
						Réalisation
					</div>
					<div style={{fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, letterSpacing: '-0.015em', marginTop: 6, lineHeight: 1.15}}>
						Terrasse en bois
					</div>
					<div style={{fontSize: 13, color: C.ink2, marginTop: 8, lineHeight: 1.45}}>
						Pose sur lambourdes, finitions et nettoyage du chantier.
					</div>
				</div>
			</div>
		</div>
	</Frame>
);

export const DocPost: React.FC = () => (
	<Frame role="com" status="Prête à relire" tone="wait" icon="eye">
		<div style={{display: 'flex', gap: 16}}>
			<div style={{position: 'relative', width: 196, height: 214, borderRadius: 12, overflow: 'hidden', flexShrink: 0}}>
				<TerracePhoto w={196} h={214} radius={0} id="tp-d4" />
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55))',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: 14,
						bottom: 12,
						right: 12,
						color: '#fff',
						fontFamily: FONT_DISPLAY,
						fontSize: 22,
						fontWeight: 720,
						lineHeight: 1.05,
						letterSpacing: '-0.02em',
					}}
				>
					Nouvelle
					<br />
					réalisation
				</div>
			</div>
			<div style={{flex: 1}}>
				<Title size={21}>Visuel de publication</Title>
				<div style={{fontSize: 14.5, lineHeight: 1.45, color: C.ink2, marginTop: 10}}>
					« Une terrasse en bois prête pour les beaux jours d’automne. »
				</div>
			</div>
		</div>
	</Frame>
);

export const DOCS: {role: RoleId; title: string; C: React.FC}[] = [
	{role: 'secretaire', title: 'Note d’intervention', C: DocNote},
	{role: 'commercial', title: 'Éléments de facturation', C: DocInvoice},
	{role: 'web', title: 'Fiche de réalisation', C: DocWeb},
	{role: 'com', title: 'Visuel de publication', C: DocPost},
];
