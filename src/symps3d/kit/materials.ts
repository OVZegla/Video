import * as THREE from 'three';

// Materials are cached: every machine in every shot shares the same instances.
const cache = new Map<string, THREE.Material>();
const get = <T extends THREE.Material>(key: string, make: () => T): T => {
	if (!cache.has(key)) cache.set(key, make());
	return cache.get(key) as T;
};

/** Painted steel (cabinets, chassis): glossy lacquer over colour. */
export const paint = (color: string, rough = 0.32) =>
	get(`paint-${color}-${rough}`, () => new THREE.MeshPhysicalMaterial({color, metalness: 0.25, roughness: rough, clearcoat: 0.8, clearcoatRoughness: 0.18}));

/** Brushed stainless steel. */
export const steel = () => get('steel', () => new THREE.MeshStandardMaterial({color: '#D9DDE2', metalness: 0.75, roughness: 0.26}));

/** Polished alloy (wheel rims, pulleys). */
export const alloy = () => get('alloy', () => new THREE.MeshStandardMaterial({color: '#EEF0F2', metalness: 0.7, roughness: 0.2}));

/** Anodised aluminium profile. */
export const anodised = (color: 'black' | 'silver') =>
	get(`anod-${color}`, () =>
		color === 'black'
			? new THREE.MeshStandardMaterial({color: '#141416', metalness: 0.7, roughness: 0.38})
			: new THREE.MeshStandardMaterial({color: '#D2D6DB', metalness: 0.75, roughness: 0.28}),
	);

export const rubber = () => get('rubber', () => new THREE.MeshStandardMaterial({color: '#0B0B0C', metalness: 0, roughness: 0.85}));
export const plasticBlack = () => get('pblack', () => new THREE.MeshStandardMaterial({color: '#18191C', metalness: 0.1, roughness: 0.45}));
export const plasticWhite = () => get('pwhite', () => new THREE.MeshPhysicalMaterial({color: '#EDEDEA', metalness: 0, roughness: 0.35, clearcoat: 0.4}));
export const glassScreen = () =>
	get('screen', () => new THREE.MeshPhysicalMaterial({color: '#05070B', metalness: 0.2, roughness: 0.05, clearcoat: 1, emissive: '#0A1830', emissiveIntensity: 0.6}));

export const emissive = (color: string, intensity = 2) =>
	get(`emi-${color}-${intensity}`, () => new THREE.MeshStandardMaterial({color, emissive: color, emissiveIntensity: intensity, roughness: 0.4}));

export const flat = (color: string, rough = 0.5, metal = 0) =>
	get(`flat-${color}-${rough}-${metal}`, () => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: metal}));

/** Ink cap colours, as on the machines: white, black, yellow, cyan, magenta. */
export const INK_CAPS = ['#F2F2F0', '#1A1A1C', '#F2C400', '#0096D6', '#D6006E'];
