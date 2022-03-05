import { Api } from '../../../../src';
import { ILocation, ILocationCreate } from '../../../../src/RestApi/Location/Location';
import { LocationCreateWithoutOrg, LocationWithoutOrg } from './Location.fixtures';

const getLocation = (
	location: LocationCreateWithoutOrg | LocationWithoutOrg,
	organizationUid: string,
): ILocationCreate | ILocation => ({
	...location,
	organizationUid,
});

export const handleCreateLocation = async (
	api: Api,
	params: { location: LocationCreateWithoutOrg; organizationUid: string },
) => {
	const locationPayload = getLocation(params.location, params.organizationUid);

	return api.location.create(locationPayload);
};
