export enum TelemetryConfigurationCheckInterval {
	SCREENSHOTS = 'screenshots',
	TEMPERATURE = 'temperature',
	APPLICATION_VERSION = 'applicationVersion',
	FRONT_DISPLAY_VERSION = 'frontDisplayVersion',
	BRIGHTNESS = 'brightness',
	DATETIME = 'datetime',
	DEBUG = 'debug',
	FIRMWARE_VERSION = 'firmwareVersion',
	ORIENTATION = 'orientation',
	POWER_ACTIONS_SCHEDULE = 'powerActionsSchedule',
	PROPRIETARY_TIMERS = 'proprietaryTimers',
	REMOTE_CONTROL = 'remoteControl',
	RESOLUTION = 'resolution',
	TIMERS = 'timers',
	VOLUME = 'volume',
	STORAGE = 'storage',
	BATTERY = 'battery',
	POLICY = 'policy',
	PEER_RECOVERY = 'peerRecovery',
	AUTO_RECOVERY = 'autoRecovery',
	DEFAULT = 'default',
}

export type TelemetryCheckIntervals = {
	[TelemetryConfigurationCheckInterval.SCREENSHOTS]?: number;
	[TelemetryConfigurationCheckInterval.TEMPERATURE]?: number;
	[TelemetryConfigurationCheckInterval.APPLICATION_VERSION]?: number;
	[TelemetryConfigurationCheckInterval.FRONT_DISPLAY_VERSION]?: number;
	[TelemetryConfigurationCheckInterval.BRIGHTNESS]?: number;
	[TelemetryConfigurationCheckInterval.DATETIME]?: number;
	[TelemetryConfigurationCheckInterval.DEBUG]?: number;
	[TelemetryConfigurationCheckInterval.FIRMWARE_VERSION]?: number;
	[TelemetryConfigurationCheckInterval.ORIENTATION]?: number;
	[TelemetryConfigurationCheckInterval.POWER_ACTIONS_SCHEDULE]?: number;
	[TelemetryConfigurationCheckInterval.PROPRIETARY_TIMERS]?: number;
	[TelemetryConfigurationCheckInterval.REMOTE_CONTROL]?: number;
	[TelemetryConfigurationCheckInterval.RESOLUTION]?: number;
	[TelemetryConfigurationCheckInterval.TIMERS]?: number;
	[TelemetryConfigurationCheckInterval.VOLUME]?: number;
	[TelemetryConfigurationCheckInterval.STORAGE]?: number;
	[TelemetryConfigurationCheckInterval.BATTERY]?: number;
	[TelemetryConfigurationCheckInterval.POLICY]?: number;
	[TelemetryConfigurationCheckInterval.PEER_RECOVERY]?: number;
	[TelemetryConfigurationCheckInterval.AUTO_RECOVERY]?: number;
	[TelemetryConfigurationCheckInterval.DEFAULT]?: number;
};
