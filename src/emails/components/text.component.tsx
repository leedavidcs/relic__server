import { useTheme } from "@/emails/themes";
import { MjmlText } from "mjml-react";
import React, { FC } from "react";

const DEFAULT_FONT_SIZE = 16;

interface IProps {
	children: string | string[];
	fontSize?: number;
	textDecoration?: string;
}

export const Text: FC<IProps> = ({ children, fontSize = DEFAULT_FONT_SIZE, textDecoration }) => {
	const theme = useTheme();

	return (
		<MjmlText
			fontFamily={theme.fontPrimary}
			color={theme.onSurface}
			fontSize={fontSize}
			textDecoration={textDecoration}
		>
			{children}
		</MjmlText>
	);
};
