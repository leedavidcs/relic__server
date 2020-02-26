import { Button, MjmlBase, Paper, Text } from "@/emails/components";
import { MjmlColumn, MjmlSpacer } from "mjml-react";
import React, { FC } from "react";

interface IProps {
	confirmationLink: string;
	username: string;
}

export const VerifyEmail: FC<IProps> = ({
	confirmationLink = "https://google.com",
	username = "testuser"
}) => {
	return (
		<MjmlBase title="Verify Email" preview="Verify your email">
			<Paper>
				<MjmlColumn>
					<Text fontSize={32}>Email Confirmation</Text>
					<MjmlSpacer height={36} />
					<Text>Hey {username}!</Text>
					<Text>
						Thanks for signing up for an account! Please confirm your email address
						below, so that we can verify you.
					</Text>
					<MjmlSpacer height={22} />
					<Button size="large" to={confirmationLink}>
						Verify Email
					</Button>
					<Text>
						You can also copy and paste the following link into your browser to confirm
						your email:
					</Text>
					<Text textDecoration="underline">{confirmationLink}</Text>
				</MjmlColumn>
			</Paper>
		</MjmlBase>
	);
};
