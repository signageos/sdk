import should from 'should';
import RequestError from '../../../../src/RestApi/Error/RequestError';

describe('RestApi.Error.RequestError', () => {
	describe('instanceof RequestError', () => {
		it('should return true', function () {
			const error = new RequestError(503, 'test');
			should(error).be.instanceOf(RequestError);
		});
	});
});
