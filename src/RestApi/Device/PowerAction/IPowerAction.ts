export enum DevicePowerAction {
	SystemReboot = 'SYSTEM_REBOOT',
	DisplayPowerOn = 'DISPLAY_POWER_ON',
	DisplayPowerOff = 'DISPLAY_POWER_OFF',
	AppRestart = 'APP_RESTART',
	AppletDisable = 'APPLET_DISABLE',
	AppletEnable = 'APPLET_ENABLE',
	AppletReload = 'APPLET_RELOAD',
	AppletRefresh = 'APPLET_REFRESH',
}

export interface IPowerActionUpdatable {
	devicePowerAction: DevicePowerAction;
}

export interface IPowerAction {
	uid: string;
	deviceUid: string;
	powerType: DevicePowerAction;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IPowerAction;
