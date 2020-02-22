import {
	authenticateLocal,
	ITokenResponse,
	refreshAccessToken as _refreshAccessToken
} from "@/authentication";
import { createEmailHtml, ISendEmailResponse, sendEmail, VerifyEmail } from "@/emails";
import { IUser } from "@/mongodb";
import { getBaseUrl, OperationUnavailableError } from "@/utils";
import { IResolverObject } from "graphql-tools";
import { FieldResolver } from "nexus";

const loginLocalUser: FieldResolver<"Mutation", "loginLocalUser"> = async (
	parent,
	{ input: { userIdentifier, password } },
	{ koaCtx }
) => {
	if (koaCtx === null) {
		throw new OperationUnavailableError();
	}

	/* tslint:disable:no-object-mutation */
	koaCtx.request.body = {
		userIdentifier,
		password
	};
	/* tslint:enable:no-object-mutation */

	const tokens: ITokenResponse = await authenticateLocal(koaCtx);

	return tokens;
};

const refreshAccessToken: FieldResolver<"Mutation", "refreshAccessToken"> = async (
	parent,
	{ input: { refreshToken } }
) => {
	const accessToken: string | null = await _refreshAccessToken(refreshToken);

	if (accessToken === null) {
		throw new Error("Could not refresh access token.");
	}

	return {
		refreshToken,
		token: accessToken
	};
};

const registerLocalUser: FieldResolver<"Mutation", "registerLocalUser"> = async (
	parent,
	{ input: { email, password, username } },
	{ connectors: { MongoDB } }
) => {
	const UserModel = MongoDB.get<IUser>("User");

	const existingUser: IUser | null = await UserModel.findOne({ email });

	if (existingUser !== null) {
		return {
			success: false,
			error: "User already exists.",
			user: existingUser
		};
	}

	const newUser: IUser = await UserModel.create({ email, password, username });

	const emailTemplate: string = createEmailHtml(VerifyEmail, {
		confirmationLink: `${getBaseUrl()}/verifyEmail/${newUser.id}`,
		username: newUser.username
	});
	const emailResponse: ISendEmailResponse = await sendEmail({
		to: email,
		subject: "Confirm your account",
		html: emailTemplate
	});

	return {
		success: emailResponse.success,
		error: emailResponse.error,
		user: newUser
	};
};

const resendVerifyEmail: FieldResolver<"Mutation", "resendVerifyEmail"> = async (
	parent,
	args,
	{ user }
) => {
	const { email, id, username } = user;

	const emailTemplate: string = createEmailHtml(VerifyEmail, {
		confirmationLink: `${getBaseUrl()}/verifyEmail/${id}`,
		username
	});
	const emailResponse: ISendEmailResponse = await sendEmail({
		to: email,
		subject: "Confirm your account",
		html: emailTemplate
	});

	const { success } = emailResponse;

	return { success };
};

export const AuthenticationMutations: IResolverObject = {
	loginLocalUser,
	refreshAccessToken,
	registerLocalUser,
	resendVerifyEmail
};
