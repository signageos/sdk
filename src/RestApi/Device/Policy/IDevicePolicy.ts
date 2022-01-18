export interface IDevicePolicyAssignable {
	uid: string;
	priority: number;
}

export interface IDevicePolicyRaw {
	uid: string;
	priority: number;
	assignedAt: Date;
}

export default interface IDevicePolicy {
	deviceUid: string;
	policyUid: string;
	priority: number;
	assignedAt: Date;
}
