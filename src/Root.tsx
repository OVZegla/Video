import {Composition} from 'remotion';
import {VisionUrbaine} from './VisionUrbaine';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';
import {SympsWallPrinters, SYMPS_DURATION} from './symps/SympsWallPrinters';
import {MachineSheet} from './symps/MachineSheet';
import * as S from './symps/theme';

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
				id="SympsWallPrinters"
				component={SympsWallPrinters}
				durationInFrames={SYMPS_DURATION}
				fps={S.FPS}
				width={S.WIDTH}
				height={S.HEIGHT}
			/>
			<Composition id="SympsMachineSheet" component={MachineSheet} durationInFrames={1} fps={S.FPS} width={S.WIDTH} height={S.HEIGHT} />
		</>
	);
};
