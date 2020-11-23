import { IReactionDisposer, reaction } from 'mobx';
import { Component, h } from 'preact';
import { useContext } from 'preact/hooks';
import { IStoryObject } from 'storygraph/dist/StoryGraph/IStoryObject';
import { Store } from '../..';
import { MoveableItem } from '../../store/MoveableItem';
import { RootStore } from '../../store/rootStore';
import { DragReceiver } from "../DragReceiver";
import { MoveReceiver } from '../Moveable';
import { StoryObjectView } from '../StoryObjectView/StoryObjectView';

export interface IStoryObjectViewRendererProperties {
    loadedObject: IStoryObject
    store: RootStore
}

export class StoryObjectViewRenderer extends Component<IStoryObjectViewRendererProperties> {
    
    disposeReaction: IReactionDisposer

    constructor(props: IStoryObjectViewRendererProperties) {
        super(props);

        const store = useContext(Store);

        this.disposeReaction = reaction(
            () => {
                const id = store.uistate.loadedItem;
                const network = store.storyContentObjectRegistry.getValue(id)?.childNetwork;
                if (!network) throw("network ist not defined!");
            return {
                id: id,
                names: network.nodes.map(e => e.name),
                edges: network.edges.map(e => e.id)
            }},
            (i) => {
                console.log("I changed!", i);
                this.setState({});
            }
        );
    }
    
    render(): h.JSX.Element {
        const store = useContext(Store);
        const loadedObjectId = store.uistate.loadedItem;
        const loadedObject = store.storyContentObjectRegistry.getValue(loadedObjectId);

        if (!loadedObject) throw("loadedObject is not defined");

        return <DragReceiver 
        onDrop={(e) => {
            const input = e.dataTransfer?.getData('text');
            const bounds = (e.target as HTMLElement).getBoundingClientRect()
            const coords = {
                x: e.x - bounds.left,
                y: e.y - bounds.top
            };

            console.log(coords);

            if (input) {
                const [loc, type, id] = input.split(".");
            
                console.log("Hello");
                if (id) {
                    switch(loc) {
                        case "internal": {
                            switch(type) {
                                case "content": {
                                    this.makeNewInstance(store, input, loadedObject, coords);
                                    break;
                                }
                                case "container": {
                                    this.makeNewInstance(store, input, loadedObject, coords);
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
            console.log(store.storyContentObjectRegistry)
        }
        }>
            <div
                id="hello-world"
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.id === "hello-world"){
                        store.uistate.selectedItems.setSelectedItems([]);
                    }
                }
            }>
                {
                    loadedObject.childNetwork?.nodes
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    // TODO: declare icon in IStoryObject
                    .map((object) => (
                        <MoveReceiver registry={store.uistate.moveableItems} id={object.id} selectedItems={store.uistate.selectedItems}>
                            <StoryObjectView store={store} object={object}>
                                <span class={`icon ${object.icon}`}>
                                    <p>{object.name}</p>
                                </span> 
                            </StoryObjectView>
                        </MoveReceiver>
                        ))
                    }
            </div>
        </DragReceiver>
    }

    private makeNewInstance(store: RootStore, input: string, loadedObject: IStoryObject, coords: { x: number; y: number; }) {
        const instance = store.storyContentTemplatesRegistry.getNewInstance(input);
        console.log(instance);
        if (instance) {
            loadedObject.childNetwork?.addNode(store.storyContentObjectRegistry, instance);
            store.uistate.selectedItems.setSelectedItems([instance.id]);
            store.uistate.moveableItems.register(new MoveableItem(instance.id, coords.x, coords.y));
        }
    }

    componentWillUnmount(): void {
        this.disposeReaction();
    }
}
