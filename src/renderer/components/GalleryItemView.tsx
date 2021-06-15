import { IReactionDisposer, reaction } from 'mobx';
import { Component, FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { PReg, StoryObject } from 'storygraph';
import { Store } from '..';
import { IPlugInRegistryEntry } from '../utils/PlugInClassRegistry';
import { Draggable } from './Draggable';
import { IItem } from './IItem';

interface IGalleryItemViewProps<T extends IItem> {
    item: T
    onClick?: () => void
    onDblClick?: () => void
    children: h.JSX.Element
}

export class GalleryItemView extends Component<IGalleryItemViewProps<IPlugInRegistryEntry<StoryObject>>> {

    reactionDisposer: IReactionDisposer;

    constructor(props: IGalleryItemViewProps<IPlugInRegistryEntry<StoryObject>>) {
        super(props);
        const store = useContext(Store);

    }
    
    render({ item, children, onClick }: IGalleryItemViewProps<IPlugInRegistryEntry<StoryObject>>): h.JSX.Element {
        return <Draggable id={item.id}>
            <li class="gallery-item" onClick={onClick}>
                <span class={`icon ${item.icon}`}></span>
                {children}
            </li>
        </Draggable>
    }

    componentWillUnmount(): void {
        this.reactionDisposer();
    }
}

export const GalleryItemLiner: FunctionalComponent = () => (
    <li class="gallery-item-line "></li>
)
