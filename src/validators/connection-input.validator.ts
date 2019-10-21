import { IConnectionInput } from "@/graphql";
import { Schema as JSONSchema, ValidatorResult } from "jsonschema";
import { validator } from "./validator";

export const ConnectionInputSchema: JSONSchema = {
	id: "/ConnectionInput",
	type: "object",
	properties: {
		someOf: {
			type: "array",
			items: { type: "string" }
		},
		allOf: {
			type: "array",
			items: { type: "string" }
		},
		size: {
			type: "number"
		},
		empty: {
			type: "boolean"
		}
	},
	additionalProperties: false,
	minProperties: 1
};

export const isConnectionInput = (value: any): value is IConnectionInput => {
	const result: ValidatorResult = validator.validate(value, ConnectionInputSchema);

	return result.valid;
};
