import { getFileExtension } from '@signageos/lib/dist/Utils/file';

export const getAttachmentExtension = async (file: Buffer) => {
	const extension = await getFileExtension(file);

	return extension === 'jpg' ? 'jpeg' : extension;
};
