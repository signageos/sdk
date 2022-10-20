export interface IDeviceUpdatable {
	name?: string;
	organizationUid?: string;
}

export declare type ResolutionItem = {
	width: number;
	height: number;
	framerate?: number;
};

export default interface IDevice {
	uid: string;
	duid: string;
	name: string;
	createdAt: Date;
	aliveAt: Date;
	pinCode: string;
	applicationType: string;
	applicationVersion: string;
	frontDisplayVersion: string;
	firmwareVersion: string;
	model: string;
	serialNumber: string;
	brand: string | null;
	osVersion: string | null;
	organizationUid: string;
	timezone: string | null;
	networkInterfaces: {
		[optionName: string]: any;
	};
	storageStatus: {
		internal: {
			capacity: number;
			freeSpace: number;
		};
		removable: {
			capacity: number;
			freeSpace: number;
		};
		updatedAt: Date;
	};
	connections: any;
	batteryStatus: {
		chargeType: string;
		isCharging: boolean;
		lastChargingTime: Date;
		percentage: number;
		updatedAt: Date;
	};
	currentTime: {
		time: Date;
		timezone: string;
		updatedAt: Date;
	};
	supportedResolutions: ResolutionItem[];
	locationUid?: string;
}
