// Every word shown in the franchise film lives here, so the text can be
// reviewed and changed without touching the animation code.

export const COPY = {
	intro: {
		kicker: 'Concept de franchise',
		tagline: 'Le temple de la personnalisation',
	},
	chapters: [
		'Le concept',
		'Tout personnaliser',
		'Attirer',
		'Le magasin',
		'Le parcours client',
		"L'atelier",
		'Sur mesure',
		'La franchise',
	],
	concept: {
		title: ['Un lieu où l’on crée', 'ce que l’on imagine.'],
		body: 'Des objets à personnaliser sur place, un atelier qui fabrique sous les yeux des clients, et des projets sur mesure — jusqu’à la décoration d’un intérieur complet.',
		verbs: ['Créer', 'Personnaliser', 'Fabriquer', 'Décorer', 'Offrir'],
	},
	pillars: {
		title: 'Trois espaces, une seule promesse.',
		items: [
			{n: '01', t: 'La boutique', d: 'Des articles prêts à personnaliser : mugs, gourdes, textiles, coques, cadres…'},
			{n: '02', t: 'L’atelier', d: 'Gravure, découpe et impression en direct, derrière une paroi vitrée.'},
			{n: '03', t: 'Le sur-mesure', d: 'Grandes pièces, signalétique, décoration : on commande et on fabrique.'},
		],
	},
	possible: {
		small: 'Du plus petit…',
		big: '…au plus grand.',
		foot: 'Si on peut l’imaginer, on peut le fabriquer.',
		items: [
			'Coque de téléphone',
			'Porte-clés',
			'Mug',
			'Gourde',
			'Carnet',
			'Casquette',
			'T-shirt',
			'Tote bag',
			'Cadre photo',
			'Plaque plexiglas',
			'Sculpture bois',
			'Enseigne',
			'Décor mural',
			'Intérieur complet',
		],
		ruler: ['5 cm', '50 cm', '5 m'],
	},
	led: {
		kicker: 'Des vitrines qui attirent',
		title: ['Des vitrines LED', 'dynamiques.'],
		body: 'Transparentes et animées, elles font vivre la façade toute la journée : créations du moment, offres, savoir-faire de l’atelier. Une technologie que Vision Urbaine commercialise aussi.',
		steps: ['Voir', 'S’arrêter', 'Entrer'],
		screen: ['PERSON', 'NALISEZ', 'TOUT'],
		photo: 'Votre façade, vue depuis la galerie',
	},
	store: {
		title: 'Un magasin pensé comme un parcours.',
		iso: 'Vue d’ensemble du concept',
		zones: [
			{t: 'Vitrines LED', d: 'La façade qui capte le regard'},
			{t: 'Borne d’accueil', d: 'Hôte virtuel et inspirations'},
			{t: 'Îlot central', d: 'Les articles prêts à personnaliser'},
			{t: 'Murs thématiques', d: 'Cadeaux · Signalétique · Accessoires'},
			{t: 'Comptoir création', d: 'Conseil, maquette et commande'},
			{t: 'Atelier vitré', d: 'Les machines, visibles de tous'},
		],
	},
	journey: {
		title: 'Le parcours client',
		steps: [
			{t: 'Attiré', d: 'La vitrine LED l’arrête dans la galerie.'},
			{t: 'Inspiré', d: 'Il découvre les objets et choisit sa base.'},
			{t: 'Accompagné', d: 'Prénom, photo, logo : on crée la maquette ensemble.'},
			{t: 'Émerveillé', d: 'Il regarde son objet naître à l’atelier.'},
			{t: 'Conquis', d: 'Il repart avec une pièce unique — et revient.'},
		],
	},
	workshop: {
		title: ['L’atelier,', 'le spectacle du fait main.'],
		brand: 'Toute la gamme xTool en magasin',
		techniques: [
			'Gravure & découpe laser',
			'Impression UV couleur',
			'Marquage textile',
			'Finitions & assemblage',
		],
		materials: 'Bois · Métal · Cuir · Plexiglas · Verre · Ardoise · Textile',
		live: 'EN DIRECT',
	},
	custom: {
		title: ['Et pour les', 'grands projets.'],
		body: 'Signalétique complète, décoration d’intérieur, objets de marque : l’atelier fabrique aussi pour les commandes d’envergure.',
		clients: ['Particuliers', 'Entreprises', 'Commerçants', 'Collectivités', 'Événements'],
		callouts: ['Bois gravé', 'Tasseaux', 'Métal brossé', 'Carte découpée', 'Effet marbre', 'Plexiglas'],
	},
	franchise: {
		title: ['Rejoindre', 'Vision Urbaine.'],
		body: 'Un concept complet pour ouvrir votre temple de la personnalisation.',
		items: [
			{t: 'Une marque', d: 'Identité, univers et agencement'},
			{t: 'Des vitrines LED', d: 'La façade qui fait venir le client'},
			{t: 'Un parc machines', d: 'L’atelier équipé de la gamme xTool'},
			{t: 'Un catalogue', d: 'Des articles prêts à personnaliser'},
			{t: 'Un savoir-faire', d: 'Formation à la création et aux machines'},
			{t: 'Un réseau', d: 'Commandes sur mesure et entraide'},
		],
	},
	outro: {
		line: ['Créer aujourd’hui', 'un demain plus beau.'],
		cta: 'Devenez franchisé',
	},
} as const;
