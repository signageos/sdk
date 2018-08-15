
import TimingManagement from './Timing/TimingManagement';
import IOptions from './IOptions';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';

export default class RestApi {

	public readonly timing: TimingManagement = new TimingManagement(this.options);
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.options);

	constructor(
		private options: IOptions
	) {}
}
