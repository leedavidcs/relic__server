import Faker from "faker";
import React, { FunctionComponent } from "react";
import { Paper } from "../..";
import { useStyles } from "./styles";

export const StandardStory: FunctionComponent = () => {
	const classes = useStyles();

	Faker.seed(1);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<p className={classes.content}>{Faker.lorem.paragraphs()}</p>
			</Paper>
		</div>
	);
};
