import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface ICardMenuItemOptions {
    items: IMenuTemplate[]
}

export const CardMenuItem: IMenuItemRenderer = (item: IMenuTemplate<void, ICardMenuItemOptions>): JSX.Element => {
    return <div class="form-group-item">
        <div class="form-control card">
            {
                item.options.items.map(_item => (
                    _item.type(_item)
                ))
            }
        </div>
    </div>
}
