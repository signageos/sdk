interface IHourlyStatus {
	uid: string;
	createdAt: Date;
	deviceIdentityHash: string;
	from: Date;
	to: Date;
	time: number;
}

export default IHourlyStatus;
