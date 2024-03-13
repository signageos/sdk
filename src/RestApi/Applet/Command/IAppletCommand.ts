export interface ICommandPayload {
	type: string;
	[key: string]: any;
}

export interface IAppletCommandSendable<P extends ICommandPayload = ICommandPayload> {
	command: P;
}

interface IAppletCommand<P extends ICommandPayload = ICommandPayload> extends IAppletCommandSendable<P> {
	uid: string;
	deviceUid: string;
	appletUid: string;
	receivedAt: Date;
	timingChecksum: string;
}

export default IAppletCommand;
