import { IUser, UserModel } from "@/mongodb";
import { getRefreshTokenUserId, saveRefreshToken } from "@/redis";
import { Server } from "@/server";
import Jwt, { Algorithm } from "jsonwebtoken";
import { ParameterizedContext } from "koa";
import Passport from "koa-passport";
import { Types } from "mongoose";
import { Strategy } from "passport";
import { LocalAuth } from "./local.authentication";

export * from "./local.authentication";

export interface IWithUser {
	user: IUser | null;
}

const CONVERSION_UNIX_TIME: number = 1000;
const JWT_SIGN_ALGORITHM: Algorithm = "HS256";

const jwtExpiresIn: number = Number(process.env.JWT_EXPIRES_IN);
const jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";
const jwtRefreshExpiresIn: number = Number(process.env.JWT_REFRESH_EXPIRES_IN);
const jwtRefreshSecretKey: string = process.env.JWT_REFRESH_SECRET_KEY || "";

export interface ITokenResponse {
	refreshToken: string;
	token: string;
}

interface IJwtPayload {
	userId: string;
}

const getAuthorizationHeader = (ctx: ParameterizedContext<IWithUser>): string | null => {
	const headerKeys: ReadonlyArray<string> = Object.keys(ctx.headers);
	const authKey = headerKeys.find((key) => key.toLowerCase() === "authorization");

	const authHeader: string | null = typeof authKey === "string" ? ctx.headers[authKey] : null;

	return authHeader;
};

const getBearerToken = (ctx: ParameterizedContext<IWithUser>): string | null => {
	const bearerHeader: string | null = getAuthorizationHeader(ctx);

	const token: string | null =
		typeof bearerHeader === "string" ? bearerHeader.split(" ")[1] : null;

	return token;
};

const verifyBearerToken = (token: string): IJwtPayload => {
	const decoded = Jwt.verify(token, jwtSecretKey) as IJwtPayload;

	return decoded;
};

const getAccessToken = (userId: string): string => {
	const token: string = Jwt.sign({ userId }, jwtSecretKey, {
		algorithm: JWT_SIGN_ALGORITHM,
		expiresIn: Math.floor(Date.now() / CONVERSION_UNIX_TIME) + jwtExpiresIn
	});

	return token;
};

const getRefreshToken = (userId: string): string => {
	const refreshToken: string = Jwt.sign({ userId }, jwtRefreshSecretKey, {
		algorithm: JWT_SIGN_ALGORITHM,
		expiresIn: Math.floor(Date.now() / CONVERSION_UNIX_TIME) + jwtRefreshExpiresIn
	});

	saveRefreshToken(refreshToken, userId);

	return refreshToken;
};

const getUserFromBearerToken = async (bearerToken: string): Promise<IUser | null> => {
	const result: IJwtPayload = verifyBearerToken(bearerToken);

	const { userId } = result;

	const user: IUser | null = await UserModel.findById(userId);

	return user;
};

export const issueTokens = (userId: Types.ObjectId): ITokenResponse => {
	const refreshToken: string = getRefreshToken(userId.toString());
	const accessToken: string = getAccessToken(userId.toString());

	const tokenResponse: ITokenResponse = {
		refreshToken,
		token: accessToken
	};

	return tokenResponse;
};

export const getAuthorizedUser = async (
	ctx: ParameterizedContext<IWithUser>
): Promise<IUser | null> => {
	const bearerToken: string | null = getBearerToken(ctx);

	const user: IUser | null = bearerToken ? await getUserFromBearerToken(bearerToken) : null;

	return user;
};

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
	try {
		const userId = await getRefreshTokenUserId(refreshToken);

		const accessToken: string = getAccessToken(userId.toString());

		return accessToken;
	} catch (err) {
		return null;
	}
};

export const applyAuthentication = ({ app }: Server): void => {
	app.use(Passport.initialize());

	const strategies: Strategy[] = [LocalAuth];

	strategies.forEach((strategy) => {
		Passport.use(strategy);
	});
};
