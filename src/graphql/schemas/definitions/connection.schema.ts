import { inputObjectType, objectType } from "nexus";
import { Cursor } from "./scalars.schema";

export const ConnectionInput = inputObjectType({
	name: "ConnectionInput",
	description: "Search items based on a connection property",
	definition: (t) => {
		t.list.id("someOf", {
			description:
				"An array of IDs. Returns items such that this property contains some of \
				specified IDs"
		});
		t.list.id("allOf", {
			description:
				"An array of IDs. Returns items such that this property contains all of specified \
				IDs"
		});
		t.int("size", {
			description: "Returns items such that this property has this number of values"
		});
		t.boolean("empty", {
			description: "Returns items based on whether or not this property is empty"
		});
	}
});

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
			type: Cursor,
			nullable: true,
			description: "The cursor for the first item in this page"
		});
		t.field("endCursor", {
			type: Cursor,
			nullable: true,
			description: "The cursor for the last item in this page"
		});
	}
});
