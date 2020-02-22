import { makeSchema, queryComplexityPlugin } from "nexus";
import path from "path";
import * as types from "./definitions";

const schemaPath: string = path.join(__dirname, "../generated/schema.graphql");
const typegenPath: string = path.join(__dirname, "../generated/typegen.d.ts");
const contextTypesPath: string = path.join(__dirname, "../context.ts");

export const nexusSchema = makeSchema({
	types,
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
