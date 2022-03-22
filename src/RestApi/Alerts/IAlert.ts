
export default interface IAlert {
	alertUid: string;
	organizationUid: string;
	description: string;
	alertRuleUid: string;
	createdAt: Date;
	archivedAt: Date | null;
	deviceUids: string[];
	latelyChangedAt: Date;
	snoozeRule: {
		type: string;
		snoozedUntil: Date;
	} | null;
}

export type AlertType = 'DEVICE' | 'POLICY' | 'APPLET';

export interface IAlertCreatable {
	name: string;
	organizationUid: string;
	description: string;
	alertRuleUid: string;
}

export interface AlertSnooze {
	alertUid: string;
	snoozeRule: SnoozeRule;
}

interface DateTimeSnoozeRule {
	type: 'datetime';
	snoozedUntil: Date | string;
}

interface UpdateSnoozeRule {
	type: 'update';
	occurrencesDiff: number;
}

declare type SnoozeRule = DateTimeSnoozeRule | UpdateSnoozeRule;
