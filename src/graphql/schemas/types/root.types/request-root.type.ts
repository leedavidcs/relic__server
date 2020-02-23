import { interfaceType } from "nexus";

export const RequestRoot = interfaceType({
	name: "RequestRoot",
	description: "Common properties for Query, Mutation and Subscription types",
	definition: (t) => {
		t.field("viewer", {
			type: "Viewer",
			description: "The viewer of this request",
			resolve: (parent, args, { user }) => user
		});
		t.resolveType(() => null);
	}
});
