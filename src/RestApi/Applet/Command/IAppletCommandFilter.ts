interface IAppletCommandFilter {
	appletUid?: string;
	type?: string;
	receivedSince?: Date;
	receivedUntil?: Date;
}

export default IAppletCommandFilter;
