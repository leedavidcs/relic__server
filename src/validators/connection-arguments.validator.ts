import { IConnectionArguments } from "@/graphql";
import { Schema as JSONSchema, ValidatorResult } from "jsonschema";
import { validator } from "./validator";

export const ConnectionArgumentsSchema: JSONSchema = {
	id: "/ConnectionArguments",
	type: "object",
	properties: {
		first: { type: "number" },
		last: { type: "number" },
		before: {
			type: "object",
			properties: { value: { type: "string" } }
		},
		after: {
			type: "object",
			properties: { value: { type: "string" } }
		}
	},
	additionalProperties: false
};

export const isConnectionArguments = (value: any): value is IConnectionArguments => {
	const result: ValidatorResult = validator.validate(value, ConnectionArgumentsSchema);

	return result.valid;
};
