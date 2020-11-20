// import { MenuItem } from 'electron';
import { remote } from 'electron/renderer';
const { Menu, MenuItem } = remote;

import { reaction, IReactionDisposer } from 'mobx';
import { Component, h } from 'preact';
import { StoryGraph, IConnectorPort, IEdge } from 'storygraph';
import { RootStore } from '../../store/rootStore';
import { IMenuTemplate } from '../../utils/PlugInClassRegistry';

export interface IItemPropertiesViewProperties {
    // template: IMenuTemplate[] | undefined
    store: RootStore
}

export class ItemPropertiesView extends Component<IItemPropertiesViewProperties> {

    constructor(props: IItemPropertiesViewProperties) {
        super(props);
        reaction(
            () => [...props.store.uistate.selectedItems.ids],
            () => {
                this.setState({});
            }
        );
    }

    render({ store }: IItemPropertiesViewProperties): h.JSX.Element {
        const template = (() => {
            const res = store.
            storyContentObjectRegistry.
            getValue(store.uistate.selectedItems.first);
            
            return res?.
            menuTemplate;
        })()

        let menuItems: h.JSX.Element[] = [];
        if (template) {
            menuItems = template.map(item => {
                switch(item.type) {
                    case "text": {
                        return <div class="form-group-item">
                                <label>{item.label}</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="Insert text here…"
                                    value={item.value()}
                                    onInput={(e: Event) => {
                                        const target = e.target as HTMLInputElement
                                        
                                        if (item.valueReference && target.value && target.value !== item.value().length) {
                                            item.valueReference(target.value);
                                        }
                                    }}
                                    ></input>
                            </div>
                    }
                    case "textarea": {
                        return <div class="form-group-item">
                            <label>{item.label}</label>
                    <textarea class="form-control" rows={5}  onInput={(e: Event) => {
                                        const target = e.target as HTMLInputElement
                                        
                                        if (item.valueReference && target.value && target.value !== item.value().length) {
                                            item.valueReference(target.value);
                                        }
                                    }}>{item.value() as string}</textarea>
                        </div>
                    }
                    // this is specifically an edge-list!!!
                    case "table": {
                        return <ConnectionTableView store={store} item={item} />
                    }
                    case "dropdown": {
                        return <div class="form-group-item">
                            <label>{item.label}</label>
                            <select
                            class="form-control"
                                name={item.label.toLowerCase()}
                                id={item.label.toLowerCase()}
                                size={1}
                                onInput={(e: Event) => {
                                    const target = e.target as HTMLSelectElement;

                                    if (item.valueReference && target) {
                                        if (target.selectedOptions.length === 1) {
                                            item.valueReference(target.selectedOptions.item(0)?.value);
                                        }
                                    }
                                }}
                            >
                            {
                                item.options?.map(e => (
                                    <option value={e}>{e}</option>
                                ))
                            }
                            </select>
                        </div>
                    }
                    default: return <li>Empty</li>;
                }
            })
        }
        return <form onSubmit={e => e.preventDefault()}>
            { (menuItems.length !== 0) ? menuItems : null }
        </form>
    }
}

export class ConnectionTableView extends Component<IItemView> {

    reactionDisposer: IReactionDisposer

    constructor(props: IItemView) {
        super(props);

            this.reactionDisposer = reaction(
                () => props.item.value().connections.length & props.item.value().connectors.length,
                () => this.setState({})
            );
    }

    render({store, item}: IItemView): h.JSX.Element {
        const myId: string  = item.value().id;

        return <div class="form-group-item">
            <label>{item.label}</label>
            <table class="table-striped">
            {
                item.value().connectors.map((port: IConnectorPort) => (<tr
                    onDragOver={(e: DragEvent) => {
                        e.preventDefault();
                    }}
                    onDrop={(e: DragEvent) => {
                        const id = e.dataTransfer?.getData("text");

                        if (id) {
                            const direction = port.direction;
                            const _item = store.storyContentObjectRegistry.getValue(id);

                            if (_item) {
                                const contextMenu = new Menu();
                                _item.connectors
                                .filter(con => (
                                    con.type === port.type &&
                                    con.direction !== port.direction
                                ))
                                .map((_port: IConnectorPort) => (new MenuItem({
                                    label: _port.name,
                                    click: () => {
                                        console.log("add edge to", id + "." + _port.name);
                                        if (item.valueReference) {
                                            item.valueReference(
                                                store.storyContentObjectRegistry,
                                                id,
                                                port.name,
                                                _port.name,
                                                direction
                                            )
                                        }
                                    }
                                })))
                                .forEach((item: any) => contextMenu.append(item));
            
                                contextMenu.popup({
                                    window: remote.getCurrentWindow(),
                                    x: e.x,
                                    y: e.y
                                });
                            }                     
                        }
                    }}>
                    <th><strong>{port.name}</strong></th>
                    {(
                        item
                        .value()
                        .connections as IEdge[])?.filter((edge: IEdge) =>
                            (port.direction === "in") ?
                            edge.to.match([myId, port.name].join(".")) :
                            edge.from.match([myId, port.name].join(".")))
                            .map((edge: IEdge) => {
                                    return <tr>{(port.direction === "in") ?
                                            <td>{store.storyContentObjectRegistry.getValue(StoryGraph.parseNodeId(edge.from)[0])?.name}</td> :
                                            <td>{store.storyContentObjectRegistry.getValue(StoryGraph.parseNodeId(edge.to)[0])?.name}</td>    
                                        }
                                    </tr>
                    })

                    }
                </tr>))

            }
            
                {/* <tr>
                    <th><strong>To</strong></th>
                    <th><strong>From</strong></th>
                </tr>
                {(item.value().connections as IEdge[])?.map(edge => {
                    return <tr>
                        <td>{store.storyContentObjectRegistry.getValue(StoryGraph.parseNodeId(edge.to)[0])?.name}</td>
                        <td>{store.storyContentObjectRegistry.getValue(StoryGraph.parseNodeId(edge.from)[0])?.name}</td>
                    </tr>
                })} */}
            </table>
        </div>
    }

    componentWillUnmount(): void {
        this.reactionDisposer();
    }
}

export interface IItemView {
    store: RootStore
    item: IMenuTemplate
}
