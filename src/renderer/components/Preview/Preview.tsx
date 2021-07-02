import { Component, createRef, FunctionComponent, h } from 'preact';
import Logger from 'js-logger';
import { INGWebSProps } from '../../utils/PlugInClassRegistry';
import { VerticalPaneGroup, VerticalMiniPane, VerticalPane } from '../VerticalPane/VerticalPane';
import { deepObserve, IDisposer } from 'mobx-utils';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Store } from '../..';
import { StoryObject } from '../../../plugins/helpers/AbstractStoryObject';
import { RootStore } from '../../store/rootStore';
import logger from 'js-logger';

interface IPreviewWrapperProps extends INGWebSProps {
    topLevelObjectId: string
}

interface IPreviewProps extends IPreviewWrapperProps {
    store: RootStore
}

// export const Preview: FunctionComponent<IPreviewWrapperProps> = (props) => {
//     const store = useContext(Store);
//     return <Preview2 store={store} {...props}/>
// }

export const Preview: FunctionComponent = () => {
    const store = useContext(Store);
    const [state, setState] = useState({
        registry: store.storyContentObjectRegistry,
        object: store.storyContentObjectRegistry.getValue(
            store.uistate.topLevelObjectID
        )
    });
    useEffect(() => {
        const reactionDisposer = deepObserve(store.storyContentObjectRegistry, (e,p,t) => {
            logger.info("Updated", p)
            setState({
                registry: t,
                object: store.storyContentObjectRegistry.getValue(
                    store.uistate.topLevelObjectID
                )
            });
        });

        return () => {
            reactionDisposer();
        }
    });

    const Elem = state.object?.getComponent()

    if (state.object === undefined || Elem === undefined) throw("Error in Preview: cannot find Element");

    return <div class="preview-container" >       
        <Elem 
            registry={state.registry}
            id={state.object.id}
            renderingProperties={state.object.renderingProperties}
            content={state.object.content}
            modifiers={state.object.modifiers}
            graph={state.object.childNetwork}
            userDefinedProperties={state.object.userDefinedProperties}
        />
    </div>
}
export class Preview2 extends Component<IPreviewProps> {

    private reactionDisposer?: IDisposer
    private logger = Logger.get("Preview");

    constructor(props: IPreviewProps) {
        super(props);        
    }
    
    componentDidMount(): void {
        const store = this.props.store;
        this.reactionDisposer = deepObserve(store.storyContentObjectRegistry, (e,p) => {
            this.logger.info("Updated", p)
            this.setState({});
        });  
    }

    render({ }: IPreviewProps): h.JSX.Element {
        const store = useContext(Store);
        const topLevelObjectId = store.uistate.topLevelObjectID;
        const topLevelObject = store.storyContentObjectRegistry.getValue(topLevelObjectId);
        if (!topLevelObject ) throw("BIGGY!");
        // if (!topLevelObject.getComponent) throw("BIGGY!2");
        const Elem = topLevelObject.getComponent();
        if (!Elem) throw("BIGGY!3");

        this.logger.info("Previewing component", Elem);
        // Logger.info("children", children);
        // TODO: refactor so that peripharals are outside this component
        return <div class="preview-container" >
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
            
                    <Elem 
                        registry={store.storyContentObjectRegistry}
                        id={topLevelObjectId}
                        renderingProperties={topLevelObject.renderingProperties}
                        content={topLevelObject.content}
                        modifiers={topLevelObject.modifiers}
                        graph={topLevelObject.childNetwork}
                        userDefinedProperties={topLevelObject.userDefinedProperties}
                    />
        </div>
    }

    componentWillUnmount(): void {
        if (this.reactionDisposer) this.reactionDisposer();
    }
}