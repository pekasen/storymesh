import { h, JSX } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const TextAreaMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, undefined>): JSX.Element => {
    return <div class="form-group-item">
        {
            (item.label !== "") ? <label>{item.label}</label> : null
        }
        <textarea class="form-control" rows={5}  onInput={(e: Event) => {
            const target = e.target as HTMLInputElement
            
            if (item.setter && target.value) {
                item.setter(target.value);
            }
        }}>{(item.getter !== undefined) ? item.getter() : null}</textarea>
    </div>
}

export class TextArea extends MenuTemplate<string, undefined> {
    public type = TextAreaMenuItem;
    public label: string;
    public options: undefined;
    public getter: () => string;
    public setter: (arg: string) => void;

    constructor(label: string, getter: () => string, setter: (arg: string) => void) {
        super();
        this.label = label;
        this.getter = getter;
        this.setter = setter;
    }
} 
