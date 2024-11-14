import {
	ApplicationGetTypeRequest,
	ApplicationGetTypeResult,
	ApplicationGetVersionRequest,
	ApplicationGetVersionResult,
	ApplicationUpgradeRequest,
	ApplicationUpgradeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/App/applicationCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IApp from "@signageos/front-applet/es6/FrontApplet/Management/App/IApp";

export default class ManagementAppCommands implements IApp {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async getType(): Promise<string> {
		const command = await this.appletCommandManagement.send<ApplicationGetTypeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ApplicationGetTypeRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ApplicationGetTypeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ApplicationGetTypeResult,
			});
			if (results.length > 0) {
				return results[0].command.applicationType;
			}
			await wait(500);
		}
	}

	public async getVersion(): Promise<string> {
		const command = await this.appletCommandManagement.send<ApplicationGetVersionRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ApplicationGetVersionRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ApplicationGetVersionResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ApplicationGetVersionResult,
			});
			if (results.length > 0) {
				return results[0].command.version;
			}
			await wait(500);
		}
	}

	public async upgrade(version: string, baseUrl?: string | undefined): Promise<void> {
		const command = await this.appletCommandManagement.send<ApplicationUpgradeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ApplicationUpgradeRequest,
				version,
				baseUrl,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ApplicationUpgradeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ApplicationUpgradeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
