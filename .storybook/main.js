const path = require("path");
const _ = require("lodash");
const webpackCraOverrides = require("../webpack-cra-overrides");

module.exports = {
	addons: [
		"@storybook/addon-docs",
		"@storybook/addon-knobs",
		"@storybook/addon-viewport",
		{
			name: "@storybook/preset-create-react-app",
			options: {
				tsDocgenLoaderOptions: {
					tsconfigPath: path.resolve(__dirname, "../tsconfig.json")
				}
			}
		}
	],
	webpackFinal: async (config) => {
		const tmpConfig = _.flow.apply(null, webpackCraOverrides)(config);

		tmpConfig.node = { ...tmpConfig.node, fs: "empty" };
		tmpConfig.resolve.extensions.push(".mdx");

		return tmpConfig;
	}
};
