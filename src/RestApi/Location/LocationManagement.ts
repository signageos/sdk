import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { Resources } from '../resources';
import IOptions from '../IOptions';
import Location, { ILocation, ILocationCreate, ILocationUpdate, ILocationFilter } from './Location';

// TODO: SDK for locationOrganizationTag. API is not ready for supporting SDK.
export default class LocationManagement {
	constructor(private options: IOptions) {}

	public async create(location: ILocationCreate) {
		const { headers } = await postResource(this.options, Resources.Location, JSON.stringify(location));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`API didn't return location header to created ${Resources.Location}.`);
		}

		const locationSegments = headerLocation.split('/');
		const locationUid = locationSegments[locationSegments.length - 1];

		return await this.get(locationUid);
	}

	public async list(filter: ILocationFilter = {}) {
		const response = await getResource(this.options, Resources.Location, filter);
		const data: ILocation[] = await parseJSONResponse(response);

		return data.map((item) => new Location(item));
	}

	public async get(uid: string, filter: ILocationFilter = {}) {
		const response = await getResource(this.options, `${Resources.Location}/${uid}`, filter);

		return new Location(await parseJSONResponse(response));
	}

	public async update(uid: ILocation['uid'], location: ILocationUpdate) {
		await putResource(this.options, `${Resources.Location}/${uid}`, JSON.stringify(location));
	}

	public async delete(uid: ILocation['uid']) {
		await deleteResource(this.options, `${Resources.Location}/${uid}`);
	}
}
