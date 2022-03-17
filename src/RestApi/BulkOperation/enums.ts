export enum DeviceActionType {
	SET_APPLICATION_VERSION = 'SET_APPLICATION_VERSION',
	SET_VOLUME = 'SET_VOLUME',
	SET_BRIGHTNESS = 'SET_BRIGHTNESS',
	RECONNECT = 'RECONNECT',
	UPDATE_CONFIGURATION = 'UPDATE_CONFIGURATION',
	UPDATE_TIME = 'UPDATE_TIME',
	SET_DEBUG = 'SET_DEBUG',
	SET_FIRMWARE_VERSION = 'SET_FIRMWARE_VERSION',
	INSTALL_PACKAGE = 'INSTALL_PACKAGE',
	INSTALL_PACKAGE_FROM_URI = 'INSTALL_PACKAGE_FROM_URI',
	UNINSTALL_PACKAGE = 'UNINSTALL_PACKAGE',
	POWER_ACTION = 'POWER_ACTION',
	SET_SCHEDULED_POWER_ACTION = 'SET_SCHEDULED_POWER_ACTION',
	CANCEL_SCHEDULED_POWER_ACTION = 'CANCEL_SCHEDULED_POWER_ACTION',
	SET_REMOTE_CONTROL = 'SET_REMOTE_CONTROL',
	RESIZE = 'RESIZE',
	PROVISION = 'PROVISION',
	DEPROVISION = 'DEPROVISION',
	UPDATE_NAME = 'UPDATE_NAME',
	BAN = 'BAN',
	APPROVE = 'APPROVE',
	CHANGE_SUBSCRIPTION_TYPE = 'CHANGE_SUBSCRIPTION_TYPE',
	CREATE_TIMING = 'CREATE_TIMING',
	UPDATE_TIMING = 'UPDATE_TIMING',
	DELETE_TIMING = 'DELETE_TIMING',
	SET_POLICY = 'SET_POLICY',
	DELETE_POLICY = 'DELETE_POLICY',
	SET_ORGANIZATION_TAGS = 'SET_ORGANIZATION_TAGS',
	DELETE_ORGANIZATION_TAGS = 'DELETE_ORGANIZATION_TAGS',
	SET_ORGANIZATION = 'SET_ORGANIZATION',
	SET_DEVICE_APPLET_TEST_SUITE = 'SET_DEVICE_APPLET_TEST_SUITE', // aka START_DEVICE_APPLET_TEST_SUITE
	SET_TEST_SUITE = 'SET_TEST_SUITE', // aka START_TEST_SUITE
	START_PACKAGE = 'START_PACKAGE',
	SET_TIMER = 'SET_TIMER',
	SET_PROPRIETARY_TIMER = 'SET_PROPRIETARY_TIMER',
	SET_POWER_STATUS = 'SET_POWER_STATUS',
	SET_INPUT_SOURCE = 'SET_INPUT_SOURCE',
	SET_DISPLAY_BACKLIGHT = 'SET_DISPLAY_BACKLIGHT',
	SET_DISPLAY_CONTRAST = 'SET_DISPLAY_CONTRAST',
	SET_DISPLAY_SHARPNESS = 'SET_DISPLAY_SHARPNESS',
	SET_DISPLAY_TEMPERATURE_CONTROL = 'SET_DISPLAY_TEMPERATURE_CONTROL',
	SET_REMOTE_DESKTOP = 'SET_REMOTE_DESKTOP',
}

export const ApplicationTypes = [
	'sssp',
	'tizen',
	'webos',
	'android',
	'chrome',
	'brightsign',
	'linux',
	'windows',
	'default',
] as const;

export type ApplicationType = typeof ApplicationTypes[number];

export enum InputSource {
	URL_LAUNCHER = 'urlLauncher',
	HDMI1 = 'hdmi1',
	HDMI2 = 'hdmi2',
	HDMI3 = 'hdmi3',
	HDMI4 = 'hdmi4',
}

export enum Orientation {
	PORTRAIT = 'PORTRAIT',
	LANDSCAPE = 'LANDSCAPE',
	PORTRAIT_FLIPPED = 'PORTRAIT_FLIPPED',
	LANDSCAPE_FLIPPED = 'LANDSCAPE_FLIPPED',
	AUTO = 'AUTO',
}

export enum VideoOrientation {
	LANDSCAPE = 'LANDSCAPE',
	LANDSCAPE_FLIPPED = 'LANDSCAPE_FLIPPED',
}