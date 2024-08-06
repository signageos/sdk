import { random } from 'faker';

import {
	IOrganizationFullToken,
	IOrganizationTokenCreatable,
	IOrganizationToken,
} from '../../../../../src/RestApi/Organization/Token/OrganizationToken';

export const ORGANIZATION_UID = random.uuid();

export const ORGANIZATION_TOKEN_1: IOrganizationFullToken = {
	id: random.uuid(),
	securityToken: '202124XX23419',
	name: 'Organization token 1',
};

export const ORGANIZATION_TOKEN_GET_1: IOrganizationToken[] = [
	{
		id: random.uuid(),
		name: random.word(),
		organizationUid: random.uuid(),
	},
];

export const ORGANIZATION_TOKEN_CREATE_1: IOrganizationTokenCreatable = {
	name: 'Organization token 1',
};

export const ORGANIZATION_TOKEN_DELETE_1 = '202124XX2341';
