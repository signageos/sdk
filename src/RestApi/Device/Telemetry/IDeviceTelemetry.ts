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

export enum ManagementCapabilities {
	MODEL = 'MODEL',
	SERIAL_NUMBER = 'SERIAL_NUMBER',
	BRAND = 'BRAND',
	OS_VERSION = 'OS_VERSION',
	BATTERY_STATUS = 'BATTERY_STATUS',
	STORAGE_UNITS = 'STORAGE_UNITS',
	TEMPERATURE = 'TEMPERATURE',
	SCREENSHOT_UPLOAD = 'SCREENSHOT_UPLOAD',
	NETWORK_INFO = 'NETWORK_INFO',
	WIFI = 'WIFI',
	WIFI_SCAN = 'WIFI_SCAN',
	WIFI_AP = 'WIFI_AP',
	WIFI_STRENGTH = 'WIFI_STRENGTH',
	TIMERS_PROPRIETARY = 'TIMERS_PROPRIETARY',
	BRIGHTNESS_SCHEDULING = 'BRIGHTNESS_SCHEDULING',
	TIMERS_NATIVE = 'TIMERS_NATIVE',
	SET_BRIGHTNESS = 'SET_BRIGHTNESS',
	GET_BRIGHTNESS = 'GET_BRIGHTNESS',
	SCREEN_RESIZE = 'SCREEN_RESIZE',
	SET_TIME = 'SET_TIME',
	SET_TIMEZONE = 'SET_TIMEZONE',
	GET_TIMEZONE = 'GET_TIMEZONE',
	NTP_TIME = 'NTP_TIME',
	APP_UPGRADE = 'APP_UPGRADE',
	FIRMWARE_UPGRADE = 'FIRMWARE_UPGRADE',
	PACKAGE_INSTALL = 'PACKAGE_INSTALL',
	SET_VOLUME = 'SET_VOLUME',
	GET_VOLUME = 'GET_VOLUME',
	SET_REMOTE_CONTROL_ENABLED = 'SET_REMOTE_CONTROL_ENABLED',
	SET_DEBUG = 'SET_DEBUG',
	SYSTEM_REBOOT = 'SYSTEM_REBOOT',
	APP_RESTART = 'APP_RESTART',
	DISPLAY_POWER = 'DISPLAY_POWER',
	SERVLET = 'SERVLET',
	HARDWARE_LED_SET_COLOR = 'HARDWARE_LED_SET_COLOR',
	PROXIMITY_SENSOR = 'PROXIMITY_SENSOR',
	FACTORY_RESET = 'FACTORY_RESET',
	ORIENTATION_LANDSCAPE = 'ORIENTATION_LANDSCAPE',
	ORIENTATION_PORTRAIT = 'ORIENTATION_PORTRAIT',
	ORIENTATION_LANDSCAPE_FLIPPED = 'ORIENTATION_LANDSCAPE_FLIPPED',
	ORIENTATION_PORTRAIT_FLIPPED = 'ORIENTATION_PORTRAIT_FLIPPED',
	ORIENTATION_AUTO = 'ORIENTATION_AUTO',
	SCHEDULE_POWER_ACTION = 'SCHEDULE_POWER_ACTION',
	EXTENDED_MANAGEMENT = 'EXTENDED_MANAGEMENT',
	SYSTEM_CPU = 'SYSTEM_CPU',
	SYSTEM_MEMORY = 'SYSTEM_MEMORY',
	PROXY = 'PROXY',
	AUTO_RECOVERY = 'AUTO_RECOVERY',
	PEER_RECOVERY = 'PEER_RECOVERY',
	FILE_SYSTEM_WIPEOUT = 'FILE_SYSTEM_WIPEOUT',
	REMOTE_DESKTOP = 'REMOTE_DESKTOP',
}

export enum FrontCapabilities {
	FILE_SYSTEM_INTERNAL_STORAGE = 'FILE_SYSTEM_INTERNAL_STORAGE',
	FILE_SYSTEM_EXTERNAL_STORAGE = 'FILE_SYSTEM_EXTERNAL_STORAGE',
	FILE_SYSTEM_FILE_CHECKSUM = 'FILE_SYSTEM_FILE_CHECKSUM',
	FILE_SYSTEM_LINK = 'FILE_SYSTEM_LINK',
	TIMERS_PROPRIETARY = 'TIMERS_PROPRIETARY',
	VIDEO_4K = 'VIDEO_4K',
	SERIAL = 'SERIAL',
	BARCODE_SCANNER = 'BARCODE_SCANNER',
	FRONT_OSD = 'FRONT_OSD',
}

export interface IDeviceActionLog {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export enum DeviceTelemetryType {
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
	BUNDLED_APPLET = 'BUNDLED_APPLET',
	AUTO_RECOVERY = 'AUTO_RECOVERY',
	PEER_RECOVERY = 'PEER_RECOVERY',
	PROXY = 'PROXY',
	WIFI_STRENGTH = 'WIFI_STRENGTH',
	FRONT_CAPABILITIES = 'FRONT_CAPABILITIES',
	MANAGEMENT_CAPABILITIES = 'MANAGEMENT_CAPABILITIES',
	DISPLAY_SETTING = 'DISPLAY_SETTING',
	INPUT_SOURCE = 'INPUT_SOURCE',
	FRONT_DISPLAY_VERSION = 'FRONT_DISPLAY_VERSION',
	ONLINE_STATUS = 'ONLINE_STATUS',
	CONNECTION_METHOD = 'CONNECTION_METHOD',
	EXTENDED_MANAGEMENT = 'EXTENDED_MANAGEMENT',
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
	[DeviceTelemetryType.FRONT_DISPLAY_VERSION]: {
		version: string;
		versionNumber: number;
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
	[DeviceTelemetryType.PROXY]: {
		enabled: boolean;
		uri: string | null;
	};
	[DeviceTelemetryType.WIFI_STRENGTH]: {
		strength: number;
	};
	[DeviceTelemetryType.AUTO_RECOVERY]: {
		enabled: true;
		healthcheckIntervalMs: number;
	};
	[DeviceTelemetryType.PEER_RECOVERY]: { enabled: false } | { enabled: true; healthcheckIntervalMs: number };
	[DeviceTelemetryType.MANAGEMENT_CAPABILITIES]: {
		capable: ManagementCapabilities[];
	};
	[DeviceTelemetryType.FRONT_CAPABILITIES]: {
		capable: FrontCapabilities[];
	};
	[DeviceTelemetryType.CONNECTION_METHOD]: 'ws' | 'http' | 'socket.io';
	[DeviceTelemetryType.EXTENDED_MANAGEMENT]: {
		url: string | null;
	};
};

export default interface IDeviceTelemetry {
	deviceUid: string;
	type: DeviceTelemetryType;
	updatedAt: Date;
	// TODO: More strict data type for each telemetry type
	data: { [property: string]: any } | null;
}
