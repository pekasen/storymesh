import { reaction } from 'mobx';
import { FunctionalComponent, h } from "preact";
import { Pane, HorizontalPaneGroup, ResizablePane } from './Pane/Pane';
import { VerticalPane, VerticalPaneGroup, VerticalSmallPane, VerticalMiniPane, VerticalFlexPane } from './VerticalPane/VerticalPane';
import { ItemPropertiesView } from './ItemPropertiesView/ItemPropertiesView';
import { StoryObjectViewRenderer } from "./StoryObjectViewRenderer/StoryObjectViewRenderer";
import { BreadCrumb } from "./BreadCrumbs/BreadCrumbs";
import { Preview } from './Preview/Preview';
import { StoryComponentGallery } from './StoryComponentGalleryView/StoryComponentGallery';
import { GalleryItemView } from './GalleryItemView';
import { Store } from '..';
import { useContext, useEffect, useState } from 'preact/hooks';
import { StoryObject } from '../../plugins/helpers/AbstractStoryObject';
import { ValueRegistry } from '../utils/registry';

export const EditorPaneGroup: FunctionalComponent = () => {
    
    const store = useContext(Store);
    const [state, setState] = useState({
        registry: store.storyContentObjectRegistry,
        numNodes: store.storyContentObjectRegistry.registry.size,
        loadedItemId: store.uistate.loadedItem
    });

    useEffect(() => {
        const disposer = reaction(
            () => [store.storyContentObjectRegistry, store.storyContentObjectRegistry.registry.size, store.uistate.loadedItem],
            ([registry, numNodes, loadedItem]) => setState({
                registry: registry as ValueRegistry<StoryObject>,
                numNodes: numNodes as number,
                loadedItemId: loadedItem as string
            })
        );

        return () => {
            disposer();
        };
    });

    const loadedItem = store.storyContentObjectRegistry.getValue(state.loadedItemId);

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
                        <StoryComponentGallery>
                            {store.pluginStore.registry.
                                filter((val) => (val.public)).
                                map((item) => (
                                    // @ts-ignore
                                    <GalleryItemView item={item}>
                                        <span>{item.name}</span>
                                    </GalleryItemView>
                                ))}
                        </StoryComponentGallery>
                    </VerticalFlexPane>
                </VerticalPane>
            </VerticalPaneGroup>
        </Pane>
        <ResizablePane paneState={store.uistate.windowProperties.previewPane} resizable="left">
            <VerticalPaneGroup>
                <VerticalPane>
                    <Preview
                        // topLevelObjectId={store.uistate.topLevelObjectID}
                        // id={"g"}
                        // graph={store.storyContentObjectRegistry.getValue(store.uistate.topLevelObjectID)?.childNetwork}
                        // registry={store.storyContentObjectRegistry}
                        // userDefinedProperties={{}}
                    />
                </VerticalPane>
            </VerticalPaneGroup>
        </ResizablePane>
    </HorizontalPaneGroup>;
    else return <div>Loading</div>
};
