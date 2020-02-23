import { interfaceType } from "nexus";

export const Connection = interfaceType({
	name: "Connection",
	definition: (t) => {
		t.field("pageInfo", {
			type: "PageInfo",
			nullable: false,
			description: "Pagination info, on whether there is more data"
		});
		t.resolveType(() => null);
	}
});
