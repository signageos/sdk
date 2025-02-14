import {
	ManagementGetBrandRequest,
	ManagementGetBrandResult,
	ManagementGetTemperatureRequest,
	ManagementGetTemperatureResult,
	ManagementSupportsRequest,
	ManagementSupportsResult,
	ManagementGetModelRequest,
	ManagementGetModelResult,
	ManagementGetSerialNumberRequest,
	ManagementGetSerialNumberResult,
	ManagementGetBatteryStatusRequest,
	ManagementGetBatteryStatusResult,
	ManagementResetSettingsRequest,
	ManagementResetSettingsResult,
	ManagementFactoryResetRequest,
	ManagementFactoryResetResult,
	ManagementGetExtendedManagementUrlRequest,
	ManagementGetExtendedManagementUrlResult,
	ManagementSetExtendedManagementUrlRequest,
	ManagementSetExtendedManagementUrlResult,
} from '@signageos/front-applet/es6/Monitoring/Management/managementCommands';
import ManagementPowerCommands from './ManagementPowerCommands';
import ManagementAppCommands from './ManagementAppCommands';
import IBatteryStatus from '@signageos/front-applet/es6/FrontApplet/Management/IBatteryStatus';
import ManagementScreenCommands from './ManagementScreenCommands';
import ManagementSecurityCommands from './ManagementSecurityCommands';
import ManagementAudioCommands from './ManagementAudioCommands';
import ManagementRemoteControlCommands from './ManagementRemoteControlCommands';
import ManagementOsCommands from './ManagementOsCommands';
import ManagementDebugCommands from './ManagementDebugCommands';
import ManagementTimeCommands from './ManagementTimeCommands';
import ManagementNetworkCommands from './ManagementNetworkCommands';
import ManagementPeerRecoveryCommands from './ManagementPeerRecoveryCommands';
import ManagementAutoRecoveryCommands from './ManagementAutoRecoveryCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IManagement from '@signageos/front-applet/es6/FrontApplet/Management/IManagement';
import IPower from '@signageos/front-applet/es6/FrontApplet/Management/Power/IPower';
import IApp from '@signageos/front-applet/es6/FrontApplet/Management/App/IApp';
import IScreen from '@signageos/front-applet/es6/FrontApplet/Management/Screen/IScreen';
import ISecurity from '@signageos/front-applet/es6/FrontApplet/Management/Security/ISecurity';
import IAudio from '@signageos/front-applet/es6/FrontApplet/Management/Audio/IAudio';
import IRemoteControl from '@signageos/front-applet/es6/FrontApplet/Management/RemoteControl/IRemoteControl';
import IOS from '@signageos/front-applet/es6/FrontApplet/Management/OS/IOS';
import IDebug from '@signageos/front-applet/es6/FrontApplet/Management/Debug/IDebug';
import ITime from '@signageos/front-applet/es6/FrontApplet/Management/Time/ITime';
import INetwork from '@signageos/front-applet/es6/FrontApplet/Management/Network/INetwork';
import IPeerRecovery from '@signageos/front-applet/es6/FrontApplet/Management/PeerRecovery/IPeerRecovery';
import IAutoRecovery from '@signageos/front-applet/es6/FrontApplet/Management/AutoRecovery/IAutoRecovery';
import INetworkInfo from '@signageos/front-applet/es6/FrontApplet/Management/Network/INetworkInfo';
import { waitUntilReturnValue } from '../../../../Timer/waitUntil';

export default class ManagementCommands implements IManagement {
	public readonly power: IPower;
	public readonly app: IApp;
	public readonly screen: IScreen;
	public readonly security: ISecurity;
	public readonly audio: IAudio;
	public readonly remoteControl: IRemoteControl;
	public readonly os: IOS;
	public readonly debug: IDebug;
	public readonly time: ITime;
	public readonly network: INetwork;
	public readonly peerRecovery: IPeerRecovery;
	public readonly autoRecovery: IAutoRecovery;

	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {
		this.power = new ManagementPowerCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.app = new ManagementAppCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.screen = new ManagementScreenCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.security = new ManagementSecurityCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.audio = new ManagementAudioCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.remoteControl = new ManagementRemoteControlCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.os = new ManagementOsCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.debug = new ManagementDebugCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.time = new ManagementTimeCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.network = new ManagementNetworkCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.peerRecovery = new ManagementPeerRecoveryCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
		this.autoRecovery = new ManagementAutoRecoveryCommands(this.deviceUid, this.appletUid, this.appletCommandManagement);
	}

	public async supports(capability: string): Promise<boolean> {
		const command = await this.appletCommandManagement.send<ManagementSupportsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementSupportsRequest,
				capability,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementSupportsResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSupportsResult,
			});
			if (results.length > 0) {
				return results[0].command.supports;
			}
		});
	}

	public async getModel(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementGetModelRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetModelRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementGetModelResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetModelResult,
			});
			if (results.length > 0) {
				return results[0].command.model;
			}
		});
	}

	public async getSerialNumber(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementGetSerialNumberRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetSerialNumberRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementGetSerialNumberResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetSerialNumberResult,
			});
			if (results.length > 0) {
				return results[0].command.serialNumber;
			}
		});
	}

	public async getTemperature(): Promise<number> {
		const command = await this.appletCommandManagement.send<ManagementGetTemperatureRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetTemperatureRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementGetTemperatureResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetTemperatureResult,
			});
			if (results.length > 0) {
				return results[0].command.temperature;
			}
		});
	}

	public async getBrand(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementGetBrandRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetBrandRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementGetBrandResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.brand;
			}
		});
	}

	public async getBatteryStatus(): Promise<IBatteryStatus> {
		const command = await this.appletCommandManagement.send<ManagementGetBatteryStatusRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetBatteryStatusRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementGetBatteryStatusResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.status;
			}
		});
	}

	public async resetSettings(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementResetSettingsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementResetSettingsRequest,
			},
		});
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementResetSettingsResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async factoryReset(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementFactoryResetRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementFactoryResetRequest,
			},
		});
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementFactoryResetResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async getExtendedManagementUrl(): Promise<string | null> {
		const command = await this.appletCommandManagement.send<ManagementGetExtendedManagementUrlRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetExtendedManagementUrlRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementGetExtendedManagementUrlResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetExtendedManagementUrlResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async setExtendedManagementUrl(url: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementSetExtendedManagementUrlRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementSetExtendedManagementUrlRequest,
				url,
			},
		});
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<ManagementSetExtendedManagementUrlResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSetExtendedManagementUrlResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	/**
	 * @deprecated
	 */
	public async getNetworkInfo(): Promise<INetworkInfo> {
		throw new Error('Method not implemented.');
	}
}
