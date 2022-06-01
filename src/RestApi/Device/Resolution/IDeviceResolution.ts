export type TResolutionItem = {
	width: number;
	height: number;
	framerate?: number;
};

export enum DeviceOrientation {
	Portrait = 'PORTRAIT',
	PortraitFlipped = 'PORTRAIT_FLIPPED',
	Landscape = 'LANDSCAPE',
	LandscapeFlipped = 'LANDSCAPE_FLIPPED',
	Auto = 'AUTO',
}

export enum DeviceVideoOrientation {
	Landscape = 'LANDSCAPE',
	LandscapeFlipped = 'LANDSCAPE_FLIPPED',
}

export enum DeviceResolutionResolution {
	FullHD = 'FULL_HD',
	HDReady = 'HD_READY',
}

export interface IDeviceResolutionUpdatable {
	orientation: DeviceOrientation;
	resolution: DeviceResolutionResolution;
}

export interface IDeviceResolution extends IDeviceResolutionUpdatable {
	uid: string;
	deviceUid: string;
	videoOrientation: string | null;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceResolution;
