export interface IDevicePolicyAssignable {
	uid: string;
	/** Higher number means higher priority */
	priority: number;
}

export interface IDevicePolicyRaw {
	uid: string;
	/** Higher number means higher priority */
	priority: number;
	assignedAt: Date;
}

export default interface IDevicePolicy {
	deviceUid: string;
	policyUid: string;
	/** Higher number means higher priority */
	priority: number;
	assignedAt: Date;
}
