import { parameters } from '../../../src/parameters';
import { IOptions } from '../../../src/apiTools';
import { ApiVersions } from '../../../src/RestApi/apiVersions';

const apiUrl = parameters.apiUrl;
const version = ApiVersions.V1;
const organizationUid = parameters.organizationUid;

export const opts: IOptions = {
	url: apiUrl,
	version: version,
	organizationUid,
	organizationAuth: parameters.organizationAuth,
	accountAuth: parameters.accountAuth,
	clientVersions: {},
};
