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
	ManagementRessetSettingsResult,
	ManagementFactoryResetRequest,
	ManagementFactoryResetResult,
	ManagementGetExtendedManagementUrlRequest,
	ManagementGetExtendedManagementUrlResult,
	ManagementSetExtendedManagementUrlRequest,
	ManagementSetExtendedManagementUrlResult,
} from '@signageos/front-applet/es6/Monitoring/Management/managementCommands';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import wait from '../../../../Timer/wait';
import ManagementPowerCommands, { IManagementPower } from './ManagementPowerCommands';
import ManagementAppCommands, { IManagementApplication } from './ManagementAppCommands';
import IBatteryStatus from '@signageos/front-applet/es6/FrontApplet/Management/IBatteryStatus';
import ManagementScreenCommands, { IManagementScreen } from './ManagementScreenCommands';
import ManagementSecurityCommands, { IManagementSecurity } from './ManagementSecurityCommands';
import ManagementAudioCommands, { IManagementAudio } from './ManagementAudioCommands';
import ManagementRemoteControlCommands, { IManagementRemoteControl } from './ManagementRemoteControlCommands';
import ManagementOsCommands, { IManagementOs } from './ManagementOsCommands';
import ManagementDebugCommands, { IManagementDebug } from './ManagementDebugCommands';
import ManagementTimeCommands, { IManagementTime } from './ManagementTimeCommands';
import ManagementNetworkCommands, { IManagementNetwork } from './ManagementNetworkCommands';
import ManagementPeerRecoveryCommands, { IManagementPeerRecovery } from './ManagementPeerRecoveryCommands';
import ManagementAutoRecoveryCommands, { IManagementAutoRecovery } from './ManagementAutoRecoveryCommands';

export interface IManagement {
	supports(capability: string): Promise<boolean>;
	getModel(): Promise<string>;
	getSerialNumber(): Promise<string>;
	getTemperature(): Promise<number>;
	getBrand(): Promise<string>;
	getBatteryStatus(): Promise<IBatteryStatus>;
	resetSettings(): Promise<void>;
	factoryReset(): Promise<void>;
	getExtendedManagementUrl(): Promise<string | null>;
	setExtendedManagementUrl(url: string): Promise<void>;
}

export default class ManagementCommands implements IManagement {
	public readonly power: IManagementPower;
	public readonly app: IManagementApplication;
	public readonly screen: IManagementScreen;
	public readonly security: IManagementSecurity;
	public readonly audio: IManagementAudio;
	public readonly remoteControl: IManagementRemoteControl;
	public readonly os: IManagementOs;
	public readonly debug: IManagementDebug;
	public readonly time: IManagementTime;
	public readonly network: IManagementNetwork;
	public readonly peerRecovery: IManagementPeerRecovery;
	public readonly autoRecovery: IManagementAutoRecovery;

	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {
		this.power = new ManagementPowerCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.app = new ManagementAppCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.screen = new ManagementScreenCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.security = new ManagementSecurityCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.audio = new ManagementAudioCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.remoteControl = new ManagementRemoteControlCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.os = new ManagementOsCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.debug = new ManagementDebugCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.time = new ManagementTimeCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.network = new ManagementNetworkCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.peerRecovery = new ManagementPeerRecoveryCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.autoRecovery = new ManagementAutoRecoveryCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
	}

	public async supports(capability: string): Promise<boolean> {
		const command = await this.timingCommandManagement.create<ManagementSupportsRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementSupportsRequest,
				capability,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementSupportsResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementSupportsResult,
			});
			if (results.length > 0) {
				return results[0].command.supports;
			}
			await wait(500);
		}
	}

	public async getModel(): Promise<string> {
		const command = await this.timingCommandManagement.create<ManagementGetModelRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementGetModelRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementGetModelResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetModelResult,
			});
			if (results.length > 0) {
				return results[0].command.model;
			}
			await wait(500);
		}
	}

	public async getSerialNumber(): Promise<string> {
		const command = await this.timingCommandManagement.create<ManagementGetSerialNumberRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementGetSerialNumberRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementGetSerialNumberResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetSerialNumberResult,
			});
			if (results.length > 0) {
				return results[0].command.serialNumber;
			}
			await wait(500);
		}
	}

	public async getTemperature(): Promise<number> {
		const command = await this.timingCommandManagement.create<ManagementGetTemperatureRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementGetTemperatureRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementGetTemperatureResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetTemperatureResult,
			});
			if (results.length > 0) {
				return results[0].command.temperature;
			}
			await wait(500);
		}
	}

	public async getBrand(): Promise<string> {
		const command = await this.timingCommandManagement.create<ManagementGetBrandRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementGetBrandRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementGetBrandResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.brand;
			}
			await wait(500);
		}
	}

	public async getBatteryStatus(): Promise<IBatteryStatus> {
		const command = await this.timingCommandManagement.create<ManagementGetBatteryStatusRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementGetBatteryStatusRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementGetBatteryStatusResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.status;
			}
			await wait(500);
		}
	}

	public async resetSettings(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementResetSettingsRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementResetSettingsRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementRessetSettingsResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async factoryReset(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementFactoryResetRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementFactoryResetRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementFactoryResetResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async getExtendedManagementUrl(): Promise<string | null> {
		const command = await this.timingCommandManagement.create<ManagementGetExtendedManagementUrlRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementGetExtendedManagementUrlRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementGetExtendedManagementUrlResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementGetExtendedManagementUrlResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async setExtendedManagementUrl(url: string): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementSetExtendedManagementUrlRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementSetExtendedManagementUrlRequest,
				url,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementSetExtendedManagementUrlResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementSetExtendedManagementUrlResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
