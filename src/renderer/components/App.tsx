import { reaction } from 'mobx';
import { Component, FunctionalComponent, h } from "preact";

import { GalleryItemView } from './GalleryItemView';
import { Header } from './Header';
import { Pane, PaneGroup, SideBar, HorizontalPaneGroup } from './Pane';
import { StoryComponentGallery } from './StoryComponentGalleryView/StoryComponentGallery';
import { VerticalPane, VerticalPaneGroup, VerticalSmallPane, VerticalMiniPane } from './VerticalPane/VerticalPane';
import { Window, WindowContent } from "./Window";
import { DropzonePane } from "./DropzonePane";
import { RootStore } from '../store/rootStore';
import { ItemPropertiesView } from './ItemPropertiesView/ItemPropertiesView';
import { DummyObjectRenderer } from "./DummyObjectRenderer/DummyObjectRenderer";
import { BreadCrumb } from "./BreadCrumbs/BreadCrumbs";
import { IStoryObject } from 'storygraph';
import { ConnectorView } from './Connector/ConnectorView';

interface IAppProps {
    store: RootStore
}

export class App extends Component<IAppProps> {

    constructor (props: IAppProps) {
        super(props);

        reaction(
            () => [props.store.uistate.loadedItem],
            () => this.setState({})
        );
    }

    public render({ store }: IAppProps): h.JSX.Element {
        return <Window>
                <Header
                    title={store.uistate.windowProperties.title}
                    leftToolbar={[
                    <button class="btn btn-default"
                        onClick={() =>{
                            store.uistate.toggleSidebar();
                        }}>
                        <span class="icon icon-left-dir"></span>
                    </button>]}
                ></Header>
                <WindowContent>
                    <EditorPaneGroup store={store} loadedItem={store.storyContentObjectRegistry.getValue(store.uistate.loadedItem) as IStoryObject}></EditorPaneGroup>
                </WindowContent>             
        </Window>
    }
}

interface EditorPaneGroupProperties {
    loadedItem: IStoryObject
    store: RootStore
}

const EditorPaneGroup: FunctionalComponent<EditorPaneGroupProperties> = ({loadedItem, store}) => {
    return <PaneGroup>
        <HorizontalPaneGroup>
        <SideBar>
            <ItemPropertiesView
                store={store}>
            </ItemPropertiesView>
        </SideBar>
        <DropzonePane uistate={store.uistate}></DropzonePane>
        <Pane>
            <VerticalPaneGroup>
                <VerticalMiniPane>
                    <BreadCrumb store={store} loadedObject={loadedItem}></BreadCrumb>
                </VerticalMiniPane>
                <VerticalPane>
                        <DummyObjectRenderer loadedObject={loadedItem} store={store}>
                        </DummyObjectRenderer>
                </VerticalPane>
                <VerticalSmallPane>
                    {
                        Array.from(store.storyContentTemplatesRegistry.registry).map(([, item]) => (
                            <ConnectorView item={{id: item.id}} onDrag={() => {
                                console.log("connector message");
                            }}><span>{item.name}</span></ConnectorView>
                        ))
                    }
                {/*  
                    <StoryComponentGallery>
                        {
                            // TODO: compute gallery items from plugin registry
                            Array.from(store.storyContentTemplatesRegistry.registry).map(([, item]) => (
                                <GalleryItemView item={{id: item.id}}><span>{item.name}</span></GalleryItemView>
                            ))
                        }
                    </StoryComponentGallery>
                */}
                </VerticalSmallPane>
            </VerticalPaneGroup>
        </Pane>
        </HorizontalPaneGroup>
    </PaneGroup>
};
