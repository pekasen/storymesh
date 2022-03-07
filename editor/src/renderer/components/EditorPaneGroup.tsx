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

export const EditorPaneGroup: FunctionalComponent = () => {
    const [, setState] = useState({});

    const store = useContext(Store);

    useEffect(() => {

        const disposer = reaction(
            () => [
                // store.storyContentObjectRegistry,
                store.uistate.loadedItem
            ],
            () => setState({})
        );

        return () => {
            disposer();
        };
    });

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
                        <StoryComponentGallery />
                    </VerticalFlexPane>
                </VerticalPane>
            </VerticalPaneGroup>
        </Pane>
        <ResizablePane paneState={store.uistate.windowProperties.previewPane} resizable="left">
            <VerticalPaneGroup>
                <VerticalPane>
                    <Preview />
                </VerticalPane>
            </VerticalPaneGroup>
        </ResizablePane>
    </HorizontalPaneGroup>;
    else return <div>Loading</div>
};
