import should from 'should';
import nock from 'nock';

import { getNockOpts, nockAuthHeader1, successRes } from '../../helper';
import {
	IContentGuardCategory,
	IContentGuardCategoryCreatable,
	IContentGuardCategoryUpdatable,
} from '../../../../../src/RestApi/ContentGuard/Category/IContentGuardCategory';
import { ContentGuardCategoryManagement } from '../../../../../src/RestApi/ContentGuard/Category/ContentGuardCategoryManagement';
import { ContentGuardCategory } from '../../../../../src/RestApi/ContentGuard/Category/ContentGuardCategory';
import { createDependencies } from '../../../../../src/RestApi/Dependencies';

const nockOpts = getNockOpts({});

describe('ContentGuardCategoryManagement', () => {
	const category: IContentGuardCategory = {
		uid: 'category-uid-1',
		title: 'Test Category',
		organizationUid: 'org-uid-1',
		valid: true,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-01-01T00:00:00.000Z'),
	};

	const validCreateRequest: IContentGuardCategoryCreatable = {
		organizationUid: 'org-uid-1',
		title: 'Test Category',
		valid: true,
	};

	const validUpdateRequest: IContentGuardCategoryUpdatable = {
		title: 'Updated Category',
		valid: false,
	};

	nock(nockOpts.url, nockAuthHeader1)
		.get('/v1/content-guard/category')
		.reply(200, [category])
		.get('/v1/content-guard/category?title=Test')
		.reply(200, [category])
		.get('/v1/content-guard/category/category-uid-1')
		.reply(200, category)
		.get('/v1/content-guard/category/non-existing')
		.reply(404, { message: 'Not found' })
		.post('/v1/content-guard/category', validCreateRequest as {})
		.reply(201, category)
		.put('/v1/content-guard/category/category-uid-1', validUpdateRequest as {})
		.reply(204, successRes)
		.delete('/v1/content-guard/category/category-uid-1')
		.reply(204, successRes)
		.delete('/v1/content-guard/category/category-uid-2?deleteItems=true')
		.reply(204, successRes)
		.get('/v1/content-guard/category/count')
		.reply(200, { count: 5 })
		.get('/v1/content-guard/category/count?valid=true')
		.reply(200, { count: 3 });

	const management = new ContentGuardCategoryManagement(createDependencies(nockOpts));

	const assertCategory = (actual: IContentGuardCategory, expected: IContentGuardCategory) => {
		should(actual.uid).be.equal(expected.uid);
		should(actual.title).be.equal(expected.title);
		should(actual.organizationUid).be.equal(expected.organizationUid);
		should(actual.valid).be.equal(expected.valid);
		should(actual.createdAt).be.deepEqual(expected.createdAt);
		should(actual.updatedAt).be.deepEqual(expected.updatedAt);
	};

	it('should list categories', async () => {
		const categories = await management.list();
		should(categories).have.lengthOf(1);
		should(categories[0]).be.instanceOf(ContentGuardCategory);
		assertCategory(categories[0], category);
	});

	it('should list categories with filter', async () => {
		const categories = await management.list({ title: 'Test' });
		should(categories).have.lengthOf(1);
		assertCategory(categories[0], category);
	});

	it('should get category by uid', async () => {
		const result = await management.get('category-uid-1');
		should(result).not.be.null();
		should(result).be.instanceOf(ContentGuardCategory);
		assertCategory(result!, category);
	});

	it('should return null for non-existing category', async () => {
		const result = await management.get('non-existing');
		should(result).be.null();
	});

	it('should create category', async () => {
		const result = await management.create(validCreateRequest);
		should(result).be.instanceOf(ContentGuardCategory);
		assertCategory(result, category);
	});

	it('should update category', async () => {
		await should(management.update('category-uid-1', validUpdateRequest)).be.fulfilled();
	});

	it('should delete category', async () => {
		await should(management.delete('category-uid-1')).be.fulfilled();
	});

	it('should delete category with deleteItems option', async () => {
		await should(management.delete('category-uid-2', { deleteItems: true })).be.fulfilled();
	});

	it('should count categories', async () => {
		const count = await management.count();
		should(count).be.equal(5);
	});

	it('should count categories with filter', async () => {
		const count = await management.count({ valid: true });
		should(count).be.equal(3);
	});
});
