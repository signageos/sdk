import { DeviceActionType, Orientation, VideoOrientation } from '../../../../src/RestApi/BulkOperation/BulkOperation.enums';
import { LogData } from '../../../../src/RestApi/BulkOperation/BulkOperation.types';
import { SocketDriver } from '../../../../src/RestApi/V2/Device/Device';
import { FinishEventType } from '../../../../src/RestApi/Timing/Timing.types';
import { InputSource } from '../../../../src/RestApi/Device/InputSource';

export const LogDataMock: LogData = {
	[DeviceActionType.SET_APPLICATION_VERSION]: {
		applicationType: 'tizen',
		version: 'testingVersion',
	},
	[DeviceActionType.SET_VOLUME]: {
		volume: 10,
	},
	[DeviceActionType.SET_BRIGHTNESS]: {
		brightness1: 10,
		brightness2: 15,
		timeFrom1: '10:00:00',
		timeFrom2: '11:00:00',
	},
	[DeviceActionType.RECONNECT]: {},
	[DeviceActionType.UPDATE_CONFIGURATION]: {
		platformUri: 'testingPLatformUri',
		staticBaseUrl: 'testingStaticBaseUrl',
		uploadBaseUrl: 'testingUploadBaseUrl',
		weinreUri: 'testingWeinreUri',
		extendedManagementUrl: 'testingManagementUrl',
		socketDriver: SocketDriver.Websocket,
	},
	[DeviceActionType.UPDATE_TIME]: {
		timestamp: 10000000,
		timezone: 'Africa/Accra',
		ntpServer: 'testingNtpServer',
	},
	[DeviceActionType.SET_DEBUG]: {
		appletEnabled: false,
		nativeEnabled: true,
	},
	[DeviceActionType.SET_FIRMWARE_VERSION]: {
		version: 'testingVersion',
	},
	[DeviceActionType.INSTALL_PACKAGE]: {
		packageName: 'testingPackageName',
		applicationType: 'tizen',
		buildHash: 'testingBuildHash',
		version: 'testingVersion',
		build: 'testingBuild',
	},
	[DeviceActionType.INSTALL_PACKAGE_FROM_URI]: {
		packageUri: 'testingpackageUri',
	},
	[DeviceActionType.UNINSTALL_PACKAGE]: {
		packageName: 'testingPackageName',
		applicationType: 'tizen',
		specs: {
			someField: 'someValue',
		},
	},
	[DeviceActionType.POWER_ACTION]: {
		powerType: 'APP_RESTART',
	},
	[DeviceActionType.SET_SCHEDULED_POWER_ACTION]: {
		powerType: 'APP_RESTART',
		weekdays: ['sun'],
		time: '10:00:00',
	},
	[DeviceActionType.CANCEL_SCHEDULED_POWER_ACTION]: {
		scheduledPowerActionUid: 'testingPowerActionUid',
	},
	[DeviceActionType.SET_REMOTE_CONTROL]: {
		enabled: true,
	},
	[DeviceActionType.RESIZE]: {
		resolution: {
			width: 100,
			height: 100,
			framerate: 100,
		},
		orientation: Orientation.LANDSCAPE,
		videoOrientation: VideoOrientation.LANDSCAPE,
	},
	[DeviceActionType.PROVISION]: {
		verificationHash: 'testingVerificationHash',
	},
	[DeviceActionType.DEPROVISION]: {
		verificationHash: 'testingVerificationHash',
	},
	[DeviceActionType.UPDATE_NAME]: {
		name: 'testingName',
	},
	[DeviceActionType.BAN]: {},
	[DeviceActionType.APPROVE]: {},
	[DeviceActionType.CHANGE_SUBSCRIPTION_TYPE]: {
		subscriptionType: 'basic',
	},
	[DeviceActionType.CREATE_TIMING]: {
		appletUid: 'testingAppletUid',
		appletVersion: 'testingAppletVersion',
		startsAt: new Date(100000),
		endsAt: new Date(100000),
		configuration: {
			someField: 'someValue,',
		},
		finishEvent: {
			type: FinishEventType.DURATION,
			data: {
				someField: 'someValue,',
				deviceIdentityHash: 'testingHash',
				type: '',
			},
		},
		position: 10,
	},
	[DeviceActionType.UPDATE_TIMING]: {
		appletUid: 'testingAppletUid',
		appletVersion: 'testingAppletVersion',
		startsAt: new Date(100000),
		endsAt: new Date(100000),
		configuration: {
			someField: 'someValue,',
		},
		configurationSet: {
			someField: 'someValue,',
		},
		configurationRemoveKeys: ['someFiled'],
		finishEvent: {
			type: FinishEventType.DURATION,
			data: {
				someField: 'someValue,',
				deviceIdentityHash: 'testingHash',
				type: '',
			},
		},
		position: 10,
	},
	[DeviceActionType.DELETE_TIMING]: {
		uid: 'testingUid',
		appletUid: 'testingAppletUid',
		appletVersion: 'testingAppletVersion',
	},
	[DeviceActionType.SET_DEVICE_APPLET_TEST_SUITE]: {
		appletUid: 'testingAppletUid',
		appletVersion: 'testingAppletVersion',
		tests: ['default'],
	},
	[DeviceActionType.SET_TEST_SUITE]: {
		tests: ['default'],
	},
	[DeviceActionType.START_PACKAGE]: {
		packageName: 'testingPackageName',
		applicationType: 'tizen',
	},
	[DeviceActionType.SET_TIMER]: {
		type: 'TIMER_3',
		volume: 10,
		weekdays: ['sun'],
		timeOn: null,
		timeOff: null,
	},
	[DeviceActionType.SET_PROPRIETARY_TIMER]: {
		type: 'TIMER_3',
		volume: 10,
		weekdays: ['sun'],
		timeOn: null,
		timeOff: null,
	},
	[DeviceActionType.SET_POWER_STATUS]: {
		turnedOn: true,
	},
	[DeviceActionType.SET_INPUT_SOURCE]: {
		inputSource: InputSource.URL_LAUNCHER,
	},
	[DeviceActionType.SET_DISPLAY_BACKLIGHT]: {
		/** Value in range 0-100 */
		backlight: 10,
	},
	[DeviceActionType.SET_DISPLAY_CONTRAST]: {
		/** Value in range 0-100 */
		contrast: 10,
	},
	[DeviceActionType.SET_DISPLAY_SHARPNESS]: {
		/** Value in range 0-100 */
		sharpness: 10,
	},
	[DeviceActionType.SET_DISPLAY_TEMPERATURE_CONTROL]: {
		/** Maximum temperature while display is keeping turned on. Otherwise, it's usually turned of or switched to power saving mode */
		maxTemperature: 10,
	},
	[DeviceActionType.SET_REMOTE_DESKTOP]: {
		enabled: true,
		/** URL where the remote desktop will be available (usually for limited amount of time) */
		remoteDesktopUri: 'testingRemoteDesktopUri',
	},
	[DeviceActionType.SET_POLICY]: {
		policyUid: 'testingPolicyUid',
		priority: 1,
	},
	[DeviceActionType.DELETE_POLICY]: {
		policyUid: 'testingPolicyUid',
	},
	[DeviceActionType.SET_ORGANIZATION_TAGS]: {
		deviceIdentityHash: 'testingHash',
		tagUids: ['tagUid'],
	},
	[DeviceActionType.DELETE_ORGANIZATION_TAGS]: {
		deviceIdentityHash: 'testingDeviceIdentityHash',
		tagUids: ['tagUid'],
	},
	[DeviceActionType.SET_ORGANIZATION]: {
		organizationUid: 'testingOrganizationUid',
	},
	[DeviceActionType.SET_PEER_RECOVERY]: {
		enabled: true,
	},
	[DeviceActionType.SET_AUTO_RECOVERY]: {
		enabled: true,
		healthcheckIntervalMs: 1000,
	},
	[DeviceActionType.ENABLE_EXTENDED_TELEMETRY]: {
		deviceIdentityHash: 'testingDeviceIdentityHash',
		duration: 60000,
	},
	[DeviceActionType.DISABLE_EXTENDED_TELEMETRY]: {
		deviceIdentityHash: 'testingDeviceIdentityHash',
	},
	[DeviceActionType.TELEMETRY_INTERVALS]: {
		deviceIdentityHash: 'testingDeviceIdentityHash',
		telemetryCheckIntervals: {
			volume: 120000,
			brightness: 150000,
		},
	},
};
