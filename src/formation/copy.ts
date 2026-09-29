// Every word of the training film, as supplied. A module is a title and
// paragraphs ("beats"); each beat is a list of lines, kept as written.
// Beat timing is derived from word count, so text can change freely.

export type Beat = string[];
export type Module = {n: string; title: string; beats: Beat[]};

export const INTRO = {
	kicker: 'L’accompagnement',
	title: ['Votre atelier prend forme.', 'Votre nouveau métier aussi.'],
	skills: {
		lead: ['Créer son activité, c’est apprendre à produire,', 'à vendre, à communiquer et à gérer.'],
		words: ['Produire', 'Vendre', 'Communiquer', 'Gérer'],
	},
	program: ['Avec Vision Urbaine,', 'préparez chaque étape de votre projet.'],
	chrome: 'Formation & accompagnement',
};

export const MODULES: Module[] = [
	{
		n: '01',
		title: 'Construire votre projet',
		beats: [
			['Comprendre votre activité.', 'Définir votre offre.', 'Identifier vos futurs clients.'],
			['Particuliers, commerçants, entreprises, associations…', 'Apprenez à repérer les besoins de votre territoire.'],
			['Choisissez les prestations à proposer', 'et préparez les étapes de votre lancement.'],
		],
	},
	{
		n: '02',
		title: 'Préparer votre atelier',
		beats: [
			['Organisez un espace adapté à votre activité.'],
			['Accueil des clients, présentation des créations,', 'production et stockage :', 'chaque zone a son rôle.'],
			['Apprenez à organiser le parcours d’une commande,', 'de la demande du client au produit terminé.'],
		],
	},
	{
		n: '03',
		title: 'Prendre en main les machines',
		beats: [
			['Découvrez vos équipements', 'et apprenez à les utiliser.'],
			['Impression, gravure, découpe, personnalisation :', 'comprenez les possibilités de chaque procédé.'],
			['Installation, réglages, logiciels et sécurité :', 'prenez les bons réflexes dès le départ.'],
			['Exercez-vous sur des réalisations concrètes,', 'jusqu’à maîtriser les gestes essentiels.'],
		],
	},
	{
		n: '04',
		title: 'Passer de l’idée à la réalisation',
		beats: [
			['Une création réussie commence', 'par un fichier bien préparé.'],
			['Apprenez à adapter un visuel,', 'vérifier ses dimensions et préparer la production.'],
			['Choisissez les supports et les réglages', 'en fonction du résultat recherché.'],
			['Réalisez des essais.', 'Contrôlez le rendu.', 'Soignez les finitions.'],
		],
	},
	{
		n: '05',
		title: 'Entretenir vos équipements',
		beats: [
			['Intégrez l’entretien à votre quotidien.'],
			['Apprenez les opérations de nettoyage,', 'les contrôles réguliers et le suivi des consommables.'],
			['Identifiez les anomalies courantes', 'et les premières vérifications à effectuer.'],
			['Sachez quand intervenir', 'et quand solliciter l’assistance technique.'],
		],
	},
	{
		n: '06',
		title: 'Construire une offre commerciale',
		beats: [
			['Transformez vos possibilités techniques', 'en prestations claires pour vos clients.'],
			['Structurez votre gamme.', 'Présentez vos options de personnalisation.', 'Créez des exemples qui donnent envie.'],
			['Apprenez à calculer vos coûts :', 'supports, consommables, temps de travail et charges.'],
			['Fixez vos prix', 'en tenant compte de vos marges.'],
		],
	},
	{
		n: '07',
		title: 'Conseiller et vendre',
		beats: [
			['Apprenez à poser les bonnes questions', 'pour comprendre chaque demande.'],
			['Conseillez un support, une technique,', 'une finition et un délai adaptés.'],
			['Préparez un devis clair.', 'Faites valider le visuel avant la production.', 'Suivez la commande jusqu’à sa livraison.'],
			['Gérez les demandes après la vente', 'et construisez une relation durable avec vos clients.'],
		],
	},
	{
		n: '08',
		title: 'Faire connaître votre atelier',
		beats: [
			['Apprenez à communiquer', 'sur votre activité et vos réalisations.'],
			['Photographiez vos créations.', 'Préparez vos publications.', 'Animez vos réseaux sociaux.'],
			['Développez votre visibilité locale', 'et préparez les actions de votre lancement.'],
			['Mettez en valeur votre savoir-faire', 'dans votre vitrine comme en ligne.'],
		],
	},
	{
		n: '09',
		title: 'Développer votre clientèle',
		beats: [
			['Identifiez les professionnels', 'qui peuvent avoir besoin de vos services.'],
			['Apprenez à présenter votre atelier,', 'préparer une prise de contact et relancer un devis.'],
			['Développez des partenariats de proximité', 'et des offres adaptées aux besoins récurrents.'],
			['Entretenez le lien avec vos clients', 'pour leur donner envie de revenir.'],
		],
	},
	{
		n: '10',
		title: 'Gérer votre entreprise',
		beats: [
			['Prenez en main les outils', 'qui structurent votre quotidien.'],
			['Devis, commandes, factures et règlements :', 'suivez votre activité à chaque étape.'],
			['Organisez vos achats et vos stocks.', 'Anticipez vos besoins en consommables.', 'Planifiez votre production.'],
			['Comprenez vos indicateurs essentiels :', 'chiffre d’affaires, charges, marges et trésorerie.'],
			['Apprenez à vous en servir', 'pour prendre vos décisions.'],
		],
	},
	{
		n: '11',
		title: 'Partager une identité commune',
		beats: [
			['Appropriez-vous l’univers Vision Urbaine.'],
			['Identité visuelle, présentation de l’atelier,', 'communication et relation client :', 'apprenez à faire vivre la marque.'],
			['Adoptez les méthodes et les standards du réseau', 'dans votre activité quotidienne.'],
		],
	},
	{
		n: '12',
		title: 'Préparer l’ouverture',
		beats: [
			['Mettez vos acquis en pratique', 'avant d’accueillir vos premiers clients.'],
			['Réalisez vos échantillons.', 'Préparez vos offres.', 'Vérifiez votre organisation.'],
			['Exercez-vous à traiter une commande complète,', 'du premier échange à la livraison.'],
			['Préparez votre lancement', 'avec des étapes et des priorités claires.'],
		],
	},
	{
		n: '13',
		title: 'Continuer à progresser',
		beats: [
			['L’accompagnement se poursuit', 'dans la vie de votre atelier.'],
			['Échangez sur vos difficultés techniques,', 'vos questions commerciales et votre organisation.'],
			['Faites le point sur vos premiers résultats.', 'Identifiez les ajustements utiles.', 'Développez progressivement votre offre.'],
		],
	},
];

export const OUTRO = {
	pillars: ['Maîtriser les machines.', 'Valoriser votre savoir-faire.', 'Piloter votre activité.'],
	brand: 'Vision Urbaine',
	lines: ['Votre projet.', 'Un savoir-faire à acquérir.', 'Un réseau pour vous accompagner.'],
};
