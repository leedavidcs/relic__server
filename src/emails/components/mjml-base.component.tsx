import { useTheme } from "@/emails/themes";
import { Mjml, MjmlBody, MjmlHead, MjmlPreview, MjmlTitle } from "mjml-react";
import React, { FC, ReactElement } from "react";

interface IProps {
	children: ReactElement;
	title: string;
	preview: string;
}

export const MjmlBase: FC<IProps> = ({ children, title, preview }) => {
	const theme = useTheme();

	return (
		<Mjml>
			<MjmlHead>
				<MjmlTitle>{title}</MjmlTitle>
				<MjmlPreview>{preview}</MjmlPreview>
			</MjmlHead>
			<MjmlBody backgroundColor={theme.background}>{children}</MjmlBody>
		</Mjml>
	);
};
