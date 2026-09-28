// Design tokens — one place for colours, type and depth.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const C = {
	paper: '#F3F1EC', // blanc cassé
	paperHi: '#FAF9F6',
	paperLo: '#E9E6DF',
	card: '#FFFFFF',
	ink: '#15171C', // noir graphite
	ink2: '#4A4E57',
	ink3: '#8A8E97',
	line: 'rgba(21,23,28,0.09)',
	night: '#101216',
	nightHi: '#171A20',
	nightCard: '#1C1F26',
	nightLine: 'rgba(255,255,255,0.08)',
	snow: '#F5F4F0',
	snow2: 'rgba(245,244,240,0.66)',
	snow3: 'rgba(245,244,240,0.42)',
	blue: '#2E5BFF', // bleu électrique — accent principal
	blueHi: '#5B7FFF',
	blueSoft: 'rgba(46,91,255,0.10)',
	amber: '#C98A1B', // "à vérifier"
	amberSoft: 'rgba(201,138,27,0.12)',
} as const;

export const FONT_DISPLAY = '"Inter Tight", "Inter", system-ui, sans-serif';
export const FONT_UI = '"Inter", system-ui, sans-serif';

export type RoleId = 'secretaire' | 'commercial' | 'stock' | 'web' | 'com' | 'pilotage';

export type Role = {
	id: RoleId;
	label: string;
	color: string;
	icon: IconName;
};

export type IconName =
	| 'inbox'
	| 'handshake'
	| 'box'
	| 'browser'
	| 'megaphone'
	| 'compass'
	| 'folder'
	| 'mic'
	| 'camera'
	| 'check'
	| 'clock'
	| 'pencil'
	| 'bell'
	| 'message'
	| 'doc'
	| 'calendar'
	| 'pin'
	| 'sun'
	| 'cloud'
	| 'chevron'
	| 'arrow'
	| 'image'
	| 'plus'
	| 'send'
	| 'eye';

// Discreet secondary accents, one per assistant. Blue stays reserved for
// the shared folder, the user's own actions and validation.
export const ROLES: Record<RoleId, Role> = {
	secretaire: {id: 'secretaire', label: 'Secrétaire', color: '#139A8A', icon: 'inbox'},
	commercial: {id: 'commercial', label: 'Commercial', color: '#DB7433', icon: 'handshake'},
	stock: {id: 'stock', label: 'Stock et achats', color: '#4F9A3E', icon: 'box'},
	web: {id: 'web', label: 'Webmaster', color: '#6F63E6', icon: 'browser'},
	com: {id: 'com', label: 'Communication', color: '#D9486F', icon: 'megaphone'},
	pilotage: {id: 'pilotage', label: 'Pilotage', color: '#C7951A', icon: 'compass'},
};

export const ROLE_ORDER: RoleId[] = ['secretaire', 'commercial', 'stock', 'web', 'com', 'pilotage'];

export const SHADOW = {
	card: '0 1px 1px rgba(21,23,28,0.04), 0 6px 16px -6px rgba(21,23,28,0.10), 0 22px 48px -22px rgba(21,23,28,0.22)',
	lift: '0 2px 2px rgba(21,23,28,0.04), 0 14px 30px -10px rgba(21,23,28,0.16), 0 40px 80px -30px rgba(21,23,28,0.30)',
	night: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 50px -20px rgba(0,0,0,0.6)',
};
