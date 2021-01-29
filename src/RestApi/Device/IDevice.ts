
export interface IDeviceUpdatable {
	name?: string;
	organizationUid?: string;
}

export default interface IDeviceReadOnly {
	uid: string;
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
	organizationUid: string;
	timezone: string | null;
	networkInterfaces: {
		[optionName: string]: any;
	};
	storageStatus: {
		internal: {
			capacity: number;
			freeSpace: number;
		},
		removable: {
			capacity: number;
			freeSpace: number;
		},
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
}
