interface IDeviceAuthentication {
	deviceUid: string;
	authHash: string;
	createdAt: Date;
}

export default IDeviceAuthentication;
