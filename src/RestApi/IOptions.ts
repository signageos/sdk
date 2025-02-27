import { ApiVersions } from './apiVersions';

export interface IAuthOptions {
	clientId: string;
	secret: string;
}

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
}

export default IOptions;
