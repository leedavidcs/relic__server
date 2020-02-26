import React, { FC, useEffect, useRef } from "react";

interface IProps {
	children: string;
}

export const MjmlMounter: FC<IProps> = ({ children }) => {
	const mountDivRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mountDiv: HTMLDivElement | null = mountDivRef.current;

		if (!mountDiv) {
			return;
		}

		mountDiv.innerHTML = children;

		return () => {
			mountDiv.innerHTML = "";
		};
	}, [children]);

	return <div ref={mountDivRef} />;
};
