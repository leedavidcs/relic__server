import { useTheme } from "@/emails/themes";
import { MjmlSection } from "mjml-react";
import React, { FC, ReactElement } from "react";

interface IProps {
	children: ReactElement;
}

export const Paper: FC<IProps> = ({ children }) => {
	const theme = useTheme();

	return (
		<MjmlSection padding={20} borderRadius={4} backgroundColor={theme.surface} textAlign="left">
			{children}
		</MjmlSection>
	);
};
