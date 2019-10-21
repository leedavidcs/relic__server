const tsconfigPathsJest = require("tsconfig-paths-jest");
const tsconfig = require("./tsconfig.json");

const moduleNameMapper = tsconfigPathsJest(tsconfig);

module.exports = {
	collectCoverageFrom: ["src/**/*.ts", "index.ts", "!**/*.d.ts"],
	coverageDirectory: "./coverage",
	coverageReporters: ["cobertura", "json", "lcov", "text"],
	moduleFileExtensions: [
		"graphql",
		"js",
		"json",
		"jsx",
		"node",
		"ts",
		"tsx",
		"web.js",
		"web.jsx",
		"web.ts",
		"web.tsx"
	],
	moduleNameMapper,
	setupFiles: ["<rootDir>/.jest/require-context.ts", "<rootDir>/.jest/setup-env.ts"],
	testEnvironment: "node",
	testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test/index.ts"],
	testURL: "http://localhost",
	transform: {
		"\\.(gql|graphql)$": "jest-transform-graphql",
		".*": "babel-jest"
	},
	transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\..+$"]
};
