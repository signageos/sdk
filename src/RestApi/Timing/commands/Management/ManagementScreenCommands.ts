import wait from '../../../../Timer/wait';
import IOrientation from '@signageos/front-applet/es6/FrontApplet/Management/IOrientation';
import IBrightness from '@signageos/front-applet/es6/FrontApplet/Management/IBrightness';
import {
	ManagementScreenGetBrightnessRequest,
	ManagementScreenGetBrightnessResult,
	ManagementScreenGetOrientationRequest,
	ManagementScreenGetOrientationResult,
	ManagementScreenIsPoweredOnRequest,
	ManagementScreenIsPoweredOnResult,
	ManagementScreenPowerOffRequest,
	ManagementScreenPowerOffResult,
	ManagementScreenPowerOnRequest,
	ManagementScreenPowerOnResult,
	ManagementScreenResizeRequest,
	ManagementScreenResizeResult,
	ManagementScreenSetBrightnessRequest,
	ManagementScreenSetBrightnessResult,
	ManagementScreenTakeScreenshotRequest,
	ManagementScreenTakeScreenshotResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Screen/screenCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export interface IManagementScreen {
	resize(baseUrl: string, orientation: string, resolution: string, currentVersion: string, videoOrientation?: string): Promise<void>;
	getOrientation(): Promise<IOrientation>;
	setBrightness(timeFrom1: string, brightness1: number, timeFrom2: string, brightness2: number): Promise<void>;
	getBrightness(): Promise<IBrightness>;
	takeAndUploadScreenshot(uploadBaseUrl: string): Promise<string>;
	powerOn(): Promise<void>;
	powerOff(): Promise<void>;
	isPoweredOn(): Promise<boolean>;
}

export default class ManagementScreenCommands implements IManagementScreen {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async resize(
		baseUrl: string,
		orientation: string,
		resolution: string,
		currentVersion: string,
		videoOrientation?: string | undefined,
	): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementScreenResizeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenResizeRequest,
				baseUrl,
				orientation,
				resolution,
				currentVersion,
				videoOrientation,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenResizeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenResizeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async getOrientation(): Promise<IOrientation> {
		const command = await this.appletCommandManagement.send<ManagementScreenGetOrientationRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenGetOrientationRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenGetOrientationResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenGetOrientationResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async setBrightness(timeFrom1: string, brightness1: number, timeFrom2: string, brightness2: number): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementScreenSetBrightnessRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenSetBrightnessRequest,
				timeFrom1,
				brightness1,
				timeFrom2,
				brightness2,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenSetBrightnessResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenSetBrightnessResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async getBrightness(): Promise<IBrightness> {
		const command = await this.appletCommandManagement.send<ManagementScreenGetBrightnessRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenGetBrightnessRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenGetBrightnessResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenGetBrightnessResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async takeAndUploadScreenshot(uploadBaseUrl: string): Promise<string> {
		const command = await this.appletCommandManagement.send<ManagementScreenTakeScreenshotRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenTakeScreenshotRequest,
				uploadBaseUrl,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenTakeScreenshotResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenTakeScreenshotResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async powerOn(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementScreenPowerOnRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenPowerOnRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenPowerOnResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenPowerOnResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async powerOff(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementScreenPowerOffRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenPowerOffRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenPowerOffResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenPowerOffResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async isPoweredOn(): Promise<boolean> {
		const command = await this.appletCommandManagement.send<ManagementScreenIsPoweredOnRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementScreenIsPoweredOnRequest,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<ManagementScreenIsPoweredOnResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementScreenIsPoweredOnResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
