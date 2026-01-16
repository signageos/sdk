import should from 'should';
import { createApiV1 } from '../../../../../src';
import { opts } from '../../helper';
import { ContentGuardCategory } from '../../../../../src/RestApi/ContentGuard/Category/ContentGuardCategory';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';

const api = createApiV1(opts);
const organizationUid = getOrganizationUid();

describe('e2e.RestAPI - Content Guard Category', () => {
	let categoryUid: string;

	describe('create', () => {
		it('should create content guard category', async () => {
			const category = await api.contentGuardCategory.create({
				organizationUid,
				title: 'Test Category',
				valid: true,
			});

			should(category.uid).be.not.empty();
			should(category.title).be.equal('Test Category');
			should(category.valid).be.equal(true);

			categoryUid = category.uid;
		});
	});

	describe('list', () => {
		it('should list content guard categories', async () => {
			const categories = await api.contentGuardCategory.list();

			should(categories).be.an.Array();
			should(categories.length).be.greaterThanOrEqual(1);
			should(categories).matchAny((category: ContentGuardCategory) => category.uid === categoryUid);
		});

		it('should list content guard categories with filter', async () => {
			const categories = await api.contentGuardCategory.list({ title: 'Test Category' });

			should(categories).be.an.Array();
			should(categories).matchAny((category: ContentGuardCategory) => category.uid === categoryUid);
		});
	});

	describe('get', () => {
		it('should get content guard category', async () => {
			const category = await api.contentGuardCategory.get(categoryUid);

			should(category).be.an.instanceOf(ContentGuardCategory);
			should(category!.uid).be.equal(categoryUid);
			should(category!.title).be.equal('Test Category');
			should(category!.valid).be.equal(true);
		});

		it('should return null for non-existing category', async () => {
			const category = await api.contentGuardCategory.get('non-existing-category');
			should(category).be.null();
		});
	});

	describe('count', () => {
		it('should count content guard categories', async () => {
			const count = await api.contentGuardCategory.count();

			should(count).be.a.Number();
			should(count).be.greaterThanOrEqual(1);
		});

		it('should count content guard categories with filter', async () => {
			const count = await api.contentGuardCategory.count({ valid: true });

			should(count).be.a.Number();
			should(count).be.greaterThanOrEqual(1);
		});
	});

	describe('update', () => {
		it('should update content guard category', async () => {
			await api.contentGuardCategory.update(categoryUid, {
				title: 'Updated Category',
				valid: false,
			});

			const category = await api.contentGuardCategory.get(categoryUid);

			should(category).be.an.instanceOf(ContentGuardCategory);
			should(category!.uid).be.equal(categoryUid);
			should(category!.title).be.equal('Updated Category');
			should(category!.valid).be.equal(false);
		});
	});

	describe('delete', () => {
		it('should delete content guard category', async () => {
			await api.contentGuardCategory.delete(categoryUid);
			const category = await api.contentGuardCategory.get(categoryUid);
			should(category).be.null();
		});
	});
});
