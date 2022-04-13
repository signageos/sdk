import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { Resources } from '../resources';
import IOptions from '../IOptions';
import Location, { ILocation, ILocationCreate, ILocationUpdate, ILocationFilter } from './Location';
import { getAttachmentExtension } from './location.utils';

export enum LocationResources {
	AddAttachment = 'add-attachment',
	RemoveAttachments = 'remove-attachments',
}

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

	public async get(uid: ILocation['uid'], filter: ILocationFilter = {}) {
		const response = await getResource(this.options, `${Resources.Location}/${uid}`, filter);

		return new Location(await parseJSONResponse(response));
	}

	public async update(uid: ILocation['uid'], location: ILocationUpdate) {
		await putResource(this.options, `${Resources.Location}/${uid}`, JSON.stringify(location));
	}

	/**
	 * @param attachment Buffer. Accept only file with extension `.png`, `jpeg`, `.jpg` or `.gif`
	 */
	public async addAttachment(uid: ILocation['uid'], attachment: Buffer) {
		await putResource(
			{ ...this.options, contentType: `image/${await getAttachmentExtension(attachment)}` },
			`${Resources.Location}/${uid}/${LocationResources.AddAttachment}`,
			attachment,
		);
	}

	/**
	 * @param attachments string[]. Attachments must be taken from the Location entity.
	 * And can't be anyhow edited
	 */
	public async removeAttachments(uid: ILocation['uid'], attachments: ILocation['attachments']) {
		await putResource(
			this.options,
			`${Resources.Location}/${uid}/${LocationResources.RemoveAttachments}`,
			JSON.stringify({ attachmentsToRemove: attachments }),
		);
	}

	public async delete(uid: ILocation['uid']) {
		await deleteResource(this.options, `${Resources.Location}/${uid}`);
	}
}
