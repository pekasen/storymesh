import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";
import { MenuTemplate } from "../../classes/MenuTemplate";

export const CheckBoxMenuItem: IMenuItemRenderer = (item: IMenuTemplate<boolean, void>): JSX.Element => {
    
    return <div class="form-group-item">
        <label>{item.label}</label>
        <input checked={(item.getter) ? item.getter() : false} type="checkbox" onClick={(ev) => {
            const target = (ev.target as HTMLInputElement);
            if (item.setter && target.checked) item.setter(target.checked);
        }}>{item.label}</input>
    </div>
}

export class CheckBox extends MenuTemplate<boolean, undefined> {
    public type = CheckBoxMenuItem;
    public label: string;
    public options: undefined;
    public getter?: () => boolean;
    setter: (val: boolean) => void;

    constructor (label: string, getter: () => boolean, setter: (arg: boolean) => void) {
        super();
        this.label = label;
        this.getter = getter;
        this.setter = setter;
    }
}