import depthLimit from "graphql-depth-limit";

export const depthLimitValidationRules = (maxDepth = Infinity) => depthLimit(maxDepth);
