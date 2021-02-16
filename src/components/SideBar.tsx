import { FunctionalComponent, h } from 'preact';
import { IMenuItemRenderer } from "../../../plugins/helpers/IMenuItemRenderer";
import { IMenuTemplate } from '../../utils/PlugInClassRegistry';
import { useContext } from 'preact/hooks';
import { Store } from '../..';


export const SideBar: FunctionalComponent<{ items: IMenuTemplate[]; }> = ({ items }) => {
    const { pluginStore } = useContext(Store);
    const menuItems = items.map(item => {
        const ret = pluginStore.getNewInstance(`internal.pane.${item.type}`);
        if (ret)
            return (ret as IMenuItemRenderer).render(item);
        else
            return <p>NUILLL</p>;
    });
    const onDrop = (event: DragEvent) => {
        const data = event.dataTransfer?.getData("text");
        if (data) {
            // const instace = pluginStore.getNewInstance(data) as AbstractStoryModifier;
            // if (instace) res?.addModifier(instace);
        }
    };

    return <form onSubmit={e => e.preventDefault()} onDrop={onDrop}>
        {(menuItems.length !== 0) ? menuItems : null}
    </form>;
};
