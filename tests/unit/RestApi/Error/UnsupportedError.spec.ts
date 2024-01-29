import * as should from 'should';
import UnsupportedError from '../../../../src/RestApi/Error/UnsupportedError';

describe('RestApi.Error.UnsupportedError', () => {
	describe('instanceof UnsupportedError', () => {
		it('should return true', function () {
			const error = new UnsupportedError();
			should(error).be.instanceOf(UnsupportedError);
		});
	});
});
