import * as should from 'should';
import AuthenticationError from '../../../../src/RestApi/Error/AuthenticationError';

describe('RestApi.Error.AuthenticationError', () => {

	describe('instanceof AuthenticationError', () => {

		it('should return true', function () {
			const error = new AuthenticationError(503, 'test');
			should(error).be.instanceOf(AuthenticationError);
		});
	});
});
