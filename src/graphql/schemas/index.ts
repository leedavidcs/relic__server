import { makeSchema, queryComplexityPlugin } from "nexus";
import { nexusPrismaPlugin } from "nexus-prisma";
import path from "path";
import * as mutations from "./mutations";
import * as queries from "./queries";
import * as types from "./types";

const isDebug: boolean = process.env.NODE_ENV !== "production";

const schemaPath: string = path.join(__dirname, "../generated/schema.gen.graphql");
const typegenPath: string = path.join(__dirname, "../generated/typegen.gen.ts");
const nexusTypegenPath: string = path.join(__dirname, "../generated/nexus-prisma-typegen.gen.d.ts");
const contextTypesPath: string = path.join(__dirname, "../context.ts");

const allDefinitions = {
	...mutations,
	...queries,
	...types
};

export const nexusSchema = makeSchema({
	types: allDefinitions,
	shouldGenerateArtifacts: isDebug,
	outputs: {
		schema: schemaPath,
		typegen: typegenPath
	},
	nonNullDefaults: {
		input: false,
		output: false
	},
	plugins: [
		nexusPrismaPlugin({
			outputs: { typegen: nexusTypegenPath },
			computedInputs: {
				user: ({ ctx }) => ({ connect: { id: ctx.user.id } }),
				createdAt: () => undefined,
				updatedAt: () => undefined
			}
		}),
		queryComplexityPlugin()
	],
	typegenAutoConfig: {
		sources: [{ source: contextTypesPath, alias: "ctx" }],
		contextType: "ctx.IServerContextWithUser"
	}
});
