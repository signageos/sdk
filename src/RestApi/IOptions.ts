
interface IOptions {
	url: string;
	auth: {
		clientId: string;
		secret: string;
	};
	version: 'v1';
}
export default IOptions;
