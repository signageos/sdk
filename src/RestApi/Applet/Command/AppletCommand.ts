import { fillDataToEntity } from '../../mapper';
import IAppletCommand, { ICommandPayload } from './IAppletCommand';

export default class AppletCommand<P extends ICommandPayload = ICommandPayload> implements IAppletCommand<P> {
	// public readonly [P in keyof IAppletCommand]: IAppletCommand[P]; // Generalized TS doesn't support
	public readonly uid: IAppletCommand['uid'];
	public readonly deviceUid: IAppletCommand['deviceUid'];
	public readonly appletUid: IAppletCommand['appletUid'];
	public readonly command: IAppletCommand<P>['command'];
	public readonly timingChecksum: IAppletCommand['timingChecksum'];
	public readonly receivedAt: IAppletCommand['receivedAt'];

	constructor(data: IAppletCommand) {
		fillDataToEntity(this, data);
	}
}
