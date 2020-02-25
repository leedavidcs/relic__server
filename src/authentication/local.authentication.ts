import { Server } from "@/server";
import { User } from "@prisma/client";
import BCrypt from "bcryptjs";
import { ParameterizedContext } from "koa";
import Passport from "koa-passport";
import { Types } from "mongoose";
import { Strategy } from "passport-local";
import { issueTokens, ITokenResponse, IWithUser } from ".";

export const getLocalAuthStrategy = (server: Server): Strategy => {
	const getUserByEmailOrUsername = async (userIdentifier: string): Promise<Maybe<User>> => {
		const { prisma } = server;

		const userByEmail: Maybe<User> = await prisma.user.findOne({
			where: { email: userIdentifier }
		});

		const user: Maybe<User> =
			userByEmail ?? (await prisma?.user.findOne({ where: { username: userIdentifier } }));

		return user;
	};

	return new Strategy(
		{ session: false, usernameField: "userIdentifier" },
		async (userIdentifier, password, done): Promise<void> => {
			const user: Maybe<User> = await getUserByEmailOrUsername(userIdentifier);

			if (!user) {
				done(new Error("Invalid credentials."));

				return;
			}

			const isCorrectPassword: boolean = BCrypt.compareSync(password, user.password);

			if (isCorrectPassword) {
				return done(null, user.id);
			}

			done(new Error("Invalid credentials"));
		}
	);
};

export const authenticateLocal = (
	ctx: ParameterizedContext<IWithUser>
): Promise<ITokenResponse> => {
	return new Promise<ITokenResponse>((resolve, reject) => {
		Passport.authenticate(
			"local",
			{ session: false },
			(err: Error | null, userId: Types.ObjectId): void =>
				err ? reject(err) : resolve(issueTokens(userId))
		)(ctx, () => Promise.resolve(undefined));
	});
};
