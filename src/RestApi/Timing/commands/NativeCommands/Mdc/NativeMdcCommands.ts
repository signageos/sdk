import { CodesMDC } from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/CodesMDC';
import { IMDCResponse, IpAddressType } from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/Mdc';
import TimingCommandManagement from '../../../Command/TimingCommandManagement';
import {
	ManagementNativeCommandsMdcSendOneRequest,
	ManagementNativeCommandsMdcSendOneResult,
} from '@signageos/front-applet/es6/Monitoring/NativeCommands/nativeMdcCommands';
import wait from '../../../../../Timer/wait';

export interface INativeMdcCommands {
	sendOne(ipAddress: IpAddressType, command: CodesMDC, data?: number[] | []): Promise<IMDCResponse>;
}

export default class NativeMdcCommands implements INativeMdcCommands {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async sendOne(ipAddress: IpAddressType, command: CodesMDC, data?: number[] | []): Promise<IMDCResponse> {
		const timingCommand = await this.timingCommandManagement.create<ManagementNativeCommandsMdcSendOneRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementNativeCommandsMdcSendOneRequest,
				ipAddress,
				codes: command,
				data,
			},
		});
		while (true) {
			const commandResults = await this.timingCommandManagement.getList<ManagementNativeCommandsMdcSendOneResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: timingCommand.receivedAt.toISOString(),
				type: ManagementNativeCommandsMdcSendOneResult,
			});
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}
}
