import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";
import { MenuTemplate } from "../../classes/MenuTemplate";

export const CheckBoxMenuItem: IMenuItemRenderer = (item: IMenuTemplate<void, void>): JSX.Element => {
    return <div class="form-group-item">
        <input type="checkbox" onClick={() => {
            if (item.setter) item.setter()
        }}>{item.label}</input>
    </div>
}

export class CheckBox extends MenuTemplate<undefined, undefined> {
    public type = CheckBoxMenuItem;
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