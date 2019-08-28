import IAppletCommand from "./IAppletCommand";

export default class AppletCommand implements IAppletCommand {

	// public readonly [P in keyof IAppletCommand]: IAppletCommand[P]; // Generalized TS doesn't support
	public readonly uid: IAppletCommand['uid'];
	public readonly deviceUid: IAppletCommand['deviceUid'];
	public readonly appletUid: IAppletCommand['appletUid'];
	public readonly commandPayload: IAppletCommand['commandPayload'];
	public readonly timingChecksum: IAppletCommand['timingChecksum'];
	public readonly receivedAt: IAppletCommand['receivedAt'];

	constructor(data: IAppletCommand) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
