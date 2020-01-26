import classnames from "classnames";
import React, { FunctionComponent } from "react";
import { useStyles } from "./styles";

interface IProps {
	/** Optional class to pass to the anchor (`a`) */
	className?: string;
	/** Size variations. See story */
	size?: "small" | "medium" | "large";
	/** Text to display on the button */
	text: string;
	/** href for the anchor (`a`) */
	to: string;
	/** Color variations. See story */
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
