import { InputSource } from '../Device/InputSource';
import { TResolutionItem } from '../Device/Resolution/IDeviceResolution';
import { ApplicationType, DeviceActionType, Orientation, VideoOrientation } from './enums';

export interface IConfigValues {
	platformUri?: string | null;
	staticBaseUrl?: string | null;
	uploadBaseUrl?: string | null;
	weinreUri?: string | null;
	extendedManagementUrl?: string | null;
	socketDriver?: string | null;
}

export interface ITimer {
	type: string;
	volume: number;
	weekdays: string[];
	timeOn: string | null;
	timeOff: string | null;
}

export interface DateFormat {
	timestamp: number;
	/** specified in minutes */
	timeZoneOffset: number;
}

export type LogData = {
	[DeviceActionType.SET_APPLICATION_VERSION]: {
		applicationType: ApplicationType;
		version: string;
	};
	[DeviceActionType.SET_VOLUME]: {
		volume: number;
	};
	[DeviceActionType.SET_BRIGHTNESS]: {
		brightness1: number;
		brightness2: number;
		timeFrom1: string;
		timeFrom2: string;
	};
	[DeviceActionType.RECONNECT]: Record<string, never>;
	[DeviceActionType.UPDATE_CONFIGURATION]: IConfigValues;
	[DeviceActionType.UPDATE_TIME]: {
		timestamp: number;
		timezone: string | null;
		ntpServer?: string;
	};
	[DeviceActionType.SET_DEBUG]: {
		appletEnabled: boolean;
		nativeEnabled: boolean;
	};
	[DeviceActionType.SET_FIRMWARE_VERSION]: {
		version: string;
	};
	[DeviceActionType.INSTALL_PACKAGE]: {
		packageName: string;
		applicationType: ApplicationType;
		buildHash: string;
		version: string;
		build: string | null;
	};
	[DeviceActionType.INSTALL_PACKAGE_FROM_URI]: {
		packageUri: string;
	};
	[DeviceActionType.UNINSTALL_PACKAGE]: {
		packageName: string;
		applicationType: ApplicationType;
		specs: Record<string, unknown>;
	};
	[DeviceActionType.POWER_ACTION]: {
		powerType: string;
	};
	[DeviceActionType.SET_SCHEDULED_POWER_ACTION]: {
		powerType: string;
		weekdays: string[];
		time: string;
	};
	[DeviceActionType.CANCEL_SCHEDULED_POWER_ACTION]: {
		scheduledPowerActionUid: string;
	};
	[DeviceActionType.SET_REMOTE_CONTROL]: {
		enabled: boolean;
	};
	[DeviceActionType.RESIZE]: {
		resolution: TResolutionItem;
		orientation: Orientation;
		videoOrientation?: VideoOrientation;
	};
	[DeviceActionType.PROVISION]: {
		verificationHash: string;
	};
	[DeviceActionType.DEPROVISION]: {
		verificationHash: string;
	};
	[DeviceActionType.UPDATE_NAME]: {
		name: string;
	};
	[DeviceActionType.BAN]: Record<string, never>;
	[DeviceActionType.APPROVE]: Record<string, never>;
	[DeviceActionType.CHANGE_SUBSCRIPTION_TYPE]: {
		subscriptionType: string | null;
	};
	[DeviceActionType.CREATE_TIMING]: {
		appletUid: string;
		appletVersion: string;
		startsAt: Date;
		endsAt: Date;
		configuration: Record<string, unknown>;
		finishEvent: {
			type: 'DURATION' | 'IDLE_TIMEOUT' | 'SCREEN_TAP';
			data?: any;
		};
		position: number;
	};
	[DeviceActionType.UPDATE_TIMING]: {
		appletUid: string;
		appletVersion: string | undefined;
		startsAt: Date | undefined;
		endsAt: Date | undefined;
		configuration: Record<string, unknown> | undefined;
		finishEvent: {
			type: 'DURATION' | 'IDLE_TIMEOUT' | 'SCREEN_TAP' | undefined;
			data?: any | undefined;
		} | undefined;
		position: number | undefined;
	};
	[DeviceActionType.DELETE_TIMING]: {
		appletUid: string;
		appletVersion: string | undefined;
	};
	[DeviceActionType.SET_DEVICE_APPLET_TEST_SUITE]: {
		appletUid: string;
		appletVersion: string;
		tests: string[];
	};
	[DeviceActionType.SET_TEST_SUITE]: Record<string, never>;
	[DeviceActionType.START_PACKAGE]: {
		packageName: string;
		applicationType: ApplicationType;
	};
	[DeviceActionType.SET_TIMER]: ITimer;
	[DeviceActionType.SET_PROPRIETARY_TIMER]: ITimer;
	[DeviceActionType.SET_POWER_STATUS]: {
		turnedOn: boolean;
	};
	[DeviceActionType.SET_INPUT_SOURCE]: {
		inputSource: InputSource;
	};
	[DeviceActionType.SET_DISPLAY_BACKLIGHT]: {
		/** Value in range 0-100 */
		backlight: number;
	};
	[DeviceActionType.SET_DISPLAY_CONTRAST]: {
		/** Value in range 0-100 */
		contrast: number;
	};
	[DeviceActionType.SET_DISPLAY_SHARPNESS]: {
		/** Value in range 0-100 */
		sharpness: number;
	};
	[DeviceActionType.SET_DISPLAY_TEMPERATURE_CONTROL]: {
		/** Maximum temperature while display is keeping turned on. Otherwise, it's usually turned of or switched to power saving mode */
		maxTemperature: number;
	};
	[DeviceActionType.SET_REMOTE_DESKTOP]: {
		enabled: boolean;
		/** URL where the remote desktop will be available (usually for limited amount of time) */
		remoteDesktopUri?: string;
	};
	[DeviceActionType.SET_POLICY]: {
		policyUid: string;
		priority: number;
	};
	[DeviceActionType.DELETE_POLICY]: {
		policyUid: string;
	};
	[DeviceActionType.SET_ORGANIZATION_TAGS]: {
		deviceIdentityHash: string;
		tagUids: string[];
	};
	[DeviceActionType.DELETE_ORGANIZATION_TAGS]: {
		deviceIdentityHash: string;
		tagUids: string[];
	};
	[DeviceActionType.SET_ORGANIZATION]: {
		organizationUid: string;
	};
};

export interface IFilter {
	identityHash?: string;
	identityHashes?: string[];
	identityHashesExclude?: string[];
	uids?: string[];
	uidsExclude?: string[];
	duids?: string[];
	duidsExclude?: string[];
	accountId?: number;
	organizationUid?: string;
	applicationType?: string;
	applicationTypeNotEqual?: string;
	model?: string;
	firmwareVersion?: string;
	search?: string;
	minStorageStatusPercentage?: number;
	maxStorageStatusPercentage?: number;
	bannedSince?: Date;
	tagUids?: string[];
	policyUids?: string[];
	createdSince?: Date;
	createdUntil?: Date;
	/**
	 * If filter is enabled using threshold value in milliseconds,
	 * it filter in only devices with deviceInfo.currentTime.timestamp
	 * in range of threshold before and after comparing to deviceInfo.currentTime.updatedAt.
	 * Additionally, it filter in devices with mismatched timezone compared to the last updated timezone from deviceActionLog.
	 * This filter drastically decrease performance of fetch due to absence of indexes and joining collections.
	 */
	onlyWithTimeOutOfThresholdMs?: number;
	filterModelName?: string;
}

export interface IDeviceUids {
	uid: string;
	identityHash: string;
}

export interface IRollingUpdate {
	batchSize: number;
	/** time in ms */
	batchDelay?: number;
	/** How many devices is allowed to fail bulk operation, value in % */
	stopThreshold?: number;
}
