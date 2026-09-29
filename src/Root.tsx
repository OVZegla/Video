import {Composition} from 'remotion';
import './fonts';
import {VisionUrbaine} from './VisionUrbaine';
import {PUB_DURATION, VisionUrbainePub} from './pub/PubVideo';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
	return (
		<>
		<Composition
			id="VisionUrbaine"
			component={VisionUrbaine}
			durationInFrames={DURATION}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
		<Composition
			id="VisionUrbainePub"
			component={VisionUrbainePub}
			durationInFrames={PUB_DURATION}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
		</>
	);
};
