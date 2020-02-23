import { createEmailHtml, ISendEmailResponse, sendEmail, VerifyEmail } from "@/emails";
import { getBaseUrl } from "@/utils";
import { mutationField, objectType } from "nexus";

export const ResendVerifyEmailPayload = objectType({
	name: "ResendVerifyEmailPayload",
	description: "The response object from a resend verify email request",
	definition: (t) => {
		t.boolean("success", {
			nullable: false,
			description: "Status, on whether the email was successfully resent"
		});
	}
});

export const resendVerifyEmail = mutationField("resendVerifyEmail", {
	type: "ResendVerifyEmailPayload",
	description: "Resends the account verification email to the logged-in user",
	resolve: async (parent, args, { user }) => {
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
	}
});
