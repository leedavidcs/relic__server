import { CustomTheme } from "@/emails/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		height: "100%",
		width: "100%",
		backgroundColor: theme.background,
		fontFamily: theme.fontPrimary
	},
	paper: {
		width: 600,
		margin: "15px 0"
	},
	content: {
		padding: "42px 90px 54px"
	},
	header: {
		margin: "0 0 36px"
	},
	buttonWrapper: {
		padding: "22px 0"
	},
	altConfirmationLink: {
		color: theme.onSurface,
		opacity: theme.mediumEmphasis
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
