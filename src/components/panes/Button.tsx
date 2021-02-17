import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const ButtonMenuItem: IMenuItemRenderer = (item: IMenuTemplate<void, void>): JSX.Element => {
    return <div class="form-group-item">
        <button class="btn btn-default" onClick={() => {
            if (item.setter) item.setter()
        }}>{item.label}</button>
    </div>
}
