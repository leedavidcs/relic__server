import { CustomTheme, useTheme } from "@/emails/themes";
import { MjmlButton } from "mjml-react";
import React, { FC } from "react";

interface IProps {
	children: string | string[];
	size?: "small" | "medium" | "large";
	to: string;
	type?: "primary" | "secondary" | "error" | "warning";
}

const getInnerPadding = (size: IProps["size"]): string => {
	switch (size) {
		case "small":
			return "2px 4px";
		case "medium":
			return "4px 8px";
		default:
			return "8px 16px";
	}
};

const getBackgroundColor = (type: IProps["type"] = "primary", theme: CustomTheme): string => {
	return theme[type];
};

export const Button: FC<IProps> = ({ children, size = "medium", to, type = "primary" }) => {
	const theme = useTheme();

	const innerPadding: string = getInnerPadding(size);
	const backgroundColor: string = getBackgroundColor(type, theme);

	return (
		<MjmlButton
			href={to}
			fontFamily={theme.fontPrimary}
			fontSize={16}
			borderRadius={3}
			innerPadding={innerPadding}
			backgroundColor={backgroundColor}
			color={theme.onPrimary}
		>
			{children}
		</MjmlButton>
	);
};
