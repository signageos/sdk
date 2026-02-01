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

	beforeEach(async () => {
		// Create a fresh category for each test
		const category = await api.contentGuardCategory.create({
			organizationUid,
			title: 'Test Category for Items',
			valid: true,
		});
		categoryUid = category.uid;
	});

	afterEach(async () => {
		// Clean up category and all its items
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

			// Verify created item by fetching it
			const item = await api.contentGuardItem.get(result.uid);
			should(item!.itemType).be.equal(ContentGuardItemType.IMAGE);
			should(item!.title).be.equal('Test Image Item');
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

			// Verify created item by fetching it
			const item = await api.contentGuardItem.get(result.uid);
			should(item!.itemType).be.equal(ContentGuardItemType.PROMPT);
			should(item!.title).be.equal('Test Prompt Item');
		});
	});

	describe('list', () => {
		let imageItemUid: string;
		let promptItemUid: string;

		beforeEach(async () => {
			const imageItem = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'List Test Image Item',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
			});
			imageItemUid = imageItem.uid;

			const promptItem = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.PROMPT,
				title: 'List Test Prompt Item',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
				prompt: 'Test prompt',
			});
			promptItemUid = promptItem.uid;
		});

		it('should list content guard items', async () => {
			const items = await api.contentGuardItem.list();

			should(items).be.an.Array();
			should(items.length).be.greaterThanOrEqual(2);
			should(items).matchAny((item: ContentGuardItem) => item.uid === imageItemUid);
		});

		it('should list content guard items with filter', async () => {
			const items = await api.contentGuardItem.list({ itemType: ContentGuardItemType.IMAGE });

			should(items).be.an.Array();
			should(items).matchAny((item: ContentGuardItem) => item.uid === imageItemUid);
			should(items).not.matchAny((item: ContentGuardItem) => item.uid === promptItemUid);
		});

		it('should list content guard items by category', async () => {
			const items = await api.contentGuardItem.list({ categoryUids: [categoryUid] });

			should(items).be.an.Array();
			should(items.length).be.greaterThanOrEqual(2);
		});
	});

	describe('get', () => {
		let itemUid: string;

		beforeEach(async () => {
			const item = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'Get Test Item',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
			});
			itemUid = item.uid;
		});

		it('should get content guard item', async () => {
			const item = await api.contentGuardItem.get(itemUid);

			should(item).be.an.instanceOf(ContentGuardItem);
			should(item!.uid).be.equal(itemUid);
			should(item!.title).be.equal('Get Test Item');
			should(item!.itemType).be.equal(ContentGuardItemType.IMAGE);
			should(item!.categoryUid).be.equal(categoryUid);
		});

		it('should return null for non-existing item', async () => {
			const item = await api.contentGuardItem.get('non-existing-item');
			should(item).be.null();
		});
	});

	describe('count', () => {
		beforeEach(async () => {
			await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'Count Test Item 1',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
			});
			await api.contentGuardItem.create({
				itemType: ContentGuardItemType.PROMPT,
				title: 'Count Test Item 2',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
				prompt: 'Test prompt',
			});
		});

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
		let itemUid: string;

		beforeEach(async () => {
			const item = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'Update Test Item',
				description: 'Original Description',
				categoryUid,
				tagUids: [],
			});
			itemUid = item.uid;
		});

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
		let itemUid: string;
		let secondItemUid: string;

		beforeEach(async () => {
			// Create items for bulk operations
			const item1 = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'Bulk Test Item 1',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
			});
			itemUid = item1.uid;

			const item2 = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.PROMPT,
				title: 'Bulk Test Item 2',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
				prompt: 'Test prompt',
			});
			secondItemUid = item2.uid;

			// Create another category for bulk update test
			const category = await api.contentGuardCategory.create({
				organizationUid,
				title: 'Bulk Update Target Category',
				valid: true,
			});
			newCategoryUid = category.uid;
		});

		afterEach(async () => {
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

			const item2 = await api.contentGuardItem.get(secondItemUid);
			should(item2!.categoryUid).be.equal(newCategoryUid);
		});
	});

	describe('delete', () => {
		let itemUid: string;

		beforeEach(async () => {
			const item = await api.contentGuardItem.create({
				itemType: ContentGuardItemType.IMAGE,
				title: 'Delete Test Item',
				description: 'Test Description',
				categoryUid,
				tagUids: [],
			});
			itemUid = item.uid;
		});

		it('should delete content guard item', async () => {
			await api.contentGuardItem.delete(itemUid);
			const item = await api.contentGuardItem.get(itemUid);
			should(item).be.null();
		});
	});
});
