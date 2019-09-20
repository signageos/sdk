
interface IOptions {
	url: string;
	contentType?: string;
	auth: {
		clientId: string;
		secret: string;
	};
	version: 'v1';
}
export default IOptions;
