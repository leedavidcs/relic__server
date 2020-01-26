import React, { FunctionComponent, ReactNode } from "react";

interface IProps {
	/** How its children should be aligned */
	align: "left" | "right" | "center";
	/** Children to be aligned */
	children: ReactNode;
}

/**
 * @description Because position and flexbox aren't supported on enough email clients, but table
 * is supported on most, this component is the recommended way to align items for an email.
 * @author David Lee
 * @date October 19, 2019
 */
export const Section: FunctionComponent<IProps> = ({ align, children }) => {
	return (
		<table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
			<tbody>
				<tr>
					<td align={align}>{children}</td>
				</tr>
			</tbody>
		</table>
	);
};
