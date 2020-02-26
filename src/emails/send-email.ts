import NodeMailer, { SendMailOptions } from "nodemailer";

const emailSenderUser: string = process.env.EMAIL_SENDER_USER || "";
const emailSenderPassword: string = process.env.EMAIL_SENDER_PASSWORD || "";

export type CustomSendEmailOptions = Required<Pick<SendMailOptions, "to" | "subject" | "html">> &
	Pick<SendMailOptions, "text">;

export interface ISendEmailResponse {
	success: boolean;
	error: string | null;
}

export const sendEmail = async (options: CustomSendEmailOptions): Promise<ISendEmailResponse> => {
	const { to, subject, html } = options;

	const transporter = NodeMailer.createTransport({
		service: "gmail",
		auth: { user: emailSenderUser, pass: emailSenderPassword }
	});

	try {
		await transporter.sendMail({ sender: emailSenderUser, to, subject, html });

		return { success: true, error: null };
	} catch (err) {
		return {
			success: false,
			error: err.toString()
		};
	}
};
