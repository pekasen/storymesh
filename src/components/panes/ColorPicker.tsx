import { h, JSX } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const ColorPickerMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, undefined>): JSX.Element => {
    return (
        <div class="form-group-item">
            {
                (item.label !== "") ? <label>{item.label}</label> : null
            }
            <input type="color"
                value={((item.getter !== undefined) ? item.getter() : undefined)}
                onInput={(e: Event) => {
                    const target = e.target as HTMLInputElement
                    const value = String(target.value);
                    if (item.setter && target.value) {
                        item.setter(value);
                    }
                }} />
        </div>
    )
}

export class ColorPicker extends MenuTemplate<string, undefined> {
    public type = ColorPickerMenuItem;
    public label: string;
    public options: undefined;
    public getter?: () => string;
    setter: (val: string) => void;

    constructor(label: string, getter: () => string, setter: (arg: string) => void) {
        super();
        this.label = label;
        this.getter = getter;
        this.setter = setter;
    }
}