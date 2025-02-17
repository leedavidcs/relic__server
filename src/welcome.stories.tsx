import { linkTo } from "@storybook/addon-links";
import { Welcome } from "@storybook/react/demo";
import React from "react";

export default { title: "Welcome", component: Welcome };

export const toStorybook = () => <Welcome showApp={linkTo("Button")} />;
