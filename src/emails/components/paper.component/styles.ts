import { CustomTheme } from "@/emails/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		padding: 20,
		borderRadius: 4,
		boxShadow: [
			"0px 1px 3px 0px rgba(0,0,0,0.2)",
			"0px 1px 1px 0px rgba(0,0,0,0.14)",
			"0px 2px 1px -1px rgba(0,0,0,0.12)"
		].join(),
		backgroundColor: theme.surface,
		color: theme.onSurface
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
