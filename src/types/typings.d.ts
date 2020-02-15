declare module "*.graphql" {
	import { DocumentNode } from "graphql";
	const defaultDocument: DocumentNode;

	export default defaultDocument;
}

declare interface IDataNode {
	id: string;
}

declare interface Constructor<T> extends Function {
	new (...params: any[]): T;
	prototype: T;
}
