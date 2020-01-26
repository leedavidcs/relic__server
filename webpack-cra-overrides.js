const { addWebpackAlias, addWebpackModuleRule } = require("customize-cra");
const path = require("path");

module.exports = [
	addWebpackAlias({
		"@": path.resolve(__dirname, "src")
	})
];
