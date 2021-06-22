import { Component, createRef, FunctionComponent, h } from 'preact';
import Logger from 'js-logger';
import { INGWebSProps } from '../../utils/PlugInClassRegistry';
import { VerticalPaneGroup, VerticalPane } from '../VerticalPane/VerticalPane';
import { deepObserve, IDisposer } from 'mobx-utils';
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Store } from '../..';
import { RootStore } from '../../store/rootStore';

interface IPreviewWrapperProps extends INGWebSProps {
    topLevelObjectId: string
}

interface IPreviewProps extends IPreviewWrapperProps {
    store: RootStore
}

type WidthClass = "XS" | "SM" | "MD" | "LG" | "XL";

interface IPreviewState {
    classes: WidthClass[]
}

export const Preview: FunctionComponent = () => {

    const [state, setState] = useState({
        classes: ["XS"]
    });
    const store = useContext(Store);
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {

        const updater = (newState: any) => {
            setTimeout(() => setState(newState), 500);
        }
        
        const getCurrentWidthClass = (width: number) => {
            const classes = [
                { class: "XS", condition: (x: number) => x >= 0 },
                { class: "SM", condition: (x: number) => x >= 576 },
                { class: "MD", condition: (x: number) => x >= 768 },
                { class: "LG", condition: (x: number) => x >= 960 },
                { class: "XL", condition: (x: number) => x >= 1200 },
            ];
    
            return classes.filter(e => e.condition(width)).map(e => e.class as WidthClass);
        }
        // observe size changes
        const sizeObserver = new ResizeObserver((entries: { contentRect: { width: any; }; }[]) => {
            const storyDivWidth = entries[0].contentRect.width;
            const classString: WidthClass[] = getCurrentWidthClass(storyDivWidth);
            // add this line to debounce sizeObserver
            if (state.classes.length != classString.length) {
                Logger.info("Preview needs update", state.classes);
                updater({
                    classes: classString
                });
            }
        });

        const reactionDisposer = deepObserve(store.storyContentObjectRegistry, (e) => {
            Logger.info("Updated", e)
            updater({
                classes: state.classes
            });
        });

        if (ref.current) {
            sizeObserver.observe(ref.current);
            // const width = ref.current.offsetWidth;
            // const classString: WidthClass[] = getCurrentWidthClass(width);
            // Logger.info("Initilizing Preview")
            // setState({
            //     classes: classString
            // });
        }
        return () => {
            Logger.info("Preview invalidated!")
            sizeObserver.disconnect();
            reactionDisposer();
        }
    });

    const topLevelObject = useMemo(() => {
        const topLevelObjectId = store.uistate.topLevelObjectID;
        const topLevelObject = store.storyContentObjectRegistry.get(topLevelObjectId);
        if (!topLevelObject ) throw("BIGGY!");
        

        return topLevelObject
    }, [store.uistate.topLevelObjectID])

    Logger.info("Previewing component", topLevelObject);
    const Thing = topLevelObject.getComponent()
    // TODO: refactor so that peripharals are outside this component
    return <div class="preview-container" >
            <div class={`storywrapper ${state.classes.join(" ")}`} ref={ref}>
                <div class={"ngwebs-story "}>
                    {Thing({
                        registry: store.storyContentObjectRegistry,
                        id: topLevelObject.id,
                        renderingProperties: topLevelObject.renderingProperties,
                        content: topLevelObject.content,
                        modifiers: topLevelObject.modifiers,
                        graph: topLevelObject.childNetwork,
                        userDefinedProperties: topLevelObject.userDefinedProperties
                    }, { "test": "Hell World"})}
                    {/* <Thing
                        registry={store.storyContentObjectRegistry}
                        id={topLevelObject.id}
                        renderingProperties={topLevelObject.renderingProperties}
                        content={topLevelObject.content}
                        modifiers={topLevelObject.modifiers}
                        graph={topLevelObject.childNetwork}
                        userDefinedProperties={topLevelObject.userDefinedProperties}
                    /> */}
                </div>
            </div>
            {/* <VerticalMiniPane>
                <div class="header-preview">
                <div class="btn-group">
                <button class="btn btn-mini btn-default">
                <span class="icon icon-mobile"></span>
                </button>
                <button class="btn btn-mini btn-default">
                <span class="icon icon-doc"></span>
                </button>
                <button class="active btn btn-mini btn-default">
                <span class="icon icon-monitor"></span>
                </button>
                </div>
                </div>
            </VerticalMiniPane> */}
    </div>
}
