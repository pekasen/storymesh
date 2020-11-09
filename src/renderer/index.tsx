// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { App } from "./components/App";
import { render, h } from "preact";
import { registerHandlers } from './utils/registerHandlers';
import { RootStore } from './store/rootStore';

export const rootStore = new RootStore();

registerHandlers();

const root = document.getElementById("preact-root") as HTMLElement;
render(
    <App uistate={rootStore.uistate}></App>,
    root
);
