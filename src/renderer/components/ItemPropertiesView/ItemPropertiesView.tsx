// import { MenuItem } from 'electron';
import { reaction } from 'mobx';
import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Store } from '../..';
import { SideBar } from "preact-sidebar";
import Logger from 'js-logger';

export const ItemPropertiesView: FunctionalComponent = () => {
    const { storyContentObjectRegistry, uistate } = useContext(Store);
    
    const res = storyContentObjectRegistry.
    getValue(uistate.selectedItems.first);
    const shortcut = () => {
        const r = storyContentObjectRegistry.getValue(uistate.selectedItems.first)?.menuTemplate.filter(e => e.conditional !== undefined && e.conditional).map(e => e.options.condition())
        console.log("found", r);
        return r
    }
    const [state, setState] = useState({
        items: res?.menuTemplate,
        values: shortcut()
    });


    useEffect(() => {
        const disposer = reaction(
            () => (
                {
                    id: uistate.selectedItems.first,
                    connections: res?.connections.length,
                    connectors: res?.connectors.size,
                    values: shortcut()
                }
            ),
            ({ id, values }) => {
                const items = storyContentObjectRegistry.getValue(id)?.menuTemplate;
                if (items !== undefined && items.length >= 0) {
                    setState({
                        items: items,
                        values: values
                    });
                }
            }
        );

        return () => {
            disposer();
        }
    })
    
    if (state.items) {
        return <SideBar items={state.items} onDrop={(ev: DragEvent) => {
            const data  = ev.dataTransfer?.getData("text");

            if (data != undefined) {
                Logger.info("Drop Received", data);
                if (/\w+\.\w+/gm.test(data)) {
                    Logger.info("edge")
                }
                if (data.startsWith("edge")) {
                    Logger.info("something else")
                }
                if (data.startsWith("internal.modifier")) {
                    Logger.info("modifier")
                }
                // if (data.startsWith())
            } else  console.warn("Received drop without data");
        }}/>
    } else return <div></div>
}
