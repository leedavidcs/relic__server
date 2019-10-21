import classnames from "classnames";
import React, { FunctionComponent } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	size?: "small" | "medium" | "large";
	text: string;
	to: string;
	type?: "primary" | "secondary" | "error" | "warning";
}

export const LinkButton: FunctionComponent<IProps> = ({
	className = "",
	size = "medium",
	text,
	to,
	type = "primary"
}) => {
	const classes = useStyles();

	const classNames: string = classnames(classes.root, classes[size], classes[type], className);

	return (
		<a className={classNames} href={to}>
			{text}
		</a>
	);
};
