import { inputObjectType } from "nexus";

export const VariableDateTimeInput = inputObjectType({
	name: "VariableDateTimeInput",
	description: "Search items based on a range, or fuzzy date",
	definition: (t) => {
		t.field("before", {
			type: "DateTimeInput",
			description:
				"Returns items such that this property comes before the specified date-time"
		});
		t.field("after", {
			type: "DateTimeInput",
			description: "Returns items such that this property comes after the specified date-time"
		});
		t.field("equal", {
			type: "DateTimeInput",
			description:
				"Returns items such that this property's date-time contains exactly the fields as \
				specifed"
		});
	}
});
