import { h } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";


export const DividerMenuItem: IMenuItemRenderer = (item: IMenuTemplate): h.JSX.Element => {
    return <div class="form-group-item"><hr /></div>
}

