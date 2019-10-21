import { IVariableDateTimeInput } from "@/graphql";
import { Schema as JSONSchema, ValidatorResult } from "jsonschema";
import { validator } from "./validator";

const DateTimeSchema: JSONSchema = {
	type: "object",
	properties: {
		milliseconds: {
			type: "number",
			minimum: 0,
			maximum: 999
		},
		seconds: {
			type: "number",
			minimum: 0,
			maximum: 59
		},
		minutes: {
			type: "number",
			minimum: 0,
			maximum: 59
		},
		hours: {
			type: "number",
			minimum: 0,
			maximum: 23
		},
		day: {
			type: "number",
			minimum: 1,
			maximum: 31
		},
		month: {
			type: "number",
			minimum: 1,
			maximum: 12
		},
		year: { type: "number" }
	},
	additionalProperties: false,
	required: ["year"]
};

export const DateTimeInputSchema: JSONSchema = {
	id: "/DateTimeInput",
	type: "object",
	properties: {
		before: DateTimeSchema,
		after: DateTimeSchema,
		equal: DateTimeSchema
	},
	additionalProperties: false,
	minProperties: 1
};

export const isVariableDateTimeInput = (value: any): value is IVariableDateTimeInput => {
	const result: ValidatorResult = validator.validate(value, DateTimeInputSchema);

	return result.valid;
};
