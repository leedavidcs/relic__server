import { inputObjectType } from "nexus";

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
