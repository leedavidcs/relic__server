import React from "react";
import { VerifyEmail } from ".";

export default {
	title: "Emails|VerifyEmail"
};

export const standard = () => (
	<VerifyEmail confirmationLink="http://greatestexamplelink.com" username="DavidLee" />
);
