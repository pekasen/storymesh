import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";
import { MenuTemplate } from "./../../classes/MenuTemplate";

export const ButtonMenuItem: IMenuItemRenderer = (item: IMenuTemplate<void, void>): JSX.Element => {
    return <div class="form-group-item">
        <button class="btn btn-default" onClick={() => {
            if (item.setter) item.setter()
        }}>{item.label}</button>
    </div>
}

export class Button extends MenuTemplate<undefined, undefined> {
    public type = ButtonMenuItem;
    public label: string;
    public options: undefined;
    public getter?: undefined;
    setter: () => void;

    constructor (label: string, setter: () => void) {
        super();
        this.label = label;
        this.setter = setter;
    }
}