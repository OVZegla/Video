import {Composition} from 'remotion';
import './fonts';
import {VisionUrbaine} from './VisionUrbaine';
import {Lab} from './Lab';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
	return (
		<>
		<Composition id="Lab" component={Lab} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Composition
			id="VisionUrbaine"
			component={VisionUrbaine}
			durationInFrames={DURATION}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
		</>
	);
};
