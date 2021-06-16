import { reaction } from 'mobx';
import { FunctionalComponent, h } from "preact";
import { Pane, HorizontalPaneGroup, ResizablePane } from './Pane/Pane';
import { VerticalPane, VerticalPaneGroup, VerticalFlexPane } from './VerticalPane/VerticalPane';
import { ItemPropertiesView } from './ItemPropertiesView/ItemPropertiesView';
import { StoryObjectViewRenderer } from "./StoryObjectViewRenderer/StoryObjectViewRenderer";
import { BreadCrumb } from "./BreadCrumbs/BreadCrumbs";
import { Preview } from './Preview/Preview';
import { StoryComponentGallery } from './StoryComponentGalleryView/StoryComponentGallery';
import { Store } from '..';
import { useContext, useEffect, useState } from 'preact/hooks';
import { PReg } from 'storygraph';

export const EditorPaneGroup: FunctionalComponent = () => {
    const [, setState] = useState({});

    const store = useContext(Store);
    // setTimeout(() => {
    //     () => setState({});
    // }, 500);

    useEffect(() => {

        const disposer = reaction(
            () => [
                store.storyContentObjectRegistry,
                store.uistate.loadedItem
            ],
            () => setState({})
        );

        return () => {
            disposer();
        };
    });

    // const timeout = setTimeout(() => {
    //     setState({});
    // }, 500);

    const loadedItem = store.storyContentObjectRegistry.get(store.uistate.loadedItem);

    if (loadedItem) return <HorizontalPaneGroup>
        <ResizablePane paneState={store.uistate.windowProperties.sidebarPane} resizable="right" classes={["sidebar"]}>
            <ItemPropertiesView />
        </ResizablePane>
        <Pane>
            <VerticalPaneGroup>
                <VerticalPane>
                        <BreadCrumb store={store} loadedObject={loadedItem}></BreadCrumb>
                    <StoryObjectViewRenderer />
                    <VerticalFlexPane>
                        <StoryComponentGallery />^
                    </VerticalFlexPane>
                </VerticalPane>
            </VerticalPaneGroup>
        </Pane>
        <ResizablePane paneState={store.uistate.windowProperties.previewPane} resizable="left">
            <Preview
                topLevelObjectId={store.uistate.topLevelObjectID}
                id={"g"}
                graph={store.storyContentObjectRegistry.get(store.uistate.topLevelObjectID)?.childNetwork}
                registry={store.storyContentObjectRegistry}
                userDefinedProperties={{}}
            >
            </Preview>
        </ResizablePane>
    </HorizontalPaneGroup>;
    else return <div>Loading</div>
};
