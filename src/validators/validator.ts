import { Validator } from "jsonschema";
import { ConnectionArgumentsSchema } from "./connection-arguments.validator";
import { ConnectionInputSchema } from "./connection-input.validator";
import { DateTimeInputSchema } from "./date-time-input.validator";

export const validator: Validator = new Validator();

validator.addSchema(ConnectionArgumentsSchema, "/ConnectionArguments");
validator.addSchema(ConnectionInputSchema, "/ConnectionInput");
validator.addSchema(DateTimeInputSchema, "/DateTimeInput");
