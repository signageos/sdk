import TimingCommandManagement from '../../Command/TimingCommandManagement';
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
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async resize(
		baseUrl: string,
		orientation: string,
		resolution: string,
		currentVersion: string,
		videoOrientation?: string | undefined,
	): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementScreenResizeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
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
			const results = await this.timingCommandManagement.getList<ManagementScreenResizeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenResizeResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async getOrientation(): Promise<IOrientation> {
		const command = await this.timingCommandManagement.create<ManagementScreenGetOrientationRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenGetOrientationRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenGetOrientationResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenGetOrientationResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async setBrightness(timeFrom1: string, brightness1: number, timeFrom2: string, brightness2: number): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementScreenSetBrightnessRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenSetBrightnessRequest,
				timeFrom1,
				brightness1,
				timeFrom2,
				brightness2,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenSetBrightnessResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenSetBrightnessResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async getBrightness(): Promise<IBrightness> {
		const command = await this.timingCommandManagement.create<ManagementScreenGetBrightnessRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenGetBrightnessRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenGetBrightnessResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenGetBrightnessResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async takeAndUploadScreenshot(uploadBaseUrl: string): Promise<string> {
		const command = await this.timingCommandManagement.create<ManagementScreenTakeScreenshotRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenTakeScreenshotRequest,
				uploadBaseUrl,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenTakeScreenshotResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenTakeScreenshotResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async powerOn(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementScreenPowerOnRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenPowerOnRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenPowerOnResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenPowerOnResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async powerOff(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementScreenPowerOffRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenPowerOffRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenPowerOffResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenPowerOffResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async isPoweredOn(): Promise<boolean> {
		const command = await this.timingCommandManagement.create<ManagementScreenIsPoweredOnRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementScreenIsPoweredOnRequest,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<ManagementScreenIsPoweredOnResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementScreenIsPoweredOnResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
