
interface ITimingCommandFilter {
	deviceUid: string;
	appletUid?: string;
	type?: string;
	receivedSince?: string;
	receivedUntil?: string;
}
export default ITimingCommandFilter;
