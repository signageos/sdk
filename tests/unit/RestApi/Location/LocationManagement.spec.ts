import { readFile } from 'fs-extra';
import nock from 'nock';
import should from 'should';

import { ApiVersions } from '../../../../src/RestApi/apiVersions';
import { ILocationCreate, ILocation, ILocationUpdate } from '../../../../src/RestApi/Location/Location';
import LocationManagement, { LocationResources } from '../../../../src/RestApi/Location/LocationManagement';
import { Resources } from '../../../../src/RestApi/resources';
import { parameters } from '../../../../src/parameters';
import { LOCATION_1, LOCATION_2, LOCATION_CREATE_1, LOCATION_UPDATE_1 } from '../../../fixtures/Location/location.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../helper';

const nockOpts = getNockOpts({});
const locationManagement = new LocationManagement(nockOpts);

const validCreateReq: ILocationCreate = { ...LOCATION_CREATE_1 };
const validUpdateReq: ILocationUpdate = LOCATION_UPDATE_1;
const validGetResp: ILocation = { ...LOCATION_1, organizationUid: 'organization-uid-1' };
const validListResp: ILocation[] = [
	{ ...LOCATION_1, organizationUid: 'organization-uid-1' },
	{ ...LOCATION_2, organizationUid: 'organization-uid-1' },
];

const assertLocation = (location: ILocation) => {
	should.equal(validGetResp.uid, location.uid);
	should.equal(validGetResp.name, location.name);
	should.deepEqual(validGetResp.feature, location.feature);
	should.equal(validGetResp.organizationUid, location.organizationUid);
	should.equal(validGetResp.customId, location.customId);
	should.deepEqual(validGetResp.attachments, location.attachments);
	should.equal(validGetResp.description, location.description);
	should.deepEqual(validGetResp.tagUids, location.tagUids);
};

describe('Unit.RestApi.Location', () => {
	const validPostRespHeaders: nock.ReplyHeaders = {
		Location: `https://example.com/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}`,
	};

	it('should create location', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.post(`/${ApiVersions.V1}/${Resources.Location}`, JSON.stringify(validCreateReq))
			.reply(200, 'Created', validPostRespHeaders)
			.get(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}`)
			.reply(200, validGetResp);

		const location = await locationManagement.create(validCreateReq);

		assertLocation(location);
	});

	it('should get one location', async () => {
		nock(nockOpts.url, nockAuthHeader1).get(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}`).reply(200, validGetResp);

		const location = await locationManagement.get(LOCATION_1.uid);

		assertLocation(location);
	});

	it('should get multiple locations', async () => {
		nock(nockOpts.url, nockAuthHeader1).get(`/${ApiVersions.V1}/${Resources.Location}`).reply(200, validListResp);

		const locations = await locationManagement.list();

		should(locations.length).be.eql(2);
	});

	it('should update location', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.put(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}`, JSON.stringify(validUpdateReq))
			.reply(200);

		await should(locationManagement.update(LOCATION_1.uid, validUpdateReq)).be.fulfilled();
	});

	it('should add attachment', async () => {
		const attachment = await readFile(`${parameters.paths.rootPath}/tests/assets/image_1.png`);

		nock(nockOpts.url, nockAuthHeader1)
			.put(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}/${LocationResources.AddAttachment}`, attachment)
			.reply(200);

		await should(locationManagement.addAttachment(LOCATION_1.uid, attachment)).be.fulfilled();
	});

	it('should remove attachments', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.put(
				`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}/${LocationResources.RemoveAttachments}`,
				JSON.stringify({ attachmentsToRemove: [] }),
			)
			.reply(200);

		await should(locationManagement.removeAttachments(LOCATION_1.uid, [])).be.fulfilled();
	});

	it('should delete location', async () => {
		nock(nockOpts.url, nockAuthHeader1).delete(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}`).reply(200);

		await should(locationManagement.delete(LOCATION_1.uid)).be.fulfilled();
	});
});
