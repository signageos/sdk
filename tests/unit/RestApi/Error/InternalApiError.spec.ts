import * as should from 'should';
import InternalApiError from '../../../../src/RestApi/Error/InternalApiError';

describe('RestApi.Error.InternalApiError', () => {

	describe('instanceof InternalApiError', () => {

		it('should return true', function () {
			const error = new InternalApiError(503, 'test');
			should(error).be.instanceOf(InternalApiError);
		});
	});
});
