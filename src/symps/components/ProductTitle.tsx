import React from 'react';
import type {Product} from '../data/products';
import {C} from '../theme';
import {RevealLine, Rule, fontBase} from './Typography';

/**
 * Product name block: accent rule, optional model reference, the name, and
 * a single short line. Deliberately sparse, no specifications.
 */
export const ProductTitle: React.FC<{
	product: Product;
	at: number;
	out?: number;
	left: number;
	top: number;
	size?: number;
}> = ({product, at, out, left, top, size = 120}) => {
	const {env} = product;
	const accent = product.env.mood === 'ruby' ? C.red : C.blue;
	return (
		<div style={{position: 'absolute', left, top, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
			<div style={{height: 2, marginBottom: 30}}>
				<Rule at={at} color={accent} out={out} />
			</div>
			{product.model && (
				<RevealLine at={at + 4} out={out} style={{marginBottom: 14}}>
					<div
						style={{
							...fontBase,
							fontSize: 22,
							fontWeight: 500,
							letterSpacing: '0.34em',
							color: env.subText,
						}}
					>
						{product.model}
					</div>
				</RevealLine>
			)}
			<RevealLine at={at + 6} out={out} dur={40}>
				<div
					style={{
						...fontBase,
						fontSize: size,
						fontWeight: 600,
						letterSpacing: '-0.035em',
						lineHeight: 1,
						color: env.text,
						whiteSpace: 'nowrap',
					}}
				>
					{product.name}
				</div>
			</RevealLine>
			{product.suffix && (
				<RevealLine at={at + 12} out={out} dur={40}>
					<div
						style={{
							...fontBase,
							fontSize: size,
							fontWeight: 200,
							letterSpacing: '-0.03em',
							lineHeight: 1,
							color: env.text,
							whiteSpace: 'nowrap',
						}}
					>
						{product.suffix}
					</div>
				</RevealLine>
			)}
			<RevealLine at={at + 22} out={out} style={{marginTop: 30}} rise={0.4}>
				<div style={{...fontBase, fontSize: 34, fontWeight: 300, letterSpacing: '-0.01em', color: env.subText, whiteSpace: 'nowrap'}}>
					{product.tagline}
				</div>
			</RevealLine>
		</div>
	);
};
