import should from 'should';
import { createApiV1 } from '../../../../../src';
import { opts } from '../../helper';
import { ContentGuardItem } from '../../../../../src/RestApi/ContentGuard/Item/ContentGuardItem';
import { ContentGuardItemType } from '../../../../../src/RestApi/ContentGuard/Item/ContentGuardItemType';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';

const api = createApiV1(opts);
const organizationUid = getOrganizationUid();

describe('e2e.RestAPI - Content Guard Item', () => {
	let categoryUid: string;
	let itemUid: string;
	let secondItemUid: string;

	before(async () => {
		// Create a category first to use for items
		const category = await api.contentGuardCategory.create({
			organizationUid,
			title: 'Test Category for Items',
			valid: true,
		});
		categoryUid = category.uid;
	});

	after(async () => {
		// Clean up category
		try {
			await api.contentGuardCategory.delete(categoryUid, { deleteItems: true });
		} catch {
			// Ignore errors during cleanup
		}
	});

	describe('create', () => {
		it('should create content guard item with type IMAGE', async () => {
			const result = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'Test Image Item',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
			});

			should(result.uid).be.not.empty();
			itemUid = result.uid;
		});

		it('should create content guard item with type PROMPT', async () => {
			const result = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.PROMPT,
				title: 'Test Prompt Item',
				description: 'Test Prompt Description',
				categoryUid,
				tagUids: [],
				prompt: 'This is a test prompt',
			});

			should(result.uid).be.not.empty();
			secondItemUid = result.uid;
		});
	});

	describe('list', () => {
		it('should list content guard items', async () => {
			const items = await api.contentGuardItem.list();

			should(items).be.an.Array();
			should(items.length).be.greaterThanOrEqual(2);
			should(items).matchAny((item: ContentGuardItem) => item.uid === itemUid);
		});

		it('should list content guard items with filter', async () => {
			const items = await api.contentGuardItem.list({ itemType: ContentGuardItemType.IMAGE });

			should(items).be.an.Array();
			should(items).matchAny((item: ContentGuardItem) => item.uid === itemUid);
		});

		it('should list content guard items by category', async () => {
			const items = await api.contentGuardItem.list({ categoryUids: [categoryUid] });

			should(items).be.an.Array();
			should(items.length).be.greaterThanOrEqual(2);
		});
	});

	describe('get', () => {
		it('should get content guard item', async () => {
			const item = await api.contentGuardItem.get(itemUid);

			should(item).be.an.instanceOf(ContentGuardItem);
			should(item!.uid).be.equal(itemUid);
			should(item!.title).be.equal('Test Image Item');
			should(item!.itemType).be.equal(ContentGuardItemType.IMAGE);
			should(item!.categoryUid).be.equal(categoryUid);
		});

		it('should return null for non-existing item', async () => {
			const item = await api.contentGuardItem.get('non-existing-item');
			should(item).be.null();
		});
	});

	describe('count', () => {
		it('should count content guard items', async () => {
			const count = await api.contentGuardItem.count();

			should(count).be.a.Number();
			should(count).be.greaterThanOrEqual(2);
		});

		it('should count content guard items with filter', async () => {
			const count = await api.contentGuardItem.count({ categoryUids: [categoryUid] });

			should(count).be.a.Number();
			should(count).be.greaterThanOrEqual(2);
		});
	});

	describe('update', () => {
		it('should update content guard item', async () => {
			await api.contentGuardItem.update(itemUid, {
				title: 'Updated Image Item',
				description: 'Updated Description',
			});

			const item = await api.contentGuardItem.get(itemUid);

			should(item).be.an.instanceOf(ContentGuardItem);
			should(item!.uid).be.equal(itemUid);
			should(item!.title).be.equal('Updated Image Item');
			should(item!.description).be.equal('Updated Description');
		});
	});

	describe('bulk operations', () => {
		let newCategoryUid: string;

		before(async () => {
			// Create another category for bulk update test
			const category = await api.contentGuardCategory.create({
				organizationUid,
				title: 'Bulk Update Target Category',
				valid: true,
			});
			newCategoryUid = category.uid;
		});

		after(async () => {
			try {
				await api.contentGuardCategory.delete(newCategoryUid, { deleteItems: true });
			} catch {
				// Ignore errors during cleanup
			}
		});

		it('should bulk update category for items', async () => {
			await api.contentGuardItem.bulkUpdateCategory([itemUid, secondItemUid], newCategoryUid);

			const item = await api.contentGuardItem.get(itemUid);
			should(item!.categoryUid).be.equal(newCategoryUid);
		});
	});

	describe('delete', () => {
		it('should delete content guard item', async () => {
			await api.contentGuardItem.delete(itemUid);
			const item = await api.contentGuardItem.get(itemUid);
			should(item).be.null();
		});

		it('should delete second content guard item', async () => {
			await api.contentGuardItem.delete(secondItemUid);
			const item = await api.contentGuardItem.get(secondItemUid);
			should(item).be.null();
		});
	});
});
