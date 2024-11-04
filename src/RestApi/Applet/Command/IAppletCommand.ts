export interface ICommandPayload {
	type: string;
	[key: string]: any;
}

export interface IAppletCommandSendable<IPayload extends ICommandPayload> {
	command: IPayload;
}

interface IAppletCommand<P extends ICommandPayload = ICommandPayload> extends IAppletCommandSendable<P> {
	uid: string;
	deviceUid: string;
	appletUid: string;
	receivedAt: Date;
	timingChecksum: string;
}

export default IAppletCommand;
