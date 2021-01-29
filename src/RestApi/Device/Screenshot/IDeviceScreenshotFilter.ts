interface IDeviceScreenshotFilter {
	takenSince?: Date;
	takenUntil?: Date;
	limit?: number;
	descending?: boolean;
}
export default IDeviceScreenshotFilter;
