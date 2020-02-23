import { objectType } from "nexus";

export const PageInfo = objectType({
	name: "PageInfo",
	description: "Pagination info, to show if other pages exist",
	definition: (t) => {
		t.boolean("hasNextPage", {
			description: "Pagination info, whether there is more data going forward"
		});
		t.boolean("hasPreviousPage", {
			description: "Pagination info, whether there is more data going backward"
		});
		t.int("count", { description: "Total count of results across all pages" });
		t.field("startCursor", {
			type: "Cursor",
			nullable: true,
			description: "The cursor for the first item in this page"
		});
		t.field("endCursor", {
			type: "Cursor",
			nullable: true,
			description: "The cursor for the last item in this page"
		});
	}
});
