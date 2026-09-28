import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();

/** A label plate drawn on a canvas (brand plates on the cabinets). */
export const labelTexture = (key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
	if (cache.has(key)) return cache.get(key)!;
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;
	draw(ctx, w, h);
	const tex = new THREE.CanvasTexture(canvas);
	tex.colorSpace = THREE.SRGBColorSpace;
	tex.anisotropy = 8;
	cache.set(key, tex);
	return tex;
};

const FONT = "'SympsInter', 'Helvetica Neue', Arial, sans-serif";

/** Black plate: SYMP'S wordmark between a blue and a red line (as on the Opaline). */
export const sympsPlate = () =>
	labelTexture('symps-plate', 512, 360, (c, w, h) => {
		c.fillStyle = '#0B0B0D';
		c.fillRect(0, 0, w, h);
		c.fillStyle = '#3346C8';
		c.fillRect(40, 110, w - 80, 5);
		c.fillStyle = '#D0213A';
		c.fillRect(40, 250, w - 80, 5);
		c.fillStyle = '#F2F2F2';
		c.font = `500 58px ${FONT}`;
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.letterSpacing = '10px';
		c.fillText('SYMP’S', w / 2, 185);
	});

/** Model plate: name + "Assemblé en France" with the flag. */
export const modelPlate = (name: string) =>
	labelTexture(`model-${name}`, 512, 300, (c, w, h) => {
		c.fillStyle = '#0B0B0D';
		c.fillRect(0, 0, w, h);
		c.fillStyle = '#F2F2F2';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = `600 72px ${FONT}`;
		c.fillText(name, w / 2, 100);
		c.font = `400 34px ${FONT}`;
		c.fillText('Assemblé en France', w / 2, 190);
		const fw = 60;
		const fx = w / 2 - fw * 1.5;
		['#1F3FA8', '#F2F2F2', '#D0213A'].forEach((col, i) => {
			c.fillStyle = col;
			c.fillRect(fx + i * fw, 225, fw, 50);
		});
	});

/** Small blue LCD of the print unit. */
export const lcdTexture = () =>
	labelTexture('lcd', 256, 96, (c, w, h) => {
		c.fillStyle = '#1C4FD8';
		c.fillRect(0, 0, w, h);
		c.fillStyle = 'rgba(255,255,255,0.85)';
		c.font = `500 26px monospace`;
		c.fillText('T: 38.5C  UV ON', 14, 38);
		c.fillText('HEAD  OK  1600', 14, 76);
	});

/** Touch screen UI (monitor on the arm). */
export const screenTexture = () =>
	labelTexture('screen-ui', 640, 400, (c, w, h) => {
		const g = c.createLinearGradient(0, 0, w, h);
		g.addColorStop(0, '#0B1426');
		g.addColorStop(1, '#03060C');
		c.fillStyle = g;
		c.fillRect(0, 0, w, h);
		c.fillStyle = '#2F7BFF';
		c.fillRect(36, 36, 180, 10);
		c.fillStyle = 'rgba(255,255,255,0.25)';
		for (let i = 0; i < 4; i++) c.fillRect(36, 80 + i * 26, 240 - i * 30, 8);
		// preview of the mural being printed
		const p = c.createLinearGradient(330, 60, 600, 340);
		p.addColorStop(0, '#2F7BFF');
		p.addColorStop(0.5, '#E0233D');
		p.addColorStop(1, '#F5B83D');
		c.fillStyle = p;
		c.fillRect(330, 60, 270, 280);
		c.fillStyle = 'rgba(255,255,255,0.8)';
		c.fillRect(36, 320, 250, 36);
	});
