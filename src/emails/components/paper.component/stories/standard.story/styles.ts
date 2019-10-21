import { CustomTheme } from "@/emails/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative",
		height: "100vh",
		width: "100vw",
		backgroundColor: theme.background
	},
	paper: {
		position: "absolute",
		height: 250,
		width: 500,
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
	content: {
		padding: "0 20px"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
