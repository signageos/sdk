import { CodesMDC } from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/CodesMDC';
import { IMDCResponse, IpAddressType } from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/Mdc';
import {
	ManagementNativeCommandsMdcSendOneRequest,
	ManagementNativeCommandsMdcSendOneResult,
} from '@signageos/front-applet/es6/Monitoring/NativeCommands/nativeMdcCommands';
import wait from '../../../../../Timer/wait';
import AppletCommandManagement from '../../../../Applet/Command/AppletCommandManagement';

export interface INativeMdcCommands {
	sendOne(ipAddress: IpAddressType, command: CodesMDC, data?: number[] | []): Promise<IMDCResponse>;
}

export default class NativeMdcCommands implements INativeMdcCommands {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async sendOne(ipAddress: IpAddressType, command: CodesMDC, data?: number[] | []): Promise<IMDCResponse> {
		const timingCommand = await this.appletCommandManagement.send<ManagementNativeCommandsMdcSendOneRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: {
					type: ManagementNativeCommandsMdcSendOneRequest,
					ipAddress,
					codes: command,
					data,
				},
			},
		);
		while (true) {
			const commandResults = await this.appletCommandManagement.list<ManagementNativeCommandsMdcSendOneResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: timingCommand.receivedAt,
					type: ManagementNativeCommandsMdcSendOneResult,
				},
			);
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}
}
