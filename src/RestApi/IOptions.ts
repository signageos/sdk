import { ApiVersions } from './apiVersions';

/** Legacy authentication using clientId and secret pair (sent as `X-Auth: clientId:secret`). */
export interface ILegacyAuthOptions {
	clientId: string;
	secret: string;
}

/** JWT authentication using an access token (sent as `X-Auth: <token>`). */
export interface IJwtAuthOptions {
	accessToken: string;
}

/** Authentication options — either legacy clientId:secret pair or a JWT access token. */
export type IAuthOptions = ILegacyAuthOptions | IJwtAuthOptions;

export type IAuthLikeOptions = IAuthOptions | (() => Promise<IAuthOptions>);

interface IOptions {
	url: string;
	contentType?: string;
	auth: IAuthLikeOptions;
	version: ApiVersions.V1 | ApiVersions.V2;
	/**
	 * Define the user custom client versions which is used for header User-Agent.
	 * E.g.: `{ "signageOS_CLI": "1.0.3" }`
	 */
	clientVersions: {
		[clientName: string]: string;
	};
	/**
	 * Will follow redirects if set to true.
	 *
	 * In practice it means that if the response contains a `Location` header,
	 * it will make another request to the URL specified in the header.
	 * This will be repeated until the response doesn't contain the `Location` header.
	 * It will return the final response.
	 */
	followRedirects?: boolean;
	/**
	 * Organization UID for JWT-authenticated requests.
	 * When using Auth0 JWT auth, the API needs to know which organization the request is for.
	 * This is sent as a query parameter `organizationUid` on all requests.
	 */
	organizationUid?: string;
}

export default IOptions;
