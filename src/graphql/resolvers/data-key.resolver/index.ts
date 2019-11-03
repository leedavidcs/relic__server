import { DataKeys } from "@/mongodb";
import { IEnumResolver, IResolverObject } from "graphql-tools";
import { dataKeyOptions } from "./data-key-options";

const DataKey: IEnumResolver = DataKeys;

const DataKey_Provider: IEnumResolver = {
	IEX_CLOUD: "IEX Cloud"
};

export const DataKeyTypes = { DataKey, DataKey_Provider };

export const DataKeyQueries: IResolverObject = {
	dataKeyOptions
};
