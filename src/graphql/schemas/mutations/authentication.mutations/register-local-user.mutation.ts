import { createEmailHtml, ISendEmailResponse, sendEmail, VerifyEmail } from "@/emails";
import { IUser } from "@/mongodb";
import { getBaseUrl } from "@/utils";
import { arg, inputObjectType, mutationField, objectType } from "nexus";

export const RegisterLocalUserInput = inputObjectType({
	name: "RegisterLocalUserInput",
	definition: (t) => {
		t.field("email", {
			type: "EmailAddress",
			required: true,
			description: "(Unique) The user's email"
		});
		t.field("password", {
			type: "UserPassword",
			required: true,
			description: "The user's decrypted password"
		});
		t.string("username", {
			required: true,
			description: "(Unique) The user's username"
		});
	}
});

export const RegisterLocalUserPayload = objectType({
	name: "RegisterLocalUserPayload",
	description: "The response object from a local register user request",
	definition: (t) => {
		t.boolean("success", {
			nullable: false,
			description: "Whether the registration successfully created a user or not"
		});
		t.string("error", {
			description: "An error will be described if success is false"
		});
		t.field("user", {
			type: "User",
			description: "The user object"
		});
	}
});

export const registerLocalUser = mutationField("registerLocalUser", {
	type: RegisterLocalUserPayload,
	description: "Performs local auth registration (custom username + password)",
	args: {
		input: arg({
			type: "RegisterLocalUserInput",
			required: true
		})
	},
	resolve: async (parent, { input: { email, password, username } }, ctx) => {
		const {
			connectors: { MongoDB }
		} = ctx;

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
	}
});
