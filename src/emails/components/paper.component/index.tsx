import classnames from "classnames";
import React, { forwardRef, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { useStyles } from "./styles";

interface IProps {
	children?: ReactNode;
	className?: string;
}

export const Paper: ForwardRefExoticComponent<IProps & RefAttributes<HTMLDivElement>> = forwardRef<
	HTMLDivElement,
	IProps
>(({ className, children }, ref) => {
	const classes = useStyles();

	const classNames: string = classnames(classes.root, className);

	return (
		<div className={classNames} ref={ref}>
			{children}
		</div>
	);
});
