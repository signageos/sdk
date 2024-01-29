import { fillDataToEntity } from '../../mapper';
import ITimingCommand, { ITimingCommandPayload } from './ITimingCommand';

export default class TimingCommand<TCommandPayload extends ITimingCommandPayload> implements ITimingCommand<TCommandPayload> {
	// public readonly [P in keyof ITimingCommand]: ITimingCommand[P]; // Generalized TS doesn't support
	public readonly appletUid: ITimingCommand<TCommandPayload>['appletUid'];
	public readonly deviceUid: ITimingCommand<TCommandPayload>['deviceUid'];
	public readonly receivedAt: ITimingCommand<TCommandPayload>['receivedAt'];
	public readonly timingChecksum: ITimingCommand<TCommandPayload>['timingChecksum'];
	public readonly commandPayload: ITimingCommand<TCommandPayload>['commandPayload'];

	constructor(data: ITimingCommand<TCommandPayload>) {
		fillDataToEntity(this, data);
	}
}
