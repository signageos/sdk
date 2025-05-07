import * as http from 'http';

export async function getRequest(port: number, path: string) {
	const request = http.get({ port, path });
	const promise = new Promise<{ data: Buffer; statusCode: number | undefined }>((resolve, reject) => {
		request.on('response', (response) => {
			let data = Buffer.from([]);
			response.on('data', (chunk) => {
				data = Buffer.concat([data, chunk]);
			});
			response.on('end', () => {
				resolve({ data, statusCode: response.statusCode });
			});
		});
		request.on('error', (error) => reject(error));
	});
	request.end();
	return await promise;
}
