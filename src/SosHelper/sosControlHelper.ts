import * as fs from 'fs-extra';
import * as ini from 'ini';
import * as path from 'path';
import * as os from 'os';
import IRestApiOptions, { IAuthOptions } from '../RestApi/IOptions';
import { AccountAuthMissingError, DefaultOrganizationMissingError } from './errors';
import OrganizationManagement from '../RestApi/Organization/OrganizationManagement';
import { parameters } from '../parameters';

const RUN_CONTROL_FILENAME = '.sosrc';

export interface IConfig {
	identification?: string;
	apiSecurityToken?: string;
	defaultOrganizationUid?: string;
}

type IConfigFile = IConfig & {
	[P in `profile ${string}`]?: IConfig;
};

export async function loadConfig(): Promise<IConfig> {
	const runControlFilePath = getConfigFilePath();
	if (!await fs.pathExists(runControlFilePath)) {
		return {};
	}
	const runControlFileContent = await fs.readFile(runControlFilePath);
	const configFile = ini.decode(runControlFileContent.toString()) as IConfigFile;

	const profile = parameters.profile;
	const config = profile ? configFile[`profile ${profile}`] ?? {} : configFile;
	return config;
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
