export interface ITimingCreateOnly {
	deviceUid: string;
	appletUid: string;
}

export interface ITimingUpdatable {
	appletVersion: string;
	startsAt: Date;
	endsAt: Date;
	configuration: {
		identification?: string;
		[optionName: string]: any;
	};
	position: number;
	finishEvent: {
		type: 'DURATION' | 'SCREEN_TAP' | 'IDLE_TIMEOUT';
		data: any;
	};
}

export interface ITimingReadOnly {
	uid: string;
	createdAt: Date;
	updatedAt: Date;
}

interface ITiming extends ITimingCreateOnly, ITimingUpdatable, ITimingReadOnly {}

export default ITiming;
