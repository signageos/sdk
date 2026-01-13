import should from 'should';
import nock from 'nock';

import { getNockOpts, nockAuthHeader1, successRes } from '../../helper';
import {
	IContentGuardItem,
	IContentGuardItemCreatable,
	IContentGuardItemUpdatable,
} from '../../../../../src/RestApi/ContentGuard/Item/IContentGuardItem';
import { ContentGuardItemManagement } from '../../../../../src/RestApi/ContentGuard/Item/ContentGuardItemManagement';
import { ContentGuardItem } from '../../../../../src/RestApi/ContentGuard/Item/ContentGuardItem';
import { ContentGuardItemType } from '../../../../../src/RestApi/ContentGuard/Item/ContentGuardItemType';
import { createDependencies } from '../../../../../src/RestApi/Dependencies';

const nockOpts = getNockOpts({});

describe('ContentGuardItemManagement', () => {
	const item: IContentGuardItem = {
		uid: 'item-uid-1',
		itemType: ContentGuardItemType.IMAGE,
		title: 'Test Item',
		description: 'Test Description',
		categoryUid: 'category-uid-1',
		tagUids: ['tag-1', 'tag-2'],
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-01-01T00:00:00.000Z'),
	};

	const promptItem: IContentGuardItem = {
		...item,
		uid: 'item-uid-2',
		itemType: ContentGuardItemType.PROMPT,
		prompt: 'This is a test prompt',
	};

	const validCreateRequest: IContentGuardItemCreatable = {
		itemType: ContentGuardItemType.IMAGE,
		title: 'Test Item',
		description: 'Test Description',
		categoryUid: 'category-uid-1',
		tagUids: ['tag-1', 'tag-2'],
	};

	const validUpdateRequest: IContentGuardItemUpdatable = {
		title: 'Updated Item',
		description: 'Updated Description',
	};

	const imageUploadResponse = {
		upload: {
			request: {
				url: 'https://s3.example.com/upload',
				fields: {
					key: 'content-guard/item/item-uid-1/image123.png',
				},
			},
		},
		file: {
			url: 'https://s3.example.com/content-guard/item/item-uid-1/image123.png',
		},
		imageName: 'image123',
	};

	nock(nockOpts.url, nockAuthHeader1)
		.get('/v1/content-guard/item')
		.reply(200, [item, promptItem])
		.get('/v1/content-guard/item?itemType=IMAGE')
		.reply(200, [item])
		.get('/v1/content-guard/item/item-uid-1')
		.reply(200, item)
		.get('/v1/content-guard/item/non-existing')
		.reply(404, { message: 'Not found' })
		.post('/v1/content-guard/item', validCreateRequest as {})
		.reply(201, { uid: 'item-uid-1' })
		.put('/v1/content-guard/item/item-uid-1', validUpdateRequest as {})
		.reply(204, successRes)
		.delete('/v1/content-guard/item/item-uid-1')
		.reply(204, successRes)
		.get('/v1/content-guard/item/count')
		.reply(200, { count: 10 })
		.get('/v1/content-guard/item/count?categoryUids=category-uid-1')
		.reply(200, { count: 5 })
		.put('/v1/content-guard/item/bulk', { uids: ['item-uid-1', 'item-uid-2'], categoryUid: 'category-uid-2' })
		.reply(204, successRes)
		.delete('/v1/content-guard/item/bulk?uids=item-uid-1&uids=item-uid-2')
		.reply(204, successRes)
		.post('/v1/content-guard/item/item-uid-1/image-upload', { type: 'image/png', md5Checksum: 'abc123' })
		.reply(200, imageUploadResponse)
		.post('/v1/content-guard/item/item-uid-1/image-upload/finish', { imageName: 'image123' })
		.reply(204, successRes);

	const management = new ContentGuardItemManagement(createDependencies(nockOpts));

	const assertItem = (actual: IContentGuardItem, expected: IContentGuardItem) => {
		should(actual.uid).be.equal(expected.uid);
		should(actual.itemType).be.equal(expected.itemType);
		should(actual.title).be.equal(expected.title);
		should(actual.description).be.equal(expected.description);
		should(actual.categoryUid).be.equal(expected.categoryUid);
		should(actual.tagUids).be.deepEqual(expected.tagUids);
		should(actual.createdAt).be.deepEqual(expected.createdAt);
		should(actual.updatedAt).be.deepEqual(expected.updatedAt);
	};

	it('should list items', async () => {
		const items = await management.list();
		should(items).have.lengthOf(2);
		should(items[0]).be.instanceOf(ContentGuardItem);
		assertItem(items[0], item);
	});

	it('should list items with filter', async () => {
		const items = await management.list({ itemType: ContentGuardItemType.IMAGE });
		should(items).have.lengthOf(1);
		assertItem(items[0], item);
	});

	it('should get item by uid', async () => {
		const result = await management.get('item-uid-1');
		should(result).not.be.null();
		should(result).be.instanceOf(ContentGuardItem);
		assertItem(result!, item);
	});

	it('should return null for non-existing item', async () => {
		const result = await management.get('non-existing');
		should(result).be.null();
	});

	it('should create item', async () => {
		const result = await management.create(validCreateRequest);
		should(result.uid).be.equal('item-uid-1');
	});

	it('should update item', async () => {
		await should(management.update('item-uid-1', validUpdateRequest)).be.fulfilled();
	});

	it('should delete item', async () => {
		await should(management.delete('item-uid-1')).be.fulfilled();
	});

	it('should count items', async () => {
		const count = await management.count();
		should(count).be.equal(10);
	});

	it('should count items with filter', async () => {
		const count = await management.count({ categoryUids: ['category-uid-1'] });
		should(count).be.equal(5);
	});

	it('should bulk update category', async () => {
		await should(management.bulkUpdateCategory(['item-uid-1', 'item-uid-2'], 'category-uid-2')).be.fulfilled();
	});

	it('should bulk delete items', async () => {
		await should(management.bulkDelete(['item-uid-1', 'item-uid-2'])).be.fulfilled();
	});

	it('should start image upload', async () => {
		const result = await management.startImageUpload('item-uid-1', {
			type: 'image/png',
			md5Checksum: 'abc123',
		});
		should(result.imageName).be.equal('image123');
		should(result.upload.request.url).be.equal('https://s3.example.com/upload');
		should(result.file.url).be.equal('https://s3.example.com/content-guard/item/item-uid-1/image123.png');
	});

	it('should finish image upload', async () => {
		await should(management.finishImageUpload('item-uid-1', 'image123')).be.fulfilled();
	});
});
