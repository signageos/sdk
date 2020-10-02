import * as should from 'should';
import * as sinon from 'sinon';
import { retryRequest } from '../../../src/RestApi/requester';
import GatewayError from '../../../src/RestApi/Error/GatewayError';

describe.only('requester', function () {

	it('should fail on bad gateway', async function () {
		const mockRequest = sinon.spy();
		const tested = retryRequest(mockRequest, { factor: 1, delay: 1, maxAttempts: 3, });

		try {
			await tested;
		} catch (error) {
			// Do nothing
		}

		await tested.should.be.rejectedWith(GatewayError);
		console.log(mockRequest.args);
		should.ok(mockRequest.calledTwice, 'should call request twice');
	});
});
