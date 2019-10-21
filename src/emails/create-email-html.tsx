import { SheetsRegistry } from "jss";
import Juice from "juice";
import { pipe } from "ramda";
import React, { ComponentType } from "react";
import ReactDOMServer from "react-dom/server";
import { createGenerateId, JssProvider, ThemeProvider } from "react-jss";
import { standardTheme } from "./themes";

const STYLE_TAG: string = "%STYLE%";
const CONTENT_TAG: string = "%CONTENT%";

const emailTemplate: string = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <style type="text/css">${STYLE_TAG}</style>
  </head>
  <body style="width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;">
    ${CONTENT_TAG}
  </body>
</html>
`;

const interpolateStyles = (sheets: SheetsRegistry): ((template: string) => string) => {
	return (template: string): string => {
		const styleStr: string = sheets.toString();

		const templateWithStyle: string = template.replace(STYLE_TAG, styleStr);

		return templateWithStyle;
	};
};

const interpolateContent = <P extends {}>(
	Content: ComponentType<P>,
	props: P,
	sheets: SheetsRegistry
): ((template: string) => string) => {
	return (template: string): string => {
		const contentStr: string = ReactDOMServer.renderToStaticMarkup(
			<JssProvider registry={sheets} generateId={createGenerateId()}>
				<ThemeProvider theme={standardTheme}>
					<Content {...props} />
				</ThemeProvider>
			</JssProvider>
		);

		const templateWithContent: string = template.replace(CONTENT_TAG, contentStr);

		return templateWithContent;
	};
};

const inlineStyles = (template: string): string => Juice(template);

export const createEmailHtml = <P extends {}>(template: ComponentType<P>, props: P): string => {
	const sheets: SheetsRegistry = new SheetsRegistry();

	const createHtmlTemplate = pipe(
		interpolateContent(template, props, sheets),
		interpolateStyles(sheets),
		inlineStyles
	);

	const htmlTemplate: string = createHtmlTemplate(emailTemplate);

	return htmlTemplate;
};
