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
}

export default IOptions;
