import {C} from '../theme';

/** The "o" eye from the logo, painted on a 2D canvas. */
export const drawEye = (
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	col: {ring: string; pupil: string; sector: string},
) => {
	const ringW = r * 0.42;
	ctx.save();
	ctx.lineWidth = ringW;
	ctx.strokeStyle = col.ring;
	ctx.beginPath();
	ctx.arc(cx, cy, r - ringW / 2, 0, Math.PI * 2);
	ctx.stroke();
	// red sector on the ring (upper right)
	ctx.strokeStyle = col.sector;
	ctx.beginPath();
	ctx.arc(cx, cy, r - ringW / 2, -Math.PI * 0.36, -Math.PI * 0.08);
	ctx.stroke();
	// slit
	ctx.globalCompositeOperation = 'destination-out';
	ctx.lineWidth = r * 0.08;
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(cx + Math.cos(-Math.PI * 0.36) * r * 1.1, cy + Math.sin(-Math.PI * 0.36) * r * 1.1);
	ctx.stroke();
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = col.pupil;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.36, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
};

/** Draw the logo image as a single-colour silhouette (for engravings, etchings). */
export const drawLogoMono = (
	ctx: CanvasRenderingContext2D,
	logo: HTMLImageElement,
	x: number,
	y: number,
	w: number,
	color: string,
) => {
	const h = w / (logo.width / logo.height);
	const tmp = document.createElement('canvas');
	tmp.width = Math.ceil(w);
	tmp.height = Math.ceil(h);
	const t = tmp.getContext('2d')!;
	t.drawImage(logo, 0, 0, w, h);
	t.globalCompositeOperation = 'source-in';
	t.fillStyle = color;
	t.fillRect(0, 0, w, h);
	ctx.drawImage(tmp, x, y);
	return h;
};

export const drawLogo = (
	ctx: CanvasRenderingContext2D,
	logo: HTMLImageElement,
	cx: number,
	y: number,
	w: number,
) => {
	const h = w / (logo.width / logo.height);
	ctx.drawImage(logo, cx - w / 2, y, w, h);
	return h;
};

export const brand = {
	navy: C.brandNavy,
	red: C.brandRed,
	blue: '#0049FB',
};
