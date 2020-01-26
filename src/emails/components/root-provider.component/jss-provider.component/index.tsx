import { standardTheme } from "@/emails/themes";
import React, { FC, ReactNode } from "react";
import {
	createGenerateId,
	JssProvider as ReactJssProvider,
	SheetsRegistry,
	ThemeProvider
} from "react-jss";

interface IProps {
	children: ReactNode;
	sheets: SheetsRegistry;
}

export const JssProvider: FC<IProps> = ({ children, sheets }) => {
	return (
		<ReactJssProvider registry={sheets} generateId={createGenerateId()}>
			<ThemeProvider theme={standardTheme}>{children}</ThemeProvider>
		</ReactJssProvider>
	);
};
