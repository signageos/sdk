import { Readable } from 'stream';

export function createReadableStream(content: string): NodeJS.ReadableStream {
	const stream = new Readable();
	stream.push(content);
	stream.push(null);
	return stream;
}
