import depthLimit from "graphql-depth-limit";

export const depthLimitValidationRules = (maxDepth: number = Infinity) => depthLimit(maxDepth);
