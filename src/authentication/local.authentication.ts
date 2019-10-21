import { IUser, UserModel } from "@/mongodb";
import BCrypt from "bcryptjs";
import { ParameterizedContext } from "koa";
import Passport from "koa-passport";
import { Types } from "mongoose";
import { Strategy } from "passport-local";
import { issueTokens, ITokenResponse, IWithUser } from ".";

export const LocalAuth: Strategy = new Strategy(
	{
		session: false,
		usernameField: "userIdentifier"
	},
	async (userIdentifier, password, done): Promise<void> => {
		const user: IUser | null = await UserModel.findOne({
			$or: [{ email: userIdentifier }, { username: userIdentifier }]
		});

		if (user === null) {
			done(new Error("Invalid credentials."));

			return;
		}

		const isCorrectPassword: boolean = BCrypt.compareSync(password, user.password);

		isCorrectPassword ? done(null, user._id) : done(new Error("Invalid credentials"));
	}
);

export const authenticateLocal = (
	ctx: ParameterizedContext<IWithUser>
): Promise<ITokenResponse> => {
	return new Promise<ITokenResponse>((resolve, reject) => {
		Passport.authenticate(
			"local",
			{ session: false },
			(err: Error | null, userId: Types.ObjectId): void =>
				err ? reject(err) : resolve(issueTokens(userId))
		)(ctx, async () => {
			return;
		});
	});
};
