import RestApi from './RestApi/RestApi';
import RestApiV2 from './RestApi/RestApiV2';
import waitUntilTrue from './Timer/waitUntil';
import { createApiOrgAndAccountOptions, createDefaultOptions, IOptions } from './apiTools';
import { ApiVersions } from './RestApi/apiVersions';

/** @deprecated, use createApiV1, or createApiV2 functions instead */
export class Api extends RestApi {
	constructor(
		options: IOptions,
	) {
		const { accountOptions, organizationOptions } = createApiOrgAndAccountOptions(options);
		super(accountOptions, organizationOptions);
	}
}

export function createApiV1(options: IOptions = createDefaultOptions()): RestApi {
	const { accountOptions, organizationOptions } = createApiOrgAndAccountOptions(options, ApiVersions.V1);
	return new RestApi(accountOptions, organizationOptions);
}

export function createApiV2(options: IOptions = createDefaultOptions(ApiVersions.V2)): RestApiV2 {
	const { accountOptions, organizationOptions } = createApiOrgAndAccountOptions(options, ApiVersions.V2);
	return new RestApiV2(accountOptions, organizationOptions);
}

/** @deprecated, use createApiV1, or createApiV2 functions instead */
const rest = createApiV1();

/** @deprecated use process.env.SOS_DEVICE_UID instead */
export const CURRENT_DEVICE_UID = process.env.SOS_DEVICE_UID ?? Symbol('CURRENT_DEVICE_UID');
/** @deprecated use process.env.SOS_APPLET_UID instead */
export const CURRENT_APPLET_UID = process.env.SOS_APPLET_UID ?? Symbol('CURRENT_APPLET_UID');
/** @deprecated use process.env.SOS_APPLET_VERSION instead */
export const CURRENT_APPLET_VERSION = process.env.SOS_APPLET_VERSION ?? Symbol('CURRENT_APPLET_VERSION');

export const api = rest;

/** @deprecated use api.timing instead */
export const timing = rest.timing;
/** @deprecated use api.timingCommand instead */
export const timingCommand = rest.timingCommand;

export function now() {
	return new Date();
}

export async function waitUntil(waitCallback: () => Promise<void>, timeoutMs: number = 10e3) {
	const startTimestamp = now().valueOf();
	await waitUntilTrue(async () => {
		try {
			await waitCallback();
			return true;
		} catch (error) {
			const currentTimestamp = now().valueOf();
			if (currentTimestamp - startTimestamp > timeoutMs) {
				throw error;
			}
			return false;
		}
	});
}
