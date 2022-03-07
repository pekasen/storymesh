import { reaction } from 'mobx';
import { FunctionComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Store } from '../..';
import { Draggable } from '../Draggable';
import { IItem } from '../IItem';
// import "./StoryComponentGallery.css";

const expandGallery = () => {
    const gallery = document.getElementById('item-gallery');
    gallery?.classList.toggle('expanded');
}

interface IGalleryItemViewProps {
    item: any
    onClick?: () => void
    onDblClick?: () => void
    children: h.JSX.Element
}

export const GalleryItemView : FunctionComponent<IGalleryItemViewProps> = ({item, children, onClick}) => (
    <Draggable id={item.id}>
        <li class="gallery-item" onClick={onClick}>
            <span class={`icon ${item.icon}`}></span>
            {children}
        </li>
    </Draggable>
);

export const Gallery: FunctionComponent = ({ children, }) => {

    const store = useContext(Store);
    const [, setState] = useState({});

    // useEffect(() => {
    //     const reactionDisposer = reaction(
    //     () => (store.pluginStore.size),
    //         () => {
    //             console.log("Updated", store.pluginStore);
    //             setState({});
    //         }
    //     );
    //     return () => {
    //         reactionDisposer();
    //     }
    // })
    setTimeout(() => setState({}), 50)

    return <div class="item-gallery-container" id="item-gallery">
        <div class="expander" id="gallery-expander" onClick={expandGallery}>
            <span class="icon icon-up-open"></span>
        </div>
        <h3 class="header expanded-visible">Story Components</h3>
        <ul class="gallery-list">{store.pluginStore.toArray().
                                filter((val) => (val.public)).
                                map((item) => (
                                    <GalleryItemView item={item}>
                                        <span>{item.name}</span>
                                    </GalleryItemView>
        ))}</ul>
    </div>
};

export const StoryComponentGallery: FunctionComponent = () => (
    <Gallery />
)
