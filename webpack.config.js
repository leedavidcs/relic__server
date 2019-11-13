const path = require("path");
const R = require("ramda");
const slsw = require("serverless-webpack");
const webpack = require("webpack");

const isSlsW = !R.isEmpty(slsw.lib.entries);

const configFn = (env, argv) => {
	// prettier-ignore
	const mode = isSlsW
		? (slsw.lib.webpack.isLocal ? "development" : "production")
		: (!env.production ? "development" : "production");

	const entry = isSlsW ? slsw.lib.entries : "./index.ts";

	return {
		mode,
		entry,
		devtool: "source-map",
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "src")
			},
			extensions: [".graphql", ".gql", ".mjs", ".js", ".jsx", ".json", ".ts", ".tsx", ".node"]
		},
		output: {
			libraryTarget: "commonjs",
			path: path.join(__dirname, ".webpack"),
			filename: "[name].js"
		},
		target: "node",
		module: {
			rules: [
				{
					exclude: /node_modules/,
					test: /\.(graphql|gql)$/,
					use: [
						{
							loader: "webpack-graphql-loader",
							options: {
								output: "document",
								removeUnusedFragments: true
							}
						}
					]
				},
				{ test: /\.tsx?$/, loader: "ts-loader" },
				{ test: /\.node$/, loader: "node-loader" }
			]
		},
		node: {
			fs: "empty",
			net: "empty",
			tls: "empty"
		},
		externals: {
			"any-promise": "any-promise",
			bufferutil: "bufferutil",
			getos: "getos",
			hiredis: "hiredis",
			mongodb: "mongodb",
			"mongodb/lib/core": "mongodb/lib/core",
			"mongodb-core": "mongodb-core",
			"require-optional": "require-optional",
			saslprep: "saslprep",
			"utf-8-validate": "utf-8-validate"
		}
	};
};

module.exports = isSlsW ? configFn() : configFn;
