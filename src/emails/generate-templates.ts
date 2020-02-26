import fs from "fs-extra";
import { render } from "mjml-react";
import path from "path";
import React, { ComponentType } from "react";

interface IEmailTemplate {
	[key: string]: ComponentType<any>;
}

interface IGenerateFromMjmlOptions {
	shouldGenerateArtifacts?: boolean;
	templates: IEmailTemplate;
	output: string;
}

const createJoinedError = (errors: readonly Error[]): Error => {
	return new Error(errors.map(({ message }) => message).join(", "));
};

export const generateTemplates = (options: IGenerateFromMjmlOptions) => {
	const { shouldGenerateArtifacts = true, templates, output } = options;

	if (!shouldGenerateArtifacts) {
		return;
	}

	const emailHtmlDict: Record<string, string> = Object.keys(templates).reduce((acc, key) => {
		const template = templates[key];

		const withDefaultProps = React.createElement(template);
		const { html, errors } = render(withDefaultProps, {
			minify: false
		});

		if (errors?.length) {
			throw createJoinedError(errors);
		}

		return { ...acc, [key]: html };
	}, {});

	Object.keys(emailHtmlDict).forEach((key) => {
		const outputPath: string = path.join(output, `${key}.html`);
		const emailHtml: string = emailHtmlDict[key];

		fs.ensureFileSync(outputPath);
		fs.writeFileSync(outputPath, emailHtml, {
			encoding: "utf8",
			flag: "w"
		});
	});
};
