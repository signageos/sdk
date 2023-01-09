export type ITelemetryConfigurationCheckIntervals = {
	/** interval of period in milliseconds */
	[intervalType in TelemetryConfigurationCheckInterval]: number;
};

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
