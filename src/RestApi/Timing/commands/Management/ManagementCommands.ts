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
	ManagementRessetSettingsResult, //TODO: Ressset?
	ManagementFactoryResetRequest,
	ManagementFactoryResetResult,
	ManagementGetExtendedManagementUrlRequest,
	ManagementGetExtendedManagementUrlResult,
	ManagementSetExtendedManagementUrlRequest,
	ManagementSetExtendedManagementUrlResult,
} from '@signageos/front-applet/es6/Monitoring/Management/managementCommands';
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
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

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
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementSupportsResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSupportsResult,
			});
			if (results.length > 0) {
				return results[0].command.supports;
			}
			await wait(500);
		}
	}

	public async getModel(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementGetModelRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetModelRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementGetModelResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetModelResult,
			});
			if (results.length > 0) {
				return results[0].command.model;
			}
			await wait(500);
		}
	}

	public async getSerialNumber(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementGetSerialNumberRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetSerialNumberRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementGetSerialNumberResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetSerialNumberResult,
			});
			if (results.length > 0) {
				return results[0].command.serialNumber;
			}
			await wait(500);
		}
	}

	public async getTemperature(): Promise<number> {
		const command = await this.appletCommandManagement.send<ManagementGetTemperatureRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetTemperatureRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementGetTemperatureResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetTemperatureResult,
			});
			if (results.length > 0) {
				return results[0].command.temperature;
			}
			await wait(500);
		}
	}

	public async getBrand(): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementGetBrandRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetBrandRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementGetBrandResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.brand;
			}
			await wait(500);
		}
	}

	public async getBatteryStatus(): Promise<IBatteryStatus> {
		const command = await this.appletCommandManagement.send<ManagementGetBatteryStatusRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetBatteryStatusRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementGetBatteryStatusResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.status;
			}
			await wait(500);
		}
	}

	public async resetSettings(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementResetSettingsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementResetSettingsRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementRessetSettingsResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async factoryReset(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementFactoryResetRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementFactoryResetRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementFactoryResetResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetBrandResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async getExtendedManagementUrl(): Promise<string | null> {
		const command = await this.appletCommandManagement.send<ManagementGetExtendedManagementUrlRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementGetExtendedManagementUrlRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementGetExtendedManagementUrlResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementGetExtendedManagementUrlResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async setExtendedManagementUrl(url: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementSetExtendedManagementUrlRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementSetExtendedManagementUrlRequest,
				url,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementSetExtendedManagementUrlResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementSetExtendedManagementUrlResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
