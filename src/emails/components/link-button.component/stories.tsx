import { select } from "@storybook/addon-knobs";
import React from "react";
import { LinkButton } from ".";

export default { title: "Components|LinkButton", component: LinkButton };

export const standard = () => {
	const sizeOptions = {
		small: "small",
		medium: "medium",
		large: "large"
	};
	const defaultSize = "medium";
	const size = select<keyof typeof sizeOptions>("size", sizeOptions, defaultSize);

	const typeOptions = {
		primary: "primary",
		secondary: "secondary",
		error: "error",
		warning: "warning"
	};
	const defaultType = "primary";
	const type = select<keyof typeof typeOptions>("type", typeOptions, defaultType);

	return <LinkButton to="#" text="Click Me!" size={size} type={type} />;
};
