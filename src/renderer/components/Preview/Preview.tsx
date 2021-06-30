import { Component, createRef, FunctionComponent, h } from 'preact';
import Logger from 'js-logger';
import { INGWebSProps } from '../../utils/PlugInClassRegistry';
import { VerticalPaneGroup, VerticalMiniPane, VerticalPane } from '../VerticalPane/VerticalPane';
import { deepObserve, IDisposer } from 'mobx-utils';
import { useContext } from 'preact/hooks';
import { Store } from '../..';
import { StoryObject } from '../../../plugins/helpers/AbstractStoryObject';
import { RootStore } from '../../store/rootStore';

interface IPreviewWrapperProps extends INGWebSProps {
    topLevelObjectId: string
}

interface IPreviewProps extends IPreviewWrapperProps {
    store: RootStore
}

export const Preview: FunctionComponent<IPreviewWrapperProps> = (props) => {
    const store = useContext(Store);
    return <Preview2 store={store} {...props}/>
}
export class Preview2 extends Component<IPreviewProps> {

    private reactionDisposer: IDisposer
    private ref = createRef<HTMLDivElement>();

    private logger = Logger.get("Preview");

    constructor(props: IPreviewProps) {
        super(props);
        const store = props.store;
        // TODO: debounce user input
        this.reactionDisposer = deepObserve(store, (e) => {
            this.logger.info("Updated", e)
            this.setState({});
        });       
    }

    componentDidMount(): void {
        
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
            <VerticalPaneGroup>
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
                <VerticalPane>
                    <Elem 
                        registry={store.storyContentObjectRegistry}
                        id={topLevelObjectId}
                        renderingProperties={topLevelObject.renderingProperties}
                        content={topLevelObject.content}
                        modifiers={topLevelObject.modifiers}
                        graph={topLevelObject.childNetwork}
                        userDefinedProperties={topLevelObject.userDefinedProperties}
                    />
                </VerticalPane>
            </VerticalPaneGroup>
        </div>
    }

    componentWillUnmount(): void {
        this.reactionDisposer();
    }
}