import Juice from "juice";
import { flow } from "lodash";
import React, { ComponentType } from "react";
import ReactDOMServer from "react-dom/server";
import { SheetsRegistry } from "react-jss";
import { RootProvider } from "./components/root-provider.component";

const STYLE_TAG = "%STYLE%";
const CONTENT_TAG = "%CONTENT%";

/* eslint-disable max-len */
const emailTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
/* eslint-enable max-len */

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
			<RootProvider sheets={sheets}>
				<Content {...props} />
			</RootProvider>
		);

		const templateWithContent: string = template.replace(CONTENT_TAG, contentStr);

		return templateWithContent;
	};
};

const inlineStyles = (template: string): string => Juice(template);

export const createEmailHtml = <P extends {}>(template: ComponentType<P>, props: P): string => {
	const sheets: SheetsRegistry = new SheetsRegistry();

	const createHtmlTemplate: (template: string) => string = flow(
		interpolateContent(template, props, sheets),
		interpolateStyles(sheets),
		inlineStyles
	);

	const htmlTemplate: string = createHtmlTemplate(emailTemplate);

	return htmlTemplate;
};
