import * as fs from 'fs-extra';
import * as ini from 'ini';
import * as path from 'path';
import * as _ from 'lodash';
import * as os from 'os';
import chalk from 'chalk';
import IRestApiOptions, { IAuthOptions } from '../RestApi/IOptions';
import { AccountAuthMissingError, DefaultOrganizationMissingError } from './errors';
import OrganizationManagement from '../RestApi/Organization/OrganizationManagement';
import { parameters } from '../parameters';
import { log } from '../Console/log';

const RUN_CONTROL_FILENAME = '.sosrc';

export interface IConfig {
	apiUrl?: string;
	identification?: string;
	apiSecurityToken?: string;
	defaultOrganizationUid?: string;
	emulatorUid?: string;
}

type ISafeConfig = IConfig & Required<Pick<IConfig, 'apiUrl'>>;

export type IConfigFile = IConfig & {
	[P in `profile ${string}`]?: IConfig;
};

export interface IConfigOptions {
	/** The profile used on .sosrc file. Defaults to AWS_PROFILE environment variable */
	profile?: string;
}

export async function loadConfig(options?: IConfigOptions): Promise<ISafeConfig> {
	const runControlFilePath = getConfigFilePath();
	let configFile: IConfigFile = {};
	if (await fs.pathExists(runControlFilePath)) {
		const runControlFileContent = await fs.readFile(runControlFilePath);
		configFile = ini.decode(runControlFileContent.toString()) as IConfigFile;
	}

	const profile = options?.profile ?? parameters.profile;
	const config = profile ? configFile[`profile ${profile}`] ?? {} : configFile;

	// Overriding from env vars if available
	if (parameters.accountAuth?.tokenId) {
		config.identification = parameters.accountAuth.tokenId;
	}
	if (parameters.accountAuth?.token) {
		config.apiSecurityToken = parameters.accountAuth.token;
	}
	if (parameters.organizationUid) {
		config.defaultOrganizationUid = parameters.organizationUid;
	}
	if (!config.apiUrl) {
		config.apiUrl = parameters.apiUrl;
	}

	// Temporary suggestion to login getting faster token
	if (config.identification && !config.identification.match(/[0-9a-f]{20,20}/)) {
		log(
			'warning',
			`Your authentication token is outdated. Please do the ${chalk.green('sos login')} again.`,
		);
		log('info', 'After the log in, commands are becoming almost 10x faster.');
	}

	// Return value has to always contain apiUrl since it's default from parameters that is always set
	return config as ISafeConfig;
}

export async function saveConfig(newConfig: IConfig, options?: IConfigOptions) {
	newConfig = _.omitBy(newConfig, _.isNil);
	const runControlFilePath = getConfigFilePath();
	let configFile: IConfigFile = {};
	if (await fs.pathExists(runControlFilePath)) {
		const originalRCFileContent = await fs.readFile(runControlFilePath);
		configFile = ini.decode(originalRCFileContent.toString()) as IConfigFile;
	}

	const profile = options?.profile ?? parameters.profile;
	if (profile) {
		configFile[`profile ${profile}`] = newConfig;
	} else {
		configFile = _.omitBy(configFile, (_val, key) => !key.startsWith('profile '));
		Object.assign(configFile, newConfig);
	}

	const newRCFileContent = ini.encode(configFile);
	await fs.writeFile(runControlFilePath, newRCFileContent, {
		mode: 0o600,
	});
}

export async function updateConfig(partialConfig: Partial<IConfig>, options?: IConfigOptions) {
	const currentConfig = await loadConfig();
	const newConfig = {
		...currentConfig,
		...partialConfig,
	};
	await saveConfig(newConfig, options);
}

export function getConfigFilePath() {
	const homeDirectoryPath = os.homedir();
	const runControlFilePath = path.join(homeDirectoryPath, RUN_CONTROL_FILENAME);
	return runControlFilePath;
}

export async function loadAccountAuthOptions(): Promise<IAuthOptions> {
	const config = await loadConfig();
	if (!config.identification || !config.apiSecurityToken) {
		throw new AccountAuthMissingError();
	}
	return {
		clientId: config.identification,
		secret: config.apiSecurityToken,
	};
}

export async function loadOrganizationAuthOptions(
	accountAuthOptions: IRestApiOptions,
	organizationUid: string | undefined,
): Promise<IAuthOptions> {
	if (!organizationUid) {
		const config = await loadConfig();
		organizationUid = config.defaultOrganizationUid;
	}
	if (!organizationUid) {
		throw new DefaultOrganizationMissingError();
	}
	const organizationManagement = new OrganizationManagement(accountAuthOptions);
	const defaultOrganization = await organizationManagement.get(organizationUid);
	// TODO add API for new organization tokens
	return {
		clientId: defaultOrganization.oauthClientId,
		secret: defaultOrganization.oauthClientSecret,
	};
}
