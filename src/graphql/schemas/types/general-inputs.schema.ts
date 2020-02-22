import { inputObjectType } from "nexus";

export const DateTimeInput = inputObjectType({
	name: "DateTimeInput",
	description: "Search items based on date-time property",
	definition: (t) => {
		t.int("milliseconds", { description: "Milliseconds of the second (can be from 0-999)" });
		t.int("seconds", { description: "Seconds of the minute (can be 0-59)" });
		t.int("minutes", { description: "Minutes of the hour (can be 0-59)" });
		t.int("hours", { description: "Hours of the day (can be 0-23)" });
		t.int("day", { description: "Date: DD in (MM/DD/YYYY), indexed from 1" });
		t.int("month", { description: "Date: MM in (MM/DD/YYYY), indexed from 1" });
		t.int("year", {
			required: true,
			description: "Date: YYYY in (MM/DD/YYYY), indexed from 1"
		});
	}
});

export const VariableDateTimeInput = inputObjectType({
	name: "VariableDateTimeInput",
	description: "Search items based on a range, or fuzzy date",
	definition: (t) => {
		t.field("before", {
			type: DateTimeInput,
			description:
				"Returns items such that this property comes before the specified date-time"
		});
		t.field("after", {
			type: DateTimeInput,
			description: "Returns items such that this property comes after the specified date-time"
		});
		t.field("equal", {
			type: DateTimeInput,
			description:
				"Returns items such that this property's date-time contains exactly the fields as \
				specifed"
		});
	}
});
