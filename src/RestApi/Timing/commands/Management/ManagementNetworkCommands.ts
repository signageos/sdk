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
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import INetwork from "@signageos/front-applet/es6/FrontApplet/Management/Network/INetwork";
import INetworkInfo, {
	INetworkInterface,
	INetworkOptions, INetworkOptionsLegacy,
} from "@signageos/front-applet/es6/FrontApplet/Management/Network/INetworkInfo";

export default class ManagementNetworkCommands implements INetwork {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async listInterfaces(): Promise<INetworkInterface[]> {
		const timingCommand = await this.appletCommandManagement.send<ManagementNetworkListInterfacesRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementNetworkListInterfacesRequest,
			},
		});
		while (true) {
			const commandResults = await this.appletCommandManagement.list<ManagementNetworkListInterfacesResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: timingCommand.receivedAt,
					type: ManagementNetworkListInterfacesResult,
				},
			);
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async setManual(options: INetworkOptionsLegacy): Promise<void>;
	public async setManual(interfaceName: string, options: INetworkOptions): Promise<void>;

	public async setManual(...args: [string, INetworkOptions] | [INetworkOptionsLegacy]) {
		if (typeof args[0] === 'string') {
			const [interfaceName, options] = args;
			const timingCommand = await this.appletCommandManagement.send<ManagementNetworkSetManualRequest>(this.deviceUid, this.appletUid, {
				command: {
					type: ManagementNetworkSetManualRequest,
					interfaceName,
					// @ts-ignore
					options, //TODO: Fix this
				},
			});
			while (true) {
				const commandResults = await this.appletCommandManagement.list<ManagementNetworkSetManualResult>(this.deviceUid, this.appletUid, {
					receivedSince: timingCommand.receivedAt,
					type: ManagementNetworkSetManualResult,
				});
				if (commandResults.length > 0) {
					return commandResults[0].command.result;
				}
				await wait(500);
			}
		} else {
			throw new Error('Method not implemented.');
		}
	}

	public async setDHCP(interfaceName: string): Promise<void> {
		const timingCommand = await this.appletCommandManagement.send<ManagementNetworkSetDHCPServerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementNetworkSetDHCPServerRequest,
				interfaceName,
			},
		});
		while (true) {
			const commandResults = await this.appletCommandManagement.list<ManagementNetworkSetDHCPServerResult>(this.deviceUid, this.appletUid, {
				receivedSince: timingCommand.receivedAt,
				type: ManagementNetworkSetDHCPServerResult,
			});
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async disableInterface(interfaceName: string): Promise<void> {
		const timingCommand = await this.appletCommandManagement.send<ManagementNetworkDisableInterfaceRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: {
					type: ManagementNetworkDisableInterfaceRequest,
					interfaceName,
				},
			},
		);
		while (true) {
			const commandResults = await this.appletCommandManagement.list<ManagementNetworkDisableInterfaceResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: timingCommand.receivedAt,
					type: ManagementNetworkDisableInterfaceResult,
				},
			);
			if (commandResults.length > 0) {
				return commandResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async getActiveInfo(): Promise<INetworkInfo> {
		//TODO: Implement
		throw new Error('Method not implemented.');
	}
}
