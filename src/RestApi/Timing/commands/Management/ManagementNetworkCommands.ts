import { INetworkInterface, INetworkOptions } from '@signageos/front-applet/es6/FrontApplet/Management/INetworkInfo';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementNetworkListInterfacesRequest,
	ManagementNetworkListInterfacesResult,
	ManagementNetworkSetManualRequest,
	ManagementNetworkSetManualResult,
	ManagementNetworkSetDHCPServerRequest,
	ManagementNetworkSetDHCPServerResult,
	ManagementNetworkDisableInterfaceRequest,
	ManagementNetworkDisableInterfaceResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Network/managementNetworkCommands';
import wait from '../../../../Timer/wait';

export interface IManagementNetwork {
	listInterfaces(): Promise<INetworkInterface[]>;
	setManual(interfaceName: string, options: INetworkOptions): Promise<void>;
	setDHCP(interfaceName: string): Promise<void>;
	disableInterface(interfaceName: string): Promise<void>;
}

export default class ManagementNetworkCommands implements IManagementNetwork {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async listInterfaces(): Promise<INetworkInterface[]> {
		const timingCommand = await this.timingCommandManagement.create<ManagementNetworkListInterfacesRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementNetworkListInterfacesRequest,
			},
		});
		while (true) {
			const commandResults = await this.timingCommandManagement.getList<ManagementNetworkListInterfacesResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: timingCommand.receivedAt.toISOString(),
				type: ManagementNetworkListInterfacesResult,
			});
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async setManual(interfaceName: string, options: INetworkOptions): Promise<void> {
		const timingCommand = await this.timingCommandManagement.create<ManagementNetworkSetManualRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementNetworkSetManualRequest,
				interfaceName,
				options,
			},
		});
		while (true) {
			const commandResults = await this.timingCommandManagement.getList<ManagementNetworkSetManualResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: timingCommand.receivedAt.toISOString(),
				type: ManagementNetworkSetManualResult,
			});
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async setDHCP(interfaceName: string): Promise<void> {
		const timingCommand = await this.timingCommandManagement.create<ManagementNetworkSetDHCPServerRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementNetworkSetDHCPServerRequest,
				interfaceName,
			},
		});
		while (true) {
			const commandResults = await this.timingCommandManagement.getList<ManagementNetworkSetDHCPServerResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: timingCommand.receivedAt.toISOString(),
				type: ManagementNetworkSetDHCPServerResult,
			});
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async disableInterface(interfaceName: string): Promise<void> {
		const timingCommand = await this.timingCommandManagement.create<ManagementNetworkDisableInterfaceRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementNetworkDisableInterfaceRequest,
				interfaceName,
			},
		});
		while (true) {
			const commandResults = await this.timingCommandManagement.getList<ManagementNetworkDisableInterfaceResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: timingCommand.receivedAt.toISOString(),
				type: ManagementNetworkDisableInterfaceResult,
			});
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}
}
