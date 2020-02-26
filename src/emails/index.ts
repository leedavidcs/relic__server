import { Logger } from "@/utils";
import path from "path";
import * as templates from "./emails";
import { generateTemplates } from "./generate-templates";

export * from "./create-email-html";
export * from "./emails";
export * from "./send-email";

const isDebug: boolean = process.env.NODE_ENV !== "production";

const templatePath: string = path.resolve(__dirname, "./generated");

export const buildEmailTemplates = () => {
	generateTemplates({
		shouldGenerateArtifacts: isDebug,
		output: templatePath,
		templates
	});

	Logger.info("Email templates have been built.");
};
