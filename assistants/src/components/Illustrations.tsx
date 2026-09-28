import React from 'react';

/** Flat product shot of a blue T-shirt on a soft backdrop. */
export const TShirt: React.FC<{size: number; bg?: string; radius?: number}> = ({size, bg = '#EEF1FA', radius = 18}) => (
	<div style={{width: size, height: size, borderRadius: radius, background: bg, overflow: 'hidden', flexShrink: 0}}>
		<svg width={size} height={size} viewBox="0 0 200 200" style={{display: 'block'}}>
			<defs>
				<linearGradient id="ts-body" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#3D66F5" />
					<stop offset="1" stopColor="#2447C9" />
				</linearGradient>
			</defs>
			<ellipse cx="100" cy="170" rx="58" ry="7" fill="rgba(20,30,70,0.10)" />
			<path
				d="M72 38 58 44 30 62l14 30 16-7v77a4 4 0 0 0 4 4h72a4 4 0 0 0 4-4V85l16 7 14-30-28-18-14-6c-3 10-14 17-28 17s-25-7-28-17Z"
				fill="url(#ts-body)"
			/>
			<path d="M72 38c3 10 14 17 28 17s25-7 28-17" fill="none" stroke="#1B37A3" strokeWidth="3" />
			<path d="M60 85V70M140 85V70" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeLinecap="round" />
			<path d="M84 60c6 3 26 3 32 0" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" />
			<rect x="118" y="146" width="18" height="12" rx="2" fill="rgba(255,255,255,0.9)" />
			<text x="127" y="155.5" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="9" fill="#2447C9">
				M
			</text>
		</svg>
	</div>
);

/**
 * "Photo" of the finished job: a new wooden terrace in late light.
 * Drawn as a vector so it stays sharp at any scale.
 */
export const TerracePhoto: React.FC<{w: number; h: number; radius?: number; id?: string}> = ({
	w,
	h,
	radius = 14,
	id = 'tp',
}) => {
	const planks = new Array(15).fill(0);
	return (
		<div style={{width: w, height: h, borderRadius: radius, overflow: 'hidden', flexShrink: 0}}>
			<svg width={w} height={h} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{display: 'block'}}>
				<defs>
					<linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#C9D6E6" />
						<stop offset="1" stopColor="#EDE3D3" />
					</linearGradient>
					<linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#EFE9DF" />
						<stop offset="1" stopColor="#DCD3C4" />
					</linearGradient>
					<linearGradient id={`${id}-deck`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#B98556" />
						<stop offset="1" stopColor="#8E5E36" />
					</linearGradient>
					<linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="#3B4757" />
						<stop offset="0.55" stopColor="#27303C" />
						<stop offset="1" stopColor="#4A5667" />
					</linearGradient>
					<linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="0.3">
						<stop offset="0" stopColor="rgba(255,236,200,0)" />
						<stop offset="0.6" stopColor="rgba(255,236,200,0.28)" />
						<stop offset="1" stopColor="rgba(255,236,200,0)" />
					</linearGradient>
				</defs>
				<rect width="400" height="300" fill={`url(#${id}-sky)`} />
				{/* distant hedge */}
				<path d="M250 150c10-14 26-16 36-8 10-12 30-12 40 0 12-10 34-8 42 6 12-4 26 0 32 10v14H250Z" fill="#7E9670" />
				<path d="M250 160h150v12H250Z" fill="#6B8360" />
				{/* house wall + glass door */}
				<path d="M0 30h238v148H0Z" fill={`url(#${id}-wall)`} />
				<path d="M238 30h10v148h-10Z" fill="#CFC5B5" />
				<rect x="40" y="62" width="150" height="116" fill="#9A8F80" />
				<rect x="45" y="66" width="68" height="112" fill={`url(#${id}-glass)`} />
				<rect x="117" y="66" width="68" height="112" fill={`url(#${id}-glass)`} />
				<path d="M60 70 95 176M132 70l32 104" stroke="rgba(255,255,255,0.10)" strokeWidth="10" />
				{/* deck */}
				<path d="M0 178h400v122H0Z" fill={`url(#${id}-deck)`} />
				{planks.map((_, i) => {
					const x0 = -40 + i * 34;
					const x1 = -520 + i * 102;
					return <path key={i} d={`M${x0} 178 L${x1} 300`} stroke="rgba(60,34,14,0.35)" strokeWidth="1.2" />;
				})}
				<path d="M0 178h400" stroke="#6E4726" strokeWidth="3" />
				<path d="M0 210h400M0 250h400" stroke="rgba(255,230,190,0.08)" strokeWidth="14" />
				{/* planter + olive tree */}
				<ellipse cx="318" cy="268" rx="46" ry="8" fill="rgba(40,24,10,0.3)" />
				<path d="M284 206h68l-6 60h-56Z" fill="#3A3D42" />
				<path d="M284 206h68v6h-68Z" fill="#4C5057" />
				<path d="M318 206c0-22 2-40-4-58" stroke="#5B4632" strokeWidth="4" fill="none" />
				<circle cx="300" cy="136" r="24" fill="#7C8F63" />
				<circle cx="330" cy="120" r="28" fill="#8FA274" />
				<circle cx="344" cy="148" r="20" fill="#768A5D" />
				<circle cx="312" cy="112" r="18" fill="#9AAE80" />
				{/* chair */}
				<path d="M214 214h40l-4 44h-32Z" fill="#E7E1D6" />
				<path d="M210 196h48v20h-48Z" fill="#F2EEE7" />
				<path d="M216 258v18M250 258v18" stroke="#CFC7B9" strokeWidth="3" />
				{/* low evening light */}
				<rect width="400" height="300" fill={`url(#${id}-light)`} />
			</svg>
		</div>
	);
};
