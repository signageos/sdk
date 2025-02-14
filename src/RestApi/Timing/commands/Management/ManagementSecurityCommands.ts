import {
	ManagementSecurityGenerateRandomPinCodeRequest,
	ManagementSecurityGenerateRandomPinCodeResult,
	ManagementSecurityGetPinCodeRequest,
	ManagementSecurityGetPinCodeResult,
	ManagementSecuritySetPinCodeRequest,
	ManagementSecuritySetPinCodeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Security/securityCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import ISecurity from '@signageos/front-applet/es6/FrontApplet/Management/Security/ISecurity';
import { waitUntilReturnValue } from '../../../../Timer/waitUntil';

export default class ManagementSecurityCommands implements ISecurity {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async getPinCode(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementSecurityGetPinCodeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementSecurityGetPinCodeRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementSecurityGetPinCodeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSecurityGetPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.pinCode;
			}
		});
	}

	public async setPinCode(pinCode: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementSecuritySetPinCodeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementSecuritySetPinCodeRequest,
				pinCode,
			},
		});
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementSecuritySetPinCodeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSecuritySetPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async generateRandomPinCode(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementSecurityGenerateRandomPinCodeRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: {
					type: ManagementSecurityGenerateRandomPinCodeRequest,
				},
			},
		);
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementSecurityGenerateRandomPinCodeResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementSecurityGenerateRandomPinCodeResult,
				},
			);
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}
}
