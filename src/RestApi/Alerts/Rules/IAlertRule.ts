import { AlertType } from '../IAlert';
import { ResolutionItem } from '../../Device/IDevice';

export default interface IAlertRule {
	alertRuleUid: string;
	name: string;
	description: string;
	alertType: AlertType | null;
	companyUid: string;
	createdAt: Date;
	archivedAt: Date | string | null;
	pausedAt: Date | string | null;
	filter: unknown | null;
	conditions: unknown | null;
	organizationUids: string[] | null;
	threshold: unknown | null;
	periodicity: unknown | null;
	action: unknown | null;
}

export interface IAlertRuleCreatable {
	name: string;
}

// From common-devices
export declare const ApplicationTypes: readonly [
	'sssp',
	'tizen',
	'webos',
	'android',
	'chrome',
	'brightsign',
	'linux',
	'windows',
	'default',
	'chromeos'
];
declare type ApplicationType = (typeof ApplicationTypes)[number];

export declare type NumericOperator = '>' | '<' | '<=' | '>=' | '=' | '!=';
export declare type SemverOperator = NumericOperator;

export interface AlertFilter {
	applicationType?: ApplicationType;
	applicationVersion?: [SemverOperator, string];
	frontDisplayVersion?: [SemverOperator, string];
	firmwareType?: string;
	firmwareVersion?: string;
	managementPackageVersion?: [SemverOperator, string];
	frontPackageVersion?: [SemverOperator, string];
	tagUids?: string[];
	model?: string;
	name?: string;
	extendedManagement?: boolean;
	provisionedSince?: Date;
	supportedResolutions?: ResolutionItem;
}

export interface IAlertRuleUpdateable {
	name?: string;
	description?: string;
	alertType?: AlertType;
	organizationUids?: string[];
	filter?: AlertFilter;
	conditions?: unknown;
	threshold?: unknown;
	periodicity?: unknown;
	action?: unknown | null;
}
