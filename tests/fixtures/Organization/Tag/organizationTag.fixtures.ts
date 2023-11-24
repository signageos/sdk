import { random } from 'faker';

import {
	IOrganizationTagCreate, IOrganizationTagUpdate,
} from '../../../../src/RestApi/Organization/Tag/OrganizationTag';
import { getOrganizationUid } from '../organization.fixtures';

export const generateOrganizationTagCreate: () => IOrganizationTagCreate = () => ({
	name: `Organization tag created ${random.uuid()}`,
	get organizationUid() { return getOrganizationUid(); },
	color: '#303124',
});

export const generateOrganizationTagUpdate: () => IOrganizationTagUpdate = () => ({
	name: `Organization tag updated ${random.uuid()}`,
	color: '#202124',
});
