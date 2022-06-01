import { TResolutionItem, DeviceOrientation, DeviceVideoOrientation } from '../Resolution/IDeviceResolution';
import { InputSource } from '../InputSource';

enum Weekday {
	SUNDAY = 'SUNDAY',
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
}

enum TimerType {
	TIMER_1 = 'TIMER_1',
	TIMER_2 = 'TIMER_2',
	TIMER_3 = 'TIMER_3',
	TIMER_4 = 'TIMER_4',
	TIMER_5 = 'TIMER_5',
	TIMER_6 = 'TIMER_6',
	TIMER_7 = 'TIMER_7',
}

enum PowerActionType {
	APP_RESTART = 'APP_RESTART',
	SYSTEM_REBOOT = 'SYSTEM_REBOOT',
	APPLET_RELOAD = 'APPLET_RELOAD',
	APPLET_REFRESH = 'APPLET_REFRESH',
	DISPLAY_POWER_ON = 'DISPLAY_POWER_ON',
	DISPLAY_POWER_OFF = 'DISPLAY_POWER_OFF',
	BACKUP_RESTART = 'BACKUP_RESTART',
	APPLET_ENABLE = 'APPLET_ENABLE',
	APPLET_DISABLE = 'APPLET_DISABLE',
}

interface ITimerSettings {
	type: TimerType;
	timeOn: string | null;
	timeOff: string | null;
	weekdays: Weekday[];
	volume: number;
}

interface IPowerActionsScheduleSettings {
	uid: string;
	powerType: PowerActionType;
	weekdays: Weekday[];
	time: string;
}

export enum DeviceTelemetryType {
	DISPLAY_SETTING = 'DISPLAY_SETTING',
	INPUT_SOURCE = 'INPUT_SOURCE',
	VOLUME = 'VOLUME',
	BRIGHTNESS = 'BRIGHTNESS',
	TIMERS = 'TIMERS',
	PROPRIETARY_TIMERS = 'PROPRIETARY_TIMERS',
	RESOLUTION = 'RESOLUTION',
	ORIENTATION = 'ORIENTATION',
	REMOTE_CONTROL = 'REMOTE_CONTROL',
	APPLICATION_VERSION = 'APPLICATION_VERSION',
	FIRMWARE_VERSION = 'FIRMWARE_VERSION',
	DEBUG = 'DEBUG',
	DATETIME = 'DATETIME',
	POWER_ACTIONS_SCHEDULE = 'POWER_ACTIONS_SCHEDULE',
	TEMPERATURE = 'TEMPERATURE',
	OFFLINE_RANGE = 'OFFLINE_RANGE',
	ONLINE_STATUS = 'ONLINE_STATUS',
	BUNDLED_APPLET = 'BUNDLED_APPLET',
}

export type LogData = {
	[DeviceTelemetryType.DISPLAY_SETTING]: {
		backlight: number;
		contrast: number;
		sharpness: number;
		maxTemperature: number;
	};
	[DeviceTelemetryType.INPUT_SOURCE]: {
		/**
		 * It may be arbitrary platform-dependent string but common values are listed in enumeration.
		 */
		inputSource: InputSource | string;
	};
	[DeviceTelemetryType.VOLUME]: {
		volume: number;
	};
	[DeviceTelemetryType.BRIGHTNESS]: {
		brightness: number;
	};
	[DeviceTelemetryType.TIMERS]: ITimerSettings[];
	[DeviceTelemetryType.PROPRIETARY_TIMERS]: ITimerSettings[];
	[DeviceTelemetryType.RESOLUTION]: TResolutionItem;
	[DeviceTelemetryType.ORIENTATION]: {
		orientation: DeviceOrientation;
		videoOrientation?: DeviceVideoOrientation;
	};
	[DeviceTelemetryType.REMOTE_CONTROL]: {
		enabled: boolean;
	};
	[DeviceTelemetryType.APPLICATION_VERSION]: {
		version: string;
		/** @deprecated It's only available in mongodb database for filtering purposes */
		versionNumber?: number;
	};
	[DeviceTelemetryType.FIRMWARE_VERSION]: {
		version: string;
	};
	[DeviceTelemetryType.DEBUG]: {
		appletEnabled: boolean;
		nativeEnabled: boolean;
	};
	[DeviceTelemetryType.DATETIME]: {
		timezone: string | null;
		ntpServer: string | null;
	};
	[DeviceTelemetryType.POWER_ACTIONS_SCHEDULE]: IPowerActionsScheduleSettings[];
	[DeviceTelemetryType.TEMPERATURE]: {
		temperature: number;
	};
	[DeviceTelemetryType.OFFLINE_RANGE]: {
		since: Date;
		until: Date;
	};
	[DeviceTelemetryType.ONLINE_STATUS]: {
		online: boolean;
	};
	[DeviceTelemetryType.BUNDLED_APPLET]: {
		appletUid: string;
		appletVersion: string;
		config: {
			[key: string]: string;
		};
	};
};

export default interface IDeviceTelemetry {
	deviceUid: string;
	type: DeviceTelemetryType;
	updatedAt: Date;
	// TODO: More strict data type for each telemetry type
	data: { [property: string]: any } | null;
}
