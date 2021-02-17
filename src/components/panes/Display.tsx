import { h } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const DisplayMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, undefined>) => {
    return <div class="form-group-item">
        <label>{item.label}</label>
        <p>{(item.getter !== undefined) ? item.getter() : null}</p>
    </div>
}
