
export interface IAppletCommandSendable {
	commandPayload: {
		type: string;
		payload: {
			level: string;
			message: string;
		};
	};
}

interface IAppletCommand extends IAppletCommandSendable {
	uid: string;
	deviceUid: string;
	appletUid: string;
	receivedAt: Date;
	timingChecksum: string;
}

export default IAppletCommand;
