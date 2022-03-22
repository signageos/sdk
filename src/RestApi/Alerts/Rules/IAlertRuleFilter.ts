import { AlertType } from "../IAlert";

export default interface IAlertRuleFilter {
	pagination?: string;
	name?: string;
	alertType?: AlertType;
	archived?: boolean;
	paused?: boolean;
}
