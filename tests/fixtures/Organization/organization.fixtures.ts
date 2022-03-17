import { parameters } from '../../../src/parameters';

const organizationUid = parameters.organizationUid;

// TODO: Temporary solution until dynamic solution to get organization tag is developed
export const getOrganizationUid = () => {
	if (!organizationUid) {
		throw new Error('Required environment variable SOS_ORGANIZATION_UID is missing.');
	}

	return organizationUid;
};
