import { enumType } from "nexus";

export const DataKey_Provider = enumType({
	name: "DataKey_Provider",
	description: "The provider for the data provided by the data key",
	members: [
		{
			description: "IEX Cloud (see `https://iexcloud.io/`)",
			name: "IEX_CLOUD",
			value: "IEX_CLOUD"
		}
	]
});
