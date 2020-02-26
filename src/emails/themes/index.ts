import { standardTheme } from "./standard.theme";

export type CustomTheme = typeof standardTheme;

export * from "./standard.theme";

export const useTheme = () => standardTheme;
