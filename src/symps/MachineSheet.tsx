import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PRODUCTS} from './data/products';
import {Machine} from './components/Machine';

/** Contact sheet of every machine, used for checking the renders. */
export const MachineSheet: React.FC = () => (
	<AbsoluteFill style={{background: '#3a3c40', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 0, paddingBottom: 40}}>
		{PRODUCTS.map((p) => (
			<Machine key={p.id} product={p} height={560} head={0.4} uv={1} />
		))}
	</AbsoluteFill>
);
