import { reaction } from 'mobx';
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { IStoryObject } from "storygraph";
import { RootStore } from "../../store/rootStore";

interface IBreadCrumbPropeties {
    loadedObject: IStoryObject
    store: RootStore
}

export const BreadCrumb: FunctionalComponent<IBreadCrumbPropeties> = ({ store, loadedObject }) => {
    const [, setState] = useState({});
    const recursePath = ( obj: IStoryObject ): IStoryObject[] => {
        const res: IStoryObject[] = [];
        res.push(obj);
        console.log(res);

        if (obj.parent) {
            const rObj = store.storyContentObjectRegistry.getValue(obj.parent);
            if (rObj) {
                const r = recursePath(rObj);
                if (r) res.push(...r)
            }
        }

        return res
    }
    const path = recursePath(loadedObject);
    
    reaction(
        () => [path.map(e => e.name), store.uistate.selectedItem],
        (i) => {
            console.log(i)
            setState({});
        }
    );
        
    return <div class="breadcrumb-container">
        <ul>
            {
                path?.reverse().map(e => (
                    <li class="item" onDblClick={() => store.uistate.setLoadedItem(e.id)}>
                        {e.name}
                    </li>
                ))
            }
            {
                (store.uistate.selectedItem !== "") ?
                (<li class="item selected">{store.storyContentObjectRegistry.getValue(store.uistate.selectedItem)?.name}</li>) :
                null
            }
        </ul>
    </div>
}
