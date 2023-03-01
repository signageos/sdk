import { InputSource } from '../Device/InputSource';
import { ApplicationType, DeviceActionType, Orientation, VideoOrientation } from './BulkOperation.enums';
import { ResolutionItem } from '../Device/IDevice';
import { FinishEventType } from '../Timing/Timing.types';
import { TelemetryCheckIntervals } from '../Device/Monitoring/DeviceMonitoring.types';

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
		// eslint-disable-next-line @typescript-eslint/ban-types
		specs: object;
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
		resolution: ResolutionItem;
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
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		startsAt: Date;
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		endsAt: Date;
		configuration: Record<string, unknown>;
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		finishEvent: {
			type: FinishEventType;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data?: any;
		};
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		position: number;
	};
	[DeviceActionType.UPDATE_TIMING]: {
		appletUid: string;
		appletVersion: string | undefined;
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		startsAt: Date | undefined;
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		endsAt: Date | undefined;
		configuration: Record<string, unknown> | undefined;
		configurationSet: Record<string, unknown> | undefined;
		configurationRemoveKeys: string[] | undefined;
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		finishEvent:
			| {
					type: FinishEventType | undefined;
					data?: any | undefined;
		}
			| undefined;
		/** @deprecated It stays because of backward compatibility and shouldn´t be used anymore in new implementations */
		position: number | undefined;
	};
	[DeviceActionType.DELETE_TIMING]: {
		uid: string;
		appletUid: string;
		appletVersion: string;
	};
	[DeviceActionType.SET_DEVICE_APPLET_TEST_SUITE]: {
		appletUid: string;
		appletVersion: string;
		tests: string[];
	};
	[DeviceActionType.SET_TEST_SUITE]: {
		tests: string[];
	};
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
	[DeviceActionType.SET_AUTO_RECOVERY]:
		| {
				enabled: true;
				/** It defines in miliseconds period whose elapsing leads to mark browser process as unresponding. */
				healthcheckIntervalMs: number;
	}
		| {
				enabled: false;
				/** When specified it defines period until automatic enabling auto recovery process in miliseconds. */
				autoEnableTimeoutMs?: number;
	};
	[DeviceActionType.SET_PEER_RECOVERY]:
		| {
				enabled: true;
	}
		| {
				enabled: false;
				/** When specified it defines period until automatic enabling peer recovery process in miliseconds. */
				autoEnableTimeoutMs?: number;
	};
	[DeviceActionType.ENABLE_EXTENDED_TELEMETRY]: {
		deviceIdentityHash: string;
		duration: number;
	};
	[DeviceActionType.DISABLE_EXTENDED_TELEMETRY]: {
		deviceIdentityHash: string;
	};
	[DeviceActionType.TELEMETRY_INTERVALS]: {
		deviceIdentityHash: string;
		telemetryCheckIntervals: TelemetryCheckIntervals;
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
