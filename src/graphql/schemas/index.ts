import { makeSchema, queryComplexityPlugin } from "nexus";
import path from "path";
import * as mutations from "./mutations";
import * as queries from "./queries";
import * as types from "./types";

const schemaPath: string = path.join(__dirname, "../generated/schema.graphql");
const typegenPath: string = path.join(__dirname, "../generated/typegen.d.ts");
const contextTypesPath: string = path.join(__dirname, "../context.ts");

const allDefinitions = {
	...mutations,
	...queries,
	...types
};

export const nexusSchema = makeSchema({
	types: allDefinitions,
	outputs: {
		schema: schemaPath,
		typegen: typegenPath
	},
	nonNullDefaults: {
		input: false,
		output: false
	},
	plugins: [queryComplexityPlugin()],
	typegenAutoConfig: {
		sources: [{ source: contextTypesPath, alias: "ctx" }],
		contextType: "ctx.IServerContextWithUser"
	}
});
