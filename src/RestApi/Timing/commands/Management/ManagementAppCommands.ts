import {
	ApplicationGetTypeRequest,
	ApplicationGetTypeResult,
	ApplicationGetVersionRequest,
	ApplicationGetVersionResult,
	ApplicationUpgradeRequest,
	ApplicationUpgradeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/App/applicationCommands';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import wait from '../../../../Timer/wait';

export interface IManagementApplication {
	getType(): Promise<string>;
	getVersion(): Promise<string>;
	upgrade(version: string, baseUrl?: string): Promise<void>;
}

export default class ManagementAppCommands implements IManagementApplication {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async getType(): Promise<string> {
		const command = await this.timingCommandManagement.create<ApplicationGetTypeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ApplicationGetTypeRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ApplicationGetTypeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ApplicationGetTypeResult,
			});
			if (results.length > 0) {
				return results[0].command.applicationType;
			}
			await wait(500);
		}
	}

	public async getVersion(): Promise<string> {
		const command = await this.timingCommandManagement.create<ApplicationGetVersionRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ApplicationGetVersionRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ApplicationGetVersionResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ApplicationGetVersionResult,
			});
			if (results.length > 0) {
				return results[0].command.version;
			}
			await wait(500);
		}
	}

	public async upgrade(version: string, baseUrl?: string | undefined): Promise<void> {
		const command = await this.timingCommandManagement.create<ApplicationUpgradeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ApplicationUpgradeRequest,
				version,
				baseUrl,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ApplicationUpgradeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ApplicationUpgradeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
