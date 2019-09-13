
export interface IDeviceUpdatable {
	name: string;
}

export interface IDeviceReadOnly {
	uid: string;
	createdAt: Date;
	aliveAt: Date;
	pinCode: string;
	applicationType: string;
	applicationVersion: string;
	frontDisplayVersion: string;
	firmwareVersion: string;
	model: string;
	serialNumber: string;
	timezone: string | null;
	organizationUid: string;
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

interface IDevice extends IDeviceReadOnly, IDeviceUpdatable {

}

export default IDevice;
