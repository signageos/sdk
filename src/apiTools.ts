import IRestApiOptions from './RestApi/IOptions';
import { parameters } from './parameters';
import { cacheFunctionResult } from './SosHelper/cache';
import { loadAccountAuthOptions, loadOrganizationAuthOptions } from './SosHelper/sosControlHelper';
import { ApiVersions } from './RestApi/apiVersions';
import { log } from './Console/log';

export interface IOptions {
	url?: string;
	contentType?: string;
	accountAuth?:
		| {
				tokenId: string;
				token: string;
		  }
		| {
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
	version?: ApiVersions.V1 | ApiVersions.V2;
	/**
	 * Define the user custom client versions which is used for header User-Agent.
	 * E.g.: `{ "signageOS_CLI": "1.0.3" }`
	 */
	clientVersions?: {
		[clientName: string]: string;
	};
}

export function createDefaultOptions(
	version: ApiVersions.V1 | ApiVersions.V2 = ApiVersions.V1,
): IOptions & Required<Pick<IOptions, 'url'>> {
	return {
		url: parameters.apiUrl,
		version: version,
		accountAuth: parameters.accountAuth,
		organizationUid: parameters.organizationUid,
		organizationAuth: parameters.organizationAuth,
	};
}

export function createApiOrgAndAccountOptions(
	options: IOptions,
	version?: ApiVersions.V1 | ApiVersions.V2,
): {
	accountOptions: IRestApiOptions;
	organizationOptions: IRestApiOptions;
} {
	if (options.accountAuth && 'accountId' in options.accountAuth) {
		log(
			'warning',
			`Option "accountAuth.accountId" is deprecated and will be removed in next major version. Use "accountAuth.tokenId" instead.`,
		);
	}
	if (options.accountAuth && 'secret' in options.accountAuth) {
		log('warning', `Option "accountAuth.secret" is deprecated and will be removed in next major version. Use "accountAuth.token" instead.`);
	}

	const accountAuth =
		options.accountAuth && 'tokenId' in options.accountAuth
			? options.accountAuth
			: {
					tokenId: options.accountAuth?.accountId,
					token: options.accountAuth?.secret,
				};

	const generalOptions = {
		url: options.url ?? parameters.apiUrl,
		version: version ?? options.version ?? ApiVersions.V1,
		contentType: options.contentType,
	};

	const accountOptions: IRestApiOptions = {
		...generalOptions,
		clientVersions: options.clientVersions ?? {},
		auth:
			accountAuth.tokenId && accountAuth.token
				? {
						clientId: accountAuth.tokenId,
						secret: accountAuth.token,
					}
				: cacheFunctionResult(loadAccountAuthOptions),
	};

	const organizationOptions: IRestApiOptions = {
		...generalOptions,
		clientVersions: options.clientVersions ?? {},
		auth:
			options.organizationAuth?.clientId && options.organizationAuth?.secret
				? {
						clientId: options.organizationAuth?.clientId,
						secret: options.organizationAuth?.secret,
					}
				: cacheFunctionResult(() => loadOrganizationAuthOptions(accountOptions, options.organizationUid ?? parameters.organizationUid)),
	};
	return {
		accountOptions,
		organizationOptions,
	};
}
