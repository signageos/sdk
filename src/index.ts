import RestApi from './RestApi/RestApi';
import waitUntilTrue from './Timer/waitUntil';
import { parameters } from './parameters';

const INVALID_VALUE = 'not_specified';

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
			tokenId: options.accountAuth?.accountId ?? INVALID_VALUE,
			token: options.accountAuth?.secret ?? INVALID_VALUE,
		};
		const accountOptions = {
			url: options.url ?? parameters.apiUrl,
			version: options.version ?? 'v1',
			contentType: options.contentType,
			auth: {
				clientId: accountAuth.tokenId,
				secret: accountAuth.token,
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
		organizationUid: parameters.organizationUid,
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
