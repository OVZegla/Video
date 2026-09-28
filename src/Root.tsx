import {Composition} from 'remotion';
import {VisionUrbaine} from './VisionUrbaine';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';
import {SympsWallPrinters, SYMPS_DURATION} from './symps/SympsWallPrinters';
import {MachineSheet} from './symps/MachineSheet';
import {Test3D} from './symps3d/Test3D';
import {SympsFilm3D, SYMPS3D_DURATION} from './symps3d/SympsFilm3D';
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
			<Composition id="Symps3D" component={SympsFilm3D} durationInFrames={SYMPS3D_DURATION} fps={30} width={1920} height={1080} />
			<Composition id="Test3D" component={Test3D} durationInFrames={30} fps={30} width={1920} height={1080} />
		</>
	);
};
