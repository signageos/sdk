import nock from 'nock';
import should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import LocationOrganizationTag from '../../../../../src/RestApi/Location/OrganizationTag/LocationOrganizationTagManagement';
import { LOCATION_1, LOCATION_3 } from '../../../../fixtures/Location/location.fixtures';
import { generateOrganizationTagCreate } from '../../../../fixtures/Organization/Tag/organizationTag.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';
import { random } from 'faker';

const nockOpts = getNockOpts({});
const locationOrganizationTag = new LocationOrganizationTag(nockOpts);
const organizationTagCreate = {
	uid: random.uuid(),
	...generateOrganizationTagCreate(),
};

describe('Unit.RestApi.Location.Tag.LocationOrganizationTag', () => {
	it('should assign organization tag to location', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.put(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}/${Resources.OrganizationTag}/${organizationTagCreate.uid}`)
			.reply(200, { ...LOCATION_1, tagUids: [organizationTagCreate.uid] });

		await should(locationOrganizationTag.assign(LOCATION_1.uid, organizationTagCreate.uid)).be.fulfilled();
	});

	it('should unassign organization tag from location', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.delete(`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_3.uid}/${Resources.OrganizationTag}/${organizationTagCreate.uid}`)
			.reply(200);

		await should(locationOrganizationTag.unassign(LOCATION_3.uid, organizationTagCreate.uid)).be.fulfilled();
	});
});
