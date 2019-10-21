import { Paper, Section } from "@/emails/components";
import { select } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FunctionComponent } from "react";
import { useStyles } from "./styles";

export const StandardStory: FunctionComponent = () => {
	const classes = useStyles();

	Faker.seed(1);

	const options = {
		left: "left",
		right: "right",
		center: "center"
	};
	const defaultAlign = "left";
	const align = select<keyof typeof options>("align", options, defaultAlign);

	return (
		<Section align={align}>
			<Paper className={classes.paper}>
				<p>This content is {align} aligned.</p>
			</Paper>
		</Section>
	);
};
