import {Composition} from 'remotion';
import './fonts';
import {VisionUrbaine} from './VisionUrbaine';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="VisionUrbaine"
			component={VisionUrbaine}
			durationInFrames={DURATION}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
	);
};
