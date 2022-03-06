import { h } from "preact";
import Logger from "js-logger";

import { Header } from './Header';
import { ThemedWindowContent, Window } from "./Window";
import { Store } from '..';
import { useContext, useRef, useState } from 'preact/hooks';
import { EditorPaneGroup } from './EditorPaneGroup';
import { NotificationView } from './NotificationView/NotificationView';

export const App = (): h.JSX.Element => {
    const [, setState] = useState({});
    const store = useContext(Store);
    const canvasRef = useRef(null);
    
    return <Window>
            <canvas width="0px" height="0px" style="width: 0px; height: 0px;" ref={canvasRef} />
            <Header
                title={store.uistate.windowProperties.title}
                leftToolbar={[
                <button class="btn btn-default"
                    onClick={() => {
                        Logger.info("Hello");
                        store.uistate.windowProperties.sidebarPane.toggleHidden();
                    }}>
                    <span class={"icon icon-left-dir"}></span>
                </button>]}
                rightToolbar={[
                    <button class="btn btn-default pull-right"
                    onClick={() => {
                        store.uistate.windowProperties.previewPane.toggleHidden();
                    }}>
                    <span class={"icon icon-right-dir"}></span>
                </button>
                ]}
            ></Header>
            <ThemedWindowContent>
                <NotificationView />
                <EditorPaneGroup />
            </ThemedWindowContent>             
    </Window>
}
