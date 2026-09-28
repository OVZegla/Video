import {Composition} from 'remotion';
import './fonts';
import {Film} from './Film';
import {FPS, HEIGHT, WIDTH} from './theme';
import {TOTAL} from './timeline';

export const RemotionRoot: React.FC = () => (
	<Composition id="Publicite" component={Film} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
);
