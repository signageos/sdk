import { log } from '../../../Console/log';
import { IAppletVersionCreatable, IAppletVersionUpdatable } from './IAppletVersion';

export const checkAppletVersionUpdatable = (updatable: IAppletVersionUpdatable) => {
	if (updatable.binary && updatable.entryFile) {
		throw new Error('Applet version can\'t have both entryFile and binary.');
	}
	if (updatable.binary) {
		log(
			'warning',
			'Applet binary option is deprecated. Please use the entryFile option if possible.',
		);
	}
};

export const checkAppletVersionCreatable = (creatable: IAppletVersionCreatable) => {
	if (!creatable.binary && !creatable.entryFile) {
		throw new Error('Applet version must have entryFile or binary.');
	}
	return checkAppletVersionUpdatable(creatable);
};
