import IAppletCommand, { ICommandPayload } from "./IAppletCommand";

export default class AppletCommand<P extends ICommandPayload = ICommandPayload> implements IAppletCommand<P> {

	// public readonly [P in keyof IAppletCommand]: IAppletCommand[P]; // Generalized TS doesn't support
	public readonly uid: IAppletCommand['uid'];
	public readonly deviceUid: IAppletCommand['deviceUid'];
	public readonly appletUid: IAppletCommand['appletUid'];
	public readonly commandPayload: IAppletCommand<P>['commandPayload'];
	public readonly timingChecksum: IAppletCommand['timingChecksum'];
	public readonly receivedAt: IAppletCommand['receivedAt'];

	constructor(data: IAppletCommand) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
