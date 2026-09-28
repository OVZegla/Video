import {Composition} from 'remotion';
import './fonts';
import {VisionUrbaine} from './VisionUrbaine';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';
import {Franchise, FRANCHISE_DURATION} from './franchise/Franchise';
import {FFPS, FH, FW} from './franchise/theme';

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
				id="Franchise"
				component={Franchise}
				durationInFrames={FRANCHISE_DURATION}
				fps={FFPS}
				width={FW}
				height={FH}
			/>
		</>
	);
};
