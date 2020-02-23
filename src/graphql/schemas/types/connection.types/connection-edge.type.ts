import { interfaceType } from "nexus";

export const ConnectionEdge = interfaceType({
	name: "ConnectionEdge",
	definition: (t) => {
		t.field("cursor", {
			type: "Cursor",
			nullable: false,
			description: "Cursor for pagination"
		});
		t.resolveType(() => null);
	}
});
