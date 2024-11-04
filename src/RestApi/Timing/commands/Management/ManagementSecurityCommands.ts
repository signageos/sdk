import wait from '../../../../Timer/wait';
import {
	ManagementSecurityGenerateRandomPinCodeRequest,
	ManagementSecurityGenerateRandomPinCodeResult,
	ManagementSecurityGetPinCodeRequest,
	ManagementSecurityGetPinCodeResult,
	ManagementSecuritySetPinCodeRequest,
	ManagementSecuritySetPinCodeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Security/securityCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export interface IManagementSecurity {
	getPinCode(): Promise<string>;
	setPinCode(pinCode: string): Promise<void>;
	generateRandomPinCode(): Promise<void>;
}

export default class ManagementSecurityCommands implements IManagementSecurity {
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
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementSecurityGetPinCodeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSecurityGetPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.pinCode;
			}
			await wait(500);
		}
	}

	public async setPinCode(pinCode: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementSecuritySetPinCodeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementSecuritySetPinCodeRequest,
				pinCode,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementSecuritySetPinCodeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSecuritySetPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
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
		while (true) {
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
			await wait(500);
		}
	}
}
