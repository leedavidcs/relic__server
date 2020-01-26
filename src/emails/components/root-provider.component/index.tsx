import React, { FC, ReactNode } from "react";
import { SheetsRegistry } from "react-jss";
import { JssProvider } from "./jss-provider.component";

interface IProps {
	children: ReactNode;
	sheets: SheetsRegistry;
}

export const RootProvider: FC<IProps> = ({ children, sheets }) => {
	return <JssProvider sheets={sheets}>{children}</JssProvider>;
};
