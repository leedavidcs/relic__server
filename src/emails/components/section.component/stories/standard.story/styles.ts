import { CustomTheme } from "@/emails/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	paper: {
		padding: 10,
		height: 250,
		width: 500
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
