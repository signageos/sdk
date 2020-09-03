import RestApi from './RestApi/RestApi';
import waitUntilTrue from './Timer/waitUntil';

const parameters = require('../config/parameters');

const INVALID_VALUE = 'not_specified';

export interface IOptions {
	url?: string;
	contentType?: string;
	accountAuth?: {
		accountId: string;
		securityToken: string;
	};
	organizationAuth?: {
		clientId: string;
		secret: string;
	};
	version?: 'v1';
}

export class Api extends RestApi {
	constructor(
		options: IOptions,
	) {
		const accountOptions = {
			url: options.url ?? parameters.apiUrl,
			version: options.version ?? 'v1',
			contentType: options.contentType,
			auth: {
				clientId: options.accountAuth?.accountId ?? INVALID_VALUE,
				secret: options.accountAuth?.securityToken ?? INVALID_VALUE,
			},
		};
		const organizationOptions = {
			url: options.url ?? parameters.apiUrl,
			version: options.version ?? 'v1',
			contentType: options.contentType,
			auth: {
				clientId: options.organizationAuth?.clientId ?? INVALID_VALUE,
				secret: options.organizationAuth?.secret ?? INVALID_VALUE,
			},
		};
		super(accountOptions, organizationOptions);
	}
}

const rest = new Api(
	{
		url: parameters.apiUrl,
		version: 'v1',
		accountAuth: parameters.accountAuth,
		organizationAuth: parameters.organizationAuth,
	},
);

export const CURRENT_DEVICE_UID = Symbol('CURRENT_DEVICE_UID');
export const CURRENT_APPLET_UID = Symbol('CURRENT_APPLET_UID');
export const CURRENT_APPLET_VERSION = Symbol('CURRENT_APPLET_VERSION');

export const api = rest;
export const timing = rest.timing;
export const timingCommand = rest.timingCommand;

export function now() {
	return new Date();
}

export async function waitUntil(waitCallback: () => Promise<void>, timeoutMs: number = 10e3) {
	const startTimestamp = now().valueOf();
	await waitUntilTrue(async () => {
		try {
			await waitCallback();
			return true;
		} catch (error) {
			const currentTimestamp = now().valueOf();
			if (currentTimestamp - startTimestamp > timeoutMs) {
				throw error;
			}
			return false;
		}
	});
}
