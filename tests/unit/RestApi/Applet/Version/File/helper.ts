import { Readable } from 'stream';

export function createReadableStream(content: string): NodeJS.ReadableStream {
	return Readable.from(content);
}
