export interface IAppletCreatable {
	name: string;
}

interface IApplet extends IAppletCreatable {
	uid: string;
	createdAt: Date;
}

export default IApplet;
