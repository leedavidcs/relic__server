import { RootProvider } from "@/emails/components";
import { DecoratorFunction } from "@storybook/addons";
import React, { ReactElement } from "react";
import { SheetsRegistry } from "react-jss";

export const withRootProvider: DecoratorFunction<ReactElement> = (getStory) => {
	const sheets: SheetsRegistry = new SheetsRegistry();

	return <RootProvider sheets={sheets}>{getStory()}</RootProvider>;
};
