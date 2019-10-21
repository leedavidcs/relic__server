import { CustomTheme } from "@/emails/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		borderRadius: 2,
		fontFamily: theme.fontPrimary,
		fontSize: 16,
		textDecoration: "none",
		pointer: "cursor"
	},
	primary: {
		backgroundColor: theme.primary,
		color: theme.onPrimary
	},
	secondary: {
		backgroundColor: theme.secondary,
		color: theme.onSecondary
	},
	error: {
		backgroundColor: theme.error,
		color: theme.onError
	},
	warning: {
		backgroundColor: theme.warning,
		color: theme.onWarning
	},
	small: {
		padding: "2px 4px"
	},
	medium: {
		padding: "4px 8px"
	},
	large: {
		padding: "8px 16px"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
