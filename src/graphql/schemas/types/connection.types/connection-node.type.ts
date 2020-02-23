import { interfaceType } from "nexus";

export const ConnectionNode = interfaceType({
	name: "ConnectionNode",
	definition: (t) => {
		t.id("id", {
			description: "The uuid of this resource",
			nullable: false
		});
		t.resolveType(() => null);
	}
});
