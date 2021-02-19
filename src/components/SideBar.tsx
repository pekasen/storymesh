import { FunctionalComponent, h, render } from 'preact';

export interface IMenuTemplateOptions {

}

export interface IMenuTemplate<Value = any, Options = any> {
    type: IMenuItemRenderer,
    label: string,
    getter?: () => Value,
    setter?: (arg: Value) => void
    options: Options
}

export interface IMenuItemRenderer {
    (item: IMenuTemplate): h.JSX.Element
}

export interface ISideBarProps {
    items: IMenuTemplate[] 
    onDrop?: (ev: DragEvent) => void
}
    
export const SideBar: FunctionalComponent<ISideBarProps> = ({ items, onDrop }) => {
    
    const menuItems = items.map(item => {
        if (item.type) {
            return item.type(item);
        }
        else
            return <p>This menu item is not available</p>;
    });

    return <form id="side-bar"
        onSubmit={e => e.preventDefault()}
        onDrop={onDrop}
    >
        {(menuItems.length !== 0) ? menuItems : null}
    </form>;
};
