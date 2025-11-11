import { random } from 'faker';

import { IOrganizationTag, IOrganizationTagUpdate } from '../../../../../src/RestApi/Organization/Tag/OrganizationTag';

export const ORGANIZATION_TAG_1: IOrganizationTag = {
	uid: random.uuid(),
	name: 'Organization tag 1',
	organizationUid: 'test-org1',
};

export const ORGANIZATION_TAG_UPDATE_1: IOrganizationTagUpdate = {
	name: 'Organization tag 1 updated',
	color: '#202124',
};

export const ORGANIZATION_TAGS_1: IOrganizationTag[] = [
	{
		uid: random.uuid(),
		name: 'Organization tag 1',
		organizationUid: 'test-org1',
	},
	{
		uid: random.uuid(),
		name: 'Organization tag 2',
		organizationUid: 'test-org1',
	},
	{
		uid: random.uuid(),
		name: 'Organization tag 3',
		organizationUid: 'test-org1',
	},
];
