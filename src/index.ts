import RestApi from './RestApi/RestApi';
import waitUntilTrue from './Timer/waitUntil';
import { parameters } from './parameters';
import IRestApiOptions from './RestApi/IOptions';
import {
	loadAccountAuthOptions,
	loadOrganizationAuthOptions,
} from './SosHelper/sosControlHelper';
import { cacheFunctionResult } from './SosHelper/cache';

export interface IOptions {
	url?: string;
	contentType?: string;
	accountAuth?: {
		tokenId: string;
		token: string;
	} | {
		/** @deprecated use tokenId instead */
		accountId: string;
		/** @deprecated use token instead */
		secret: string;
	};
	organizationUid?: string;
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
		if (options.accountAuth && 'accountId' in options.accountAuth) {
			console.warn(
				`Option "accountAuth.accountId" is deprecated and will be removed in next major version. Use "accountAuth.tokenId" instead.`,
			);
		}
		if (options.accountAuth && 'secret' in options.accountAuth) {
			console.warn(
				`Option "accountAuth.secret" is deprecated and will be removed in next major version. Use "accountAuth.token" instead.`,
			);
		}
		const accountAuth = options.accountAuth && 'tokenId' in options.accountAuth ? options.accountAuth : {
			tokenId: options.accountAuth?.accountId,
			token: options.accountAuth?.secret,
		};
		const accountOptions: IRestApiOptions = {
			url: options.url ?? parameters.apiUrl,
			version: options.version ?? 'v1',
			contentType: options.contentType,
			auth: accountAuth.tokenId && accountAuth.token ? {
				clientId: accountAuth.tokenId,
				secret: accountAuth.token,
			} : cacheFunctionResult(loadAccountAuthOptions),
		};
		const organizationOptions: IRestApiOptions = {
			url: options.url ?? parameters.apiUrl,
			version: options.version ?? 'v1',
			contentType: options.contentType,
			auth: options.organizationAuth?.clientId && options.organizationAuth?.secret ? {
				clientId: options.organizationAuth?.clientId,
				secret: options.organizationAuth?.secret,
			} : cacheFunctionResult(() => loadOrganizationAuthOptions(accountOptions, options.organizationUid)),
		};
		super(accountOptions, organizationOptions);
	}
}

const rest = new Api(
	{
		url: parameters.apiUrl,
		version: 'v1',
		accountAuth: parameters.accountAuth,
		organizationUid: parameters.organizationUid,
		organizationAuth: parameters.organizationAuth,
	},
);

/** @deprecated use process.env.SOS_DEVICE_UID instead */
export const CURRENT_DEVICE_UID = process.env.SOS_DEVICE_UID ?? Symbol('CURRENT_DEVICE_UID');
/** @deprecated use process.env.SOS_APPLET_UID instead */
export const CURRENT_APPLET_UID = process.env.SOS_APPLET_UID ?? Symbol('CURRENT_APPLET_UID');
/** @deprecated use process.env.SOS_APPLET_VERSION instead */
export const CURRENT_APPLET_VERSION = process.env.SOS_APPLET_VERSION ?? Symbol('CURRENT_APPLET_VERSION');

export const api = rest;

/** @deprecated use api.timing instead */
export const timing = rest.timing;
/** @deprecated use api.timingCommand instead */
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
