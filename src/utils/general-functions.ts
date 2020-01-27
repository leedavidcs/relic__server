import { isNil, negate } from "lodash";

export const doesExist = <T>(value: T | null | undefined): value is T => negate(isNil)(value);
export const isNotError = <T>(value: T | Error): value is T => !(value instanceof Error);
