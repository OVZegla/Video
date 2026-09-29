import {K} from '../franchise/theme';
import {Eye} from '../franchise/ui';
import {Glyph} from './glyphs';
import {
	Artboard,
	Ateliers,
	BrandBoard,
	Chain,
	Checks,
	Costs,
	Countdown,
	Feed,
	Floor,
	Fork,
	Growth,
	Hero,
	Kpis,
	Materials,
	Network,
	Practice,
	Range,
	Settings,
	Stage,
	StockPlan,
	Talk,
	Territory,
	Tiles,
	WindowOnline,
} from './stages';

/** One illustration per beat, in the order of MODULES in copy.ts. */
export const STAGES: Stage[][] = [
	// 01 — Construire votre projet
	[
		Tiles([
			{g: 'bulb', l: 'Votre activité'},
			{g: 'grid', l: 'Votre offre'},
			{g: 'people', l: 'Vos clients'},
		]),
		Territory('pins', [
			{g: 'house', l: 'Particuliers'},
			{g: 'shop', l: 'Commerçants'},
			{g: 'building', l: 'Entreprises'},
			{g: 'people', l: 'Associations'},
		]),
		Chain([
			{g: 'grid', l: 'Prestations'},
			{g: 'calendar', l: 'Étapes'},
			{g: 'flag', l: 'Lancement'},
		]),
	],
	// 02 — Préparer votre atelier
	[Floor(0), Floor(1), Floor(2)],
	// 03 — Prendre en main les machines
	[
		Tiles([
			{g: 'laser', l: 'Laser'},
			{g: 'printer', l: 'Imprimante UV'},
			{g: 'cutter', l: 'Découpe'},
			{g: 'press', l: 'Presse textile'},
		]),
		Chain([
			{g: 'printer', l: 'Impression'},
			{g: 'laser', l: 'Gravure'},
			{g: 'cutter', l: 'Découpe'},
			{g: 'palette', l: 'Personnalisation'},
		]),
		Settings,
		Practice,
	],
	// 04 — Passer de l'idée à la réalisation
	[
		Hero('file', 'Un fichier bien préparé', ['bulb', 'ruler', 'screen']),
		Artboard,
		Materials,
		Checks(['Essais', 'Contrôle du rendu', 'Finitions soignées']),
	],
	// 05 — Entretenir vos équipements
	[
		Hero('calendar', 'Chaque jour, chaque semaine', ['wrench', 'drop', 'check']),
		Tiles([
			{g: 'drop', l: 'Nettoyage'},
			{g: 'check', l: 'Contrôles réguliers'},
			{g: 'gauge', l: 'Consommables'},
		]),
		Chain([
			{g: 'warning', l: 'Anomalie'},
			{g: 'sliders', l: 'Vérifications'},
			{g: 'wrench', l: 'Correction'},
		]),
		Fork,
	],
	// 06 — Construire une offre commerciale
	[
		Chain([
			{g: 'laser', l: 'Possibilités techniques'},
			{g: 'grid', l: 'Prestations claires'},
			{g: 'people', l: 'Vos clients'},
		]),
		Range,
		Costs(false),
		Costs(true),
	],
	// 07 — Conseiller et vendre
	[
		Talk([
			{text: 'C’est pour quelle occasion ?'},
			{r: true, text: 'Un cadeau pour un départ.'},
			{text: 'Pour quand vous le faut-il ?'},
			{r: true, text: 'Vendredi prochain.'},
		]),
		Tiles([
			{g: 'swatch', l: 'Support'},
			{g: 'laser', l: 'Technique'},
			{g: 'star', l: 'Finition'},
			{g: 'calendar', l: 'Délai'},
		]),
		Chain([
			{g: 'doc', l: 'Devis clair'},
			{g: 'stamp', l: 'Visuel validé'},
			{g: 'laser', l: 'Production'},
			{g: 'truck', l: 'Livraison'},
		]),
		Hero('heart', 'Une relation durable', ['bubble', 'loop', 'star']),
	],
	// 08 — Faire connaître votre atelier
	[Hero('megaphone', 'Vos réalisations', ['camera', 'phone', 'star']), Feed, Territory('radar'), WindowOnline],
	// 09 — Développer votre clientèle
	[
		Network(<Eye size={140} ring={K.white} />, [
			{g: 'building', l: 'Entreprises'},
			{g: 'shop', l: 'Commerces'},
			{g: 'people', l: 'Associations'},
			{g: 'house', l: 'Collectivités'},
			{g: 'flag', l: 'Événements'},
		]),
		Chain([
			{g: 'screen', l: 'Présentation'},
			{g: 'mail', l: 'Prise de contact'},
			{g: 'doc', l: 'Devis'},
			{g: 'loop', l: 'Relance'},
		]),
		Network(<Glyph name="handshake" size={130} />, [
			{g: 'shop', l: 'Partenaires'},
			{g: 'calendar', l: 'Besoins récurrents'},
			{g: 'grid', l: 'Offres dédiées'},
		], K.white),
		Hero('loop', 'Donner envie de revenir', ['heart', 'mail', 'star']),
	],
	// 10 — Gérer votre entreprise
	[
		Tiles([
			{g: 'doc', l: 'Devis & factures'},
			{g: 'box', l: 'Achats & stocks'},
			{g: 'calendar', l: 'Planning'},
			{g: 'chart', l: 'Indicateurs'},
		]),
		Chain([
			{g: 'doc', l: 'Devis'},
			{g: 'box', l: 'Commande'},
			{g: 'file', l: 'Facture'},
			{g: 'coins', l: 'Règlement'},
		]),
		StockPlan,
		Kpis,
		Hero('target', 'Décider en connaissance de cause', ['chart', 'trend', 'bulb']),
	],
	// 11 — Partager une identité commune
	[
		BrandBoard,
		Tiles([
			{g: 'brand', l: 'Identité visuelle'},
			{g: 'shop', l: 'Présentation de l’atelier'},
			{g: 'megaphone', l: 'Communication'},
			{g: 'heart', l: 'Relation client'},
		]),
		Ateliers,
	],
	// 12 — Préparer l'ouverture
	[
		Hero('key', 'Vos acquis en pratique', ['check', 'star', 'laser']),
		Checks(['Échantillons réalisés', 'Offres préparées', 'Organisation vérifiée']),
		Chain([
			{g: 'bubble', l: 'Premier échange'},
			{g: 'doc', l: 'Devis'},
			{g: 'laser', l: 'Production'},
			{g: 'truck', l: 'Livraison'},
		]),
		Countdown,
	],
	// 13 — Continuer à progresser
	[
		Hero('headset', 'Toujours accompagné', ['network', 'bubble', 'trend']),
		Talk([
			{text: 'Une question technique ?'},
			{r: true, text: 'Un point commercial ?'},
			{text: 'Votre organisation ?'},
			{r: true, text: 'Parlons-en ensemble.'},
		]),
		Growth,
	],
];
