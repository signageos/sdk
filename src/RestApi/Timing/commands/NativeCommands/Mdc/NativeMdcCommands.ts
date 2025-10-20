import { CodesMDC } from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/CodesMDC';
import { IMDCResponse, IpAddressType } from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/Mdc';
import {
	ManagementNativeCommandsMdcSendOneRequest,
	ManagementNativeCommandsMdcSendOneResult,
} from '@signageos/front-applet/es6/Monitoring/NativeCommands/nativeMdcCommands';
import AppletCommandManagement from '../../../../Applet/Command/AppletCommandManagement';
import INativeMdcCommands from '@signageos/front-applet/es6/FrontApplet/NativeCommands/MDC/INativeMdcCommands';
import { waitUntilReturnValue } from '../../../../../Timer/waitUntil';

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
		return await waitUntilReturnValue(async () => {
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
		});
	}

	public async sendOneRaw(): Promise<IMDCResponse> {
		throw new Error('sendOneRaw is not implemented in management SDK');
	}
}
