import { LinkButton, Paper, Section } from "@/emails/components";
import React, { FunctionComponent } from "react";
import { useStyles } from "./styles";

export interface IVerifyEmailProps {
	/** The uri the user should click to verify their account */
	confirmationLink: string;
	/** The username to display in the greeting */
	username: string;
}

export const VerifyEmail: FunctionComponent<IVerifyEmailProps> = ({
	confirmationLink,
	username
}) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Section align="center">
				<Paper className={classes.paper}>
					<Section align="left">
						<div className={classes.content}>
							<h1 className={classes.header}>Email Confirmation</h1>
							<p>Hey {username}!</p>
							<p>
								Thanks for signing up for an account! Please confirm your email
								address below, so that we can verify you.
							</p>
							<div className={classes.buttonWrapper}>
								<LinkButton
									to={confirmationLink}
									text="Verify Email"
									size="large"
								/>
							</div>
							<p>
								You can also copy and paste the following link into your browser to
								confirm your email:
							</p>
							<a className={classes.altConfirmationLink} href={confirmationLink}>
								{confirmationLink}
							</a>
						</div>
					</Section>
				</Paper>
			</Section>
		</div>
	);
};
