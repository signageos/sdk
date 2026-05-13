import { loadTextEncoderDecoderIfNotExist } from './Polyfill/textCoders';
loadTextEncoderDecoderIfNotExist();
import RestApi from './RestApi/RestApi';
import RestApiV2 from './RestApi/RestApiV2';
import { ApiVersions } from './RestApi/apiVersions';
import { createApiOrgAndAccountOptions, createDefaultOptions, IOptions } from './apiTools';
import { Development } from './Development/Development';

/** @deprecated, use createApiV1, or createApiV2 functions instead */
export class Api extends RestApi {
	constructor(options: IOptions) {
		const { accountOptions, organizationOptions } = createApiOrgAndAccountOptions(options);
		super(accountOptions, organizationOptions);
	}
}

export function createApiV1(options: IOptions = createDefaultOptions()): RestApi {
	const { accountOptions, organizationOptions } = createApiOrgAndAccountOptions(options, ApiVersions.V1);
	return new RestApi(accountOptions, organizationOptions);
}

export function createApiV2(options: IOptions = createDefaultOptions(ApiVersions.V2)): RestApiV2 {
	// V1 used because organization is not supported in V2 yet
	const { accountOptions, organizationOptions } = createApiOrgAndAccountOptions(options, ApiVersions.V1);
	return new RestApiV2({ ...accountOptions, version: ApiVersions.V2 }, { ...organizationOptions, version: ApiVersions.V2 });
}

/** @deprecated, use createApiV1, or createApiV2 functions instead */
let rest: RestApi | undefined;
function getRest(): RestApi {
	if (!rest) {
		rest = createApiV1();
	}
	return rest;
}

/** @deprecated use process.env.SOS_DEVICE_UID instead */
export const CURRENT_DEVICE_UID = process.env.SOS_DEVICE_UID ?? Symbol('CURRENT_DEVICE_UID');
/** @deprecated use process.env.SOS_APPLET_UID instead */
export const CURRENT_APPLET_UID = process.env.SOS_APPLET_UID ?? Symbol('CURRENT_APPLET_UID');
/** @deprecated use process.env.SOS_APPLET_VERSION instead */
export const CURRENT_APPLET_VERSION = process.env.SOS_APPLET_VERSION ?? Symbol('CURRENT_APPLET_VERSION');

/** @deprecated, use createApiV1, or createApiV2 functions instead */
export const api = new Proxy({} as RestApi, {
	get(_target, prop, receiver) {
		return Reflect.get(getRest() as object, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(getRest() as object, prop);
	},
});

/** @deprecated use api.timing instead */
export const timing: RestApi['timing'] = new Proxy({} as RestApi['timing'], {
	get(_target, prop, receiver) {
		return Reflect.get(getRest().timing as object, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(getRest().timing as object, prop);
	},
});
/** @deprecated use api.timingCommand instead */
export const timingCommand: RestApi['timingCommand'] = new Proxy({} as RestApi['timingCommand'], {
	get(_target, prop, receiver) {
		return Reflect.get(getRest().timingCommand as object, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(getRest().timingCommand as object, prop);
	},
});

/**
 * Development API
 * Allows to do some fency stuff, like:
 * - connect/disconnect devices,
 * - build/compile applet,
 * - hot reload applet,
 * - watch applet changes,
 * - etc.
 */
export function createDevelopment(options: IOptions = createDefaultOptions()) {
	const development = new Development(createApiV1(options), createApiV2(options));
	return development;
}

/**
 * A singleton instance of Development API
 * @see createDevelopment
 */
let _dev: Development | undefined;
export const dev = new Proxy({} as Development, {
	get(_target, prop, receiver) {
		if (!_dev) {
			_dev = createDevelopment();
		}
		return Reflect.get(_dev as object, prop, receiver);
	},
	has(_target, prop) {
		if (!_dev) {
			_dev = createDevelopment();
		}
		return Reflect.has(_dev as object, prop);
	},
});

export { now } from './Utils/time';
export { waitUntilResolved as waitUntil } from './Timer/waitUntil';
export { PaginatedList } from './Lib/Pagination/PaginatedList';
export type { IPaginatedList } from './Lib/Pagination/PaginatedList';
export type { IPaginationFilter } from './Lib/Pagination/IPaginationFilter';
