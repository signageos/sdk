import wait from '../../../../Timer/wait';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementSecurityGenerateRandomPinCodeRequest,
	ManagementSecurityGenerateRandomPinCodeResult,
	ManagementSecurityGetPinCodeRequest,
	ManagementSecurityGetPinCodeResult,
	ManagementSecuritySetPinCodeRequest,
	ManagementSecuritySetPinCodeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Security/securityCommands';

export interface IManagementSecurity {
	getPinCode(): Promise<string>;
	setPinCode(pinCode: string): Promise<void>;
	generateRandomPinCode(): Promise<void>;
}

export default class ManagementSecurityCommands implements IManagementSecurity {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async getPinCode(): Promise<string> {
		const command = await this.timingCommandManagement.create<ManagementSecurityGetPinCodeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementSecurityGetPinCodeRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementSecurityGetPinCodeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementSecurityGetPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.pinCode;
			}
			await wait(500);
		}
	}

	public async setPinCode(pinCode: string): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementSecuritySetPinCodeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementSecuritySetPinCodeRequest,
				pinCode,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementSecuritySetPinCodeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementSecuritySetPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async generateRandomPinCode(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementSecurityGenerateRandomPinCodeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementSecurityGenerateRandomPinCodeRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementSecurityGenerateRandomPinCodeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementSecurityGenerateRandomPinCodeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
