import { IOrganizationTagUpdate } from './../../../../../src/RestApi/Organization/Tag/OrganizationTag';
import { random } from 'faker';

import { IOrganizationTag } from '../../../../../src/RestApi/Organization/Tag/OrganizationTag';
import { getOrganizationUid } from '../../helper';

export const ORGANIZATION_TAG_1: IOrganizationTag = {
	uid: random.uuid(),
	name: 'Organization tag 1',
	organizationUid: getOrganizationUid(),
};

export const ORGANIZATION_TAG_UPDATE_1: IOrganizationTagUpdate = {
	name: 'Organization tag 1 updated',
	color: '#202124',
};
