import Logger from 'js-logger';
import { makeAutoObservable, reaction } from 'mobx';
import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { AbstractStoryObject, PReg } from 'storygraph';
import { Container } from 'storymesh-plugin-base';
import { Store } from '../..';
import { StoryObject, IStoryObject } from 'storygraph';
import { MoveableItem } from '../../store/MoveableItem';
import { RootStore } from '../../store/rootStore';
import { DragReceiver } from "../DragReceiver";
import { EdgeRenderer } from '../EdgeRenderer/EdgeRenderer';
import { MoveReceiver } from '../Moveable';
import { StoryObjectView } from '../StoryObjectView/StoryObjectView';

export interface IStoryObjectViewRendererProperties {
    loadedObject: StoryObject
    store: RootStore
}

export const StoryObjectViewRenderer: FunctionalComponent = () => {
        const store = useContext(Store);
        const [,setState] = useState({});
        const loadedObjectId = store.uistate.loadedItem;
        const loadedObject = store.storyContentObjectRegistry.get(loadedObjectId);
        // see if all the subobjects have a MoveableItem attached
        loadedObject?.childNetwork?.nodes.forEach(node => {
            const uis = store.uistate.moveableItems;
            if (!uis.registry.has(node)) {
                uis.register(new MoveableItem(node, 50, 50));
            }
        });

        if (!loadedObject) throw("loadedObject is not defined");
        useEffect(() => {
            const disposeReaction = reaction(
                () => {
                    const id = store.uistate.loadedItem;
                    const network = store.storyContentObjectRegistry.get(id)?.childNetwork;
                    if (!network) throw("network ist not defined!");
                return {
                    id: id,
                    names: network.nodes.map(id => store.storyContentObjectRegistry.get(id)?.name),
                    edges: network.edges.map(e => e.id)
                }},
                (i) => {
                    Logger.info("I changed!", i);
                    setState({});
                }
            );

            return () => {
                disposeReaction();
            };
        });

        const makeNewInstance = (store: RootStore, input: string, loadedObject: IStoryObject, coords: { x: number; y: number; }) => {
            // const instance = new store.pluginStore.get(input)?.constructor() as StoryObject;
            const constructor = PReg.instance().get(input)?.constructor
            if (constructor) {
                const instance = new constructor(true) as AbstractStoryObject;
                loadedObject.childNetwork?.addNode(store.storyContentObjectRegistry, instance);
                if (instance.role === "internal.content.container") ((instance as Container).setup(store.storyContentObjectRegistry));           
                store.uistate.selectedItems.setSelectedItems([instance.id]);
                store.uistate.moveableItems.register(new MoveableItem(instance.id, coords.x, coords.y));
            }
        }

        return <DragReceiver 
        onDrop={(e) => {
            const input = e.dataTransfer?.getData('text');
            const bounds = (e.target as HTMLElement).getBoundingClientRect()
            const coords = {
                x: e.x - bounds.left,
                y: e.y - bounds.top
            };

            Logger.info(coords);

            if (input) {
                const [loc, type, id] = input.split(".");

                if (id) {
                    switch(loc) {
                        case "internal": {
                            switch(type) {
                                case "content": {
                                    makeNewInstance(store, input, loadedObject, coords);
                                    break;
                                }
                                case "container": {
                                    makeNewInstance(store, input, loadedObject, coords);
                                    break;
                                }
                                default: break;
                            }
                            break;
                        }
                        case "external": {
                            break;
                        }
                        default: break;
                    }
                }
            }
            Logger.info(store.storyContentObjectRegistry)
        }
        }>
            <div
                id="node-editor"
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.id === "node-editor"){
                        store.uistate.selectedItems.clearSelectedItems();
                    }
                }
            }>
                <EdgeRenderer />
                {
                    loadedObject.childNetwork?.nodes
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .map(id => store.storyContentObjectRegistry.get(id))
                    .map((object) => {
                        if (object) return <MoveReceiver registry={store.uistate.moveableItems} id={object.id} selectedItems={store.uistate.selectedItems}>
                            <StoryObjectView store={store} object={object as StoryObject}>
                                <span class={`icon ${object.icon}`}>
                                    <p>{object.name}</p>
                                </span> 
                            </StoryObjectView>
                        </MoveReceiver>
                        })
                    }
            </div>
        </DragReceiver>
}
