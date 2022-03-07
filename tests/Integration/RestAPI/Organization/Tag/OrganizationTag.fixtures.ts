import {
	IOrganizationTagCreate,
	IOrganizationTagUpdate,
} from '../../../../../src/RestApi/Organization/Tag/OrganizationTag';
import { random } from 'faker';

import { IOrganizationTag } from '../../../../../src/RestApi/Organization/Tag/OrganizationTag';
import { getOrganizationUid } from '../../helper';

export const ORGANIZATION_TAG_CREATE_1: IOrganizationTagCreate = {
	name: 'Organization tag create 1',
	organizationUid: getOrganizationUid(),
	color: '#303124',
};
export const ORGANIZATION_TAG_CREATE_2: IOrganizationTagCreate = {
	name: 'Organization tag create 2',
	organizationUid: getOrganizationUid(),
	color: '#403624',
};

export const ORGANIZATION_TAG_1: IOrganizationTag = {
	uid: random.uuid(),
	name: 'Organization tag 1',
	organizationUid: getOrganizationUid(),
};

export const ORGANIZATION_TAG_UPDATE_1: IOrganizationTagUpdate = {
	name: 'Organization tag 1 updated',
	color: '#202124',
};

export const ORGANIZATION_TAG_DELETE_1: IOrganizationTagCreate = {
	name: 'Organization tag delete 1',
	organizationUid: getOrganizationUid(),
};
