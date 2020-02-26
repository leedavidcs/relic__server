import { IServerContext } from "@/graphql/context";
import { rule } from "graphql-shield";

export const isAuthenticated = rule({ cache: "contextual" })(
	(parent, args, { user }: IServerContext) => {
		const doesUserExist = Boolean(user);

		return doesUserExist;
	}
);
