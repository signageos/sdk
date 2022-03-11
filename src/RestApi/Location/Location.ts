import { Feature, Point, Position } from 'geojson';

import { fillDataToEntity } from '../mapper';

export enum LocationTypeNamesEnum {
	Coordinates = 'Coordinates',
	Address = 'Address',
}
type Coordinates = { __typename: LocationTypeNamesEnum.Coordinates; coordinates: Position };
type Address = { __typename: LocationTypeNamesEnum.Address; address: string };
/**
 * One of the `Coordinates` or `Address` must be always in the params
 */
type LocationUnion = Coordinates | Address;

export interface ILocation {
	uid: string;
	name: string;
	feature: Feature<Point>;
	organizationUid: string;
	customId?: string;
	attachments: string[];
	description?: string;
	tagUids?: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ILocationCreateRequired {
	name: ILocation['name'];
	location: LocationUnion;
	organizationUid: ILocation['organizationUid'];
	attachments: ILocation['attachments'];
}

export interface ILocationCreate extends ILocationCreateRequired {
	customId: ILocation['customId'];
	description: ILocation['description'];
}

export interface ILocationUpdate {
	name?: string;
	location?: LocationUnion;
	customId?: string;
	attachments?: string[];
	description?: string;
}

export interface ILocationFilter {
	uid?: string;
	organizationUids?: string[];
	tagUids?: string[];
	name?: string;
	withDeviceNumber?: string;
}

export default class Location implements ILocation {
	public readonly uid: ILocation['uid'];
	public readonly name: ILocation['name'];
	public readonly feature: ILocation['feature'];
	public readonly organizationUid: ILocation['organizationUid'];
	public readonly customId: ILocation['customId'];
	public readonly attachments: ILocation['attachments'];
	public readonly description: ILocation['description'];
	public readonly tagUids: ILocation['tagUids'];
	public readonly createdAt: ILocation['createdAt'];
	public readonly updatedAt: ILocation['updatedAt'];

	constructor(data: ILocation) {
		fillDataToEntity(this, data);
	}
}
