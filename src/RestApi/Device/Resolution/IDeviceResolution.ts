
export enum DeviceResolutionOrientation {
	Portrait = 'PORTRAIT',
	PortraitFlipped = 'PORTRAIT_FLIPPED',
	Landscape = 'LANDSCAPE',
	LandscapeFlipped = 'LANDSCAPE_FLIPPED',
	Auto = 'AUTO',
}

export enum DeviceResolutionResolution {
	FullHD = 'FULL_HD',
	HDReady = 'HD_READY',
}

export interface IDeviceResolutionUpdatable {
	orientation: DeviceResolutionOrientation;
	resolution: DeviceResolutionResolution;
}

export interface IDeviceResolution extends IDeviceResolutionUpdatable {
	uid: string;
	deviceUid: string;
	videoOrientation: string| null;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceResolution;
