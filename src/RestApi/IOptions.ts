
export interface IAuthOptions {
	clientId: string;
	secret: string;
}

export type IAuthLikeOptions = IAuthOptions | (() => Promise<IAuthOptions>);

interface IOptions {
	url: string;
	contentType?: string;
	auth: IAuthLikeOptions;
	version: 'v1';
}
export default IOptions;
