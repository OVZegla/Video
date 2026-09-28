import React from 'react';
import type {IconName} from '../theme';

// One coherent pictogram family: 24-unit grid, 1.75 stroke, round joins.
const P: Record<IconName, React.ReactNode> = {
	inbox: (
		<>
			<path d="M4 13.5 6.2 6.6A2 2 0 0 1 8.1 5.2h7.8a2 2 0 0 1 1.9 1.4L20 13.5" />
			<path d="M4 13.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.5h-4.2l-1.3 2h-5l-1.3-2Z" />
		</>
	),
	handshake: (
		<>
			<path d="M3.5 9.5 7 6.5l3 1.2 2-1.2 3 .2 5.5 3.3" />
			<path d="M20.5 10 17 14l-3.2 3.1a1.4 1.4 0 0 1-2-.1l-4.4-4.6L3.5 10" />
			<path d="m12 8.5-2.6 2.6a1.3 1.3 0 0 0 1.8 1.8L13.5 11l3.5 3" />
		</>
	),
	box: (
		<>
			<path d="M12 3.6 19.6 7.8v8.4L12 20.4 4.4 16.2V7.8Z" />
			<path d="M4.6 7.9 12 12l7.4-4.1M12 12v8.2" />
			<path d="m8.2 5.8 7.6 4.3" />
		</>
	),
	browser: (
		<>
			<rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
			<path d="M3.5 9h17" />
			<path d="M6.6 6.8h.01M9 6.8h.01" strokeWidth={2.4} />
			<path d="M7.5 13h5M7.5 16h9" />
		</>
	),
	megaphone: (
		<>
			<path d="M4 10.2v3.6a1 1 0 0 0 1 1h2.6L15 18.6V5.4L7.6 9.2H5a1 1 0 0 0-1 1Z" />
			<path d="M8 14.8 9.2 19h2.3l-1-3.6" />
			<path d="M18.2 9.3a3.6 3.6 0 0 1 0 5.4" />
		</>
	),
	compass: (
		<>
			<circle cx="12" cy="12" r="8.4" />
			<path d="m15.3 8.7-1.9 4.7-4.7 1.9 1.9-4.7Z" />
		</>
	),
	receipt: (
		<>
			<path d="M6.5 3.5h11v17l-2.2-1.4-2.2 1.4-2.1-1.4-2.2 1.4-2.3-1.4Z" />
			<path d="M9.2 8h5.6M9.2 11.5h5.6M9.2 15h3.2" />
		</>
	),
	folder: (
		<>
			<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.6l2 2.2h7.4a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />
		</>
	),
	mic: (
		<>
			<rect x="9" y="3.5" width="6" height="11" rx="3" />
			<path d="M5.8 11.5a6.2 6.2 0 0 0 12.4 0M12 17.7v2.8" />
		</>
	),
	camera: (
		<>
			<path d="M4 8.5a2 2 0 0 1 2-2h2l1.4-2h5.2l1.4 2h2a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
			<circle cx="12" cy="12.6" r="3.4" />
		</>
	),
	check: <path d="m5.5 12.5 4.2 4.2 8.8-9.4" />,
	clock: (
		<>
			<circle cx="12" cy="12" r="8.4" />
			<path d="M12 7.5V12l3 2" />
		</>
	),
	pencil: (
		<>
			<path d="m14.8 5.6 3.6 3.6L8.6 19H5v-3.6Z" />
			<path d="m12.8 7.6 3.6 3.6" />
		</>
	),
	bell: (
		<>
			<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5Z" />
			<path d="M10 20.2a2.2 2.2 0 0 0 4 0" />
		</>
	),
	message: (
		<>
			<path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3.3v-3.3h.5a2 2 0 0 1-2-2Z" />
		</>
	),
	doc: (
		<>
			<path d="M6.5 3.5h7l4 4v12a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
			<path d="M13.5 3.7V7.5h3.8M8.8 12h6.4M8.8 15.5h4.4" />
		</>
	),
	calendar: (
		<>
			<rect x="4" y="5.5" width="16" height="14.5" rx="2.2" />
			<path d="M4 10h16M8.5 3.5v3.6M15.5 3.5v3.6" />
		</>
	),
	pin: (
		<>
			<path d="M12 20.5s6-5.4 6-10.2a6 6 0 0 0-12 0c0 4.8 6 10.2 6 10.2Z" />
			<circle cx="12" cy="10.3" r="2.2" />
		</>
	),
	sun: (
		<>
			<circle cx="12" cy="12" r="3.8" />
			<path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" />
		</>
	),
	cloud: (
		<>
			<path d="M7.5 17.5a4 4 0 0 1-.3-8 5.2 5.2 0 0 1 10 1.3 3.4 3.4 0 0 1-.4 6.7Z" />
			<path d="m9 20 .6-1.2M12.5 20l.6-1.2" />
		</>
	),
	chevron: <path d="m9.5 6 6 6-6 6" />,
	arrow: <path d="M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5" />,
	image: (
		<>
			<rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
			<circle cx="9" cy="9.6" r="1.6" />
			<path d="m4 17.5 5-4.6 3.4 3 3-2.6 4.6 4.1" />
		</>
	),
	plus: <path d="M12 5.5v13M5.5 12h13" />,
	send: <path d="M4.5 11.6 19.5 5l-6.3 15-2.4-6.6Z" />,
	eye: (
		<>
			<path d="M2.8 12S6 5.8 12 5.8 21.2 12 21.2 12 18 18.2 12 18.2 2.8 12 2.8 12Z" />
			<circle cx="12" cy="12" r="2.8" />
		</>
	),
};

export const Icon: React.FC<{
	name: IconName;
	size?: number;
	color?: string;
	stroke?: number;
	style?: React.CSSProperties;
}> = ({name, size = 24, color = 'currentColor', stroke = 1.75, style}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={stroke}
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{display: 'block', flexShrink: 0, ...style}}
	>
		{P[name]}
	</svg>
);
