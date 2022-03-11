import { Api } from '../../../../src';
import { LocationCreateWithoutOrg } from './Location.fixtures';

export const handleCreateLocation = async (
	api: Api,
	params: { location: LocationCreateWithoutOrg; organizationUid: string },
) => {
	const locationPayload = {
		...params.location,
		organizationUid: params.organizationUid,
	};

	return api.location.create(locationPayload);
};
