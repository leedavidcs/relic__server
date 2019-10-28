import { ValidationContext } from "graphql";
import { depthLimitValidationRules } from "./depth-limit.validation-rules";

interface IGetValidationRulesConfig {
	maxDepth?: number;
}

export const getValidationRules = ({ maxDepth }: IGetValidationRulesConfig) => {
	const validationRules: Array<(context: ValidationContext) => any> = [
		depthLimitValidationRules(maxDepth)
	];

	return validationRules;
};
