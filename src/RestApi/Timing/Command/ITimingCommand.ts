export interface ITimingCommandPayload {
	type: string;
	[name: string]: any;
}

export interface ITimingCommandCreateOnly<TCommandPayload extends ITimingCommandPayload> {
	deviceUid: string;
	appletUid: string;
	command: TCommandPayload;
}

export interface ITimingCommandReadOnly {
	receivedAt: Date;
	timingChecksum: string;
}

interface ITimingCommand<TCommandPayload extends ITimingCommandPayload>
	extends ITimingCommandReadOnly,
		ITimingCommandCreateOnly<TCommandPayload> {}

export default ITimingCommand;
