
export interface IDeviceVerificationUpdatable {
	verificationHash: string;
}

export interface IDeviceVerification {
	uid: string;
	deviceUid: string;
	hash: string;
	createdAt: Date;
	verifiedAt: Date | null;
}

export default IDeviceVerification;
