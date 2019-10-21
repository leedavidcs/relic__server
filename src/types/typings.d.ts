declare module "*/schemas/index.graphql" {
	import { DocumentNode } from "graphql";

	const content: DocumentNode;

	export default content;
}

declare interface IDataNode {
	id: string;
}
