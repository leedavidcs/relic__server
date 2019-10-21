import { withInfo } from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";
import { addDecorator, configure } from "@storybook/react";
import { withThemesProvider } from "storybook-addon-jss-theme";
import { standardTheme } from "./../src/emails/themes/standard.theme";

const themes = [
	{
		name: "standard",
		variables: standardTheme
	}
];

addDecorator(withInfo);
addDecorator(withKnobs);
addDecorator(withThemesProvider(themes));

const loadStories = () => {
	// Dynamically load stories
	const req = require.context("../src", true, /\.?stories(\/index)?\.tsx?$/);

	return req.keys().map(req);
};

configure(loadStories, module);
