import * as should from 'should';
import * as nock from 'nock';

const nockOpts = getNockOpts({});
import { errorResp, errorRespMessage, getNockOpts, successRes } from '../../helper';
import { IOrganizationTokenCreate, IOrganizationTokenDelete, IOrganizationTokenResponse, OrganizationToken } from '../../../../../src/RestApi/Organization/Token/OrganizationToken';


describe('OrganizationTokenManagment', ()=> {
    const token : IOrganizationTokenResponse = {
        id: 'someId',
        securityToken: 'someSecurityToken',
        name: 'someName'
    };

    const validGetResp : IOrganizationTokenResponse = token;
    const validateSetReq: IOrganizationTokenCreate = {
        name: 'someName'
    };
    const validateDelReq: IOrganizationTokenDelete = {
        securityTokenId: 'someSecurityToken'
    }

    nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
        .post('/v1/organization/someUid/security-token', validateSetReq as {})
        .reply(200, validGetResp)
        .post('/v1/organization/shouldFail/security-token', validateSetReq as {})
        .reply(500, errorResp)
        .delete('/v1/organization/someUid/security-token/someSecurityToken')
        .reply(200, successRes)
        .delete('/v1/organization/shouldFail/security-token/shouldFail')
        .reply(500, errorResp);

    const organizationToken = new OrganizationToken(nockOpts);

    describe('create new organization token', ()=> {
        it('should create token', async () => {
            await organizationToken.create('someUid', validateSetReq);
            should(true).true();
        });

        it('should throw an error', async () => {
            try {
                await organizationToken.create('shouldFail', validateSetReq);
            }
            catch (e) {
                should(e.message).equal(errorRespMessage(500));
            }
        })
    });

    describe('delete organization token', ()=> {
        it('should delete token', async () => {
            await organizationToken.delete('someUid', validateDelReq);
            should(true).true();
        });

        it('should throw an error', async () => {
            try {
                await organizationToken.delete('shouldFail', validateDelReq);
            }
            catch (e) {
                should(e.message).equal(errorRespMessage(500));
            }
        })
    });
});