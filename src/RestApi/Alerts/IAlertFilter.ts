export default interface IAlertFilter {
	pagination?: string;
	createdUntil?: string;
	until?: Date;
	archived?: boolean;
	snoozed?: boolean;
}
