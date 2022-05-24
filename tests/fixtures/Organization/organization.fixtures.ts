import { parameters } from '../../../src/parameters';

/* Unit */
export const ORGANIZATION_UID_1 = 'organization-uid-1';

/* e2e */

const organizationUid = parameters.organizationUid;

// TODO: Temporary solution until dynamic solution to get organization tag is developed
export const getOrganizationUid = () => {
	if (!organizationUid) {
		throw new Error('Required environment variable SOS_ORGANIZATION_UID is missing.');
	}

	return organizationUid;
};
