import { complement, isNil } from "ramda";

export const doesExist = <T>(value: T | null | undefined): value is T => complement(isNil)(value);
export const isNotError = <T>(value: T | Error): value is T => !(value instanceof Error);
