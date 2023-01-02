import * as should from 'should';
import NotFoundError from '../../../../src/RestApi/Error/NotFoundError';

describe('RestApi.Error.NotFoundError', () => {

	describe('instanceof NotFoundError', () => {

		it('should return true', function () {
			const error = new NotFoundError(503, 'test');
			should(error).be.instanceOf(NotFoundError);
		});
	});
});
