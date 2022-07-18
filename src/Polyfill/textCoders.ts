import { TextDecoder, TextEncoder } from 'util';

declare const global: IExtendedGlobal;

interface IExtendedGlobal extends NodeJS.Global {
	TextEncoder: TextEncoder;
	TextDecoder: TextDecoder;
}

/**
 * make sure TextEncoder and TextDecoder are present as global variables ( jsdom jest combination issue where TextEncoder is not defined )
 */
export function loadTextEncoderDecoderIfNotExist() {
	global.TextEncoder = global.TextEncoder || TextEncoder;
	global.TextDecoder = global.TextDecoder || TextDecoder;
}
