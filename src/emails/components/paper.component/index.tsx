import classnames from "classnames";
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import { useStyles } from "./styles";

export const Paper = forwardRef<
	HTMLDivElement,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ className, children, ...divProps }, ref) => {
	const classes = useStyles();

	const classNames: string = classnames(classes.root, className);

	return (
		<div className={classNames} {...divProps} ref={ref}>
			{children}
		</div>
	);
});

Paper.displayName = "Paper";
