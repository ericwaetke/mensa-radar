import { Component } from "solid-js";

export const Serving: Component<{
	name: string;
}> = (props) => {
	return (
		<div class="flex h-full flex-col items-center justify-center rounded-lg bg-white p-4">
			<h1 class="text-base font-bold">{props.name}</h1>
		</div>
	);
};
