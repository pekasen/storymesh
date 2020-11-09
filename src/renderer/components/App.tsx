import { reaction } from 'mobx';
import { Component, h } from "preact";
import { DragReceiver } from './DragReceiver';
import { GalleryItemView } from './GalleryItemView';
import { Header } from './Header';
import { Pane, PaneGroup, SideBar } from './Pane';
import { StoryComponentGallery } from './StoryComponentGalleryView/StoryComponentGallery';
import { VerticalPane, VerticalPaneGroup, VerticalSmallPane } from './VerticalPane/VerticalPane';
import { Window, WindowContent } from "./Window";
import { RootStore } from '../store/RootStore';
import { ItemPropertiesView } from './ItemPropertiesView/ItemPropertiesView';
import { DummyObjectRenderer } from "./DummyObjectRenderer/DummyObjectRenderer";
import { rootStore } from '..';
// import { List } from "../store/List";
// import { DropzonePane } from "./DropzonePane";
// import { Toolbar } from "./Toolbar";

interface IAppProps {
    store: RootStore
}

export class App extends Component<IAppProps> {

    constructor (props: IAppProps) {
        super(props);

        reaction(
            () => props.store.uistate.activeitem,
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
                    <PaneGroup>
                        <SideBar>
                            <ItemPropertiesView
                                template={
                                    (() => {
                                        const res = store.
                                        storyContentObjectRegistry.
                                        getRegisteredValue(store.uistate.activeitem)

                                        console.log("Template CallBack", res, store.uistate.activeitem);
                                        return res?.
                                        menuTemplate;
                                    })()
                                }
                                store={store.uistate}>
                            </ItemPropertiesView>
                        </SideBar>
                        {/* <DropzonePane uistate={store.uistate} model={store.model}></DropzonePane> */}
                        <Pane>
                            <VerticalPaneGroup>
                                <VerticalPane>
                                        <DummyObjectRenderer store={rootStore}>
                                        </DummyObjectRenderer>
                                </VerticalPane>
                                <VerticalSmallPane>
                                    <StoryComponentGallery>
                                        {
                                            // TODO: compute gallery items from plugin registry
                                            Array.from(store.storyContentTemplatesRegistry.registry).map(([, item]) => (
                                                <GalleryItemView item={{id: item.id}}><p>{item.name}</p></GalleryItemView>
                                            ))
                                        }
                                    </StoryComponentGallery>
                                </VerticalSmallPane>
                            </VerticalPaneGroup>
                        </Pane>
                    </PaneGroup>
                </WindowContent>             
        </Window>
    }
}
