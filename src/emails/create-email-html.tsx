import { render } from "mjml-react";
import React, { ComponentType } from "react";

const createJoinedError = (errors: readonly Error[]): Error => {
	return new Error(errors.map(({ message }) => message).join(", "));
};

export const createEmailHtml = <P extends {}>(template: ComponentType<P>, props: P): string => {
	const mjmlElement = React.createElement(template, props);

	const { html, errors } = render(mjmlElement);

	if (errors?.length) {
		throw createJoinedError(errors);
	}

	return html;
};
