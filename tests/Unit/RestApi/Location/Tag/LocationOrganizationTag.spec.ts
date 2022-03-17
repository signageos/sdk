import * as nock from 'nock';
import * as should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import LocationOrganizationTag from '../../../../../src/RestApi/Location/OrganizationTag/LocationOrganizationTagManagement';
import { LOCATION_1, LOCATION_3 } from '../../../../Integration/RestAPI/Location/Location.fixtures';
import { ORGANIZATION_TAG_1 } from '../../../../Integration/RestAPI/Organization/Tag/OrganizationTag.fixtures';
import { nockOpts, nockAuthHeader } from '../../helper';

const locationOrganizationTag = new LocationOrganizationTag(nockOpts);

describe('Unit.RestApi.Location.Tag.LocationOrganizationTag', () => {
	it('should assign organization tag to location', async () => {
		nock(nockOpts.url, nockAuthHeader)
			.put(
				`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_1.uid}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`,
			)
			.reply(200, { ...LOCATION_1, tagUids: [ORGANIZATION_TAG_1.uid] });

		await should(locationOrganizationTag.assign(LOCATION_1.uid, ORGANIZATION_TAG_1.uid)).be.fulfilled();
	});

	it('should unassign organization tag from location', async () => {
		nock(nockOpts.url, nockAuthHeader)
			.delete(
				`/${ApiVersions.V1}/${Resources.Location}/${LOCATION_3.uid}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`,
			)
			.reply(200);

		await should(locationOrganizationTag.unassign(LOCATION_3.uid, ORGANIZATION_TAG_1.uid)).be.fulfilled();
	});
});
