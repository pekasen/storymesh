import { h } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const DisplayMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, undefined>) => {
    return <div class="form-group-item">
        <label>{item.label}</label>
        <p>{(item.getter !== undefined) ? item.getter() : null}</p>
    </div>
}

export class Display extends MenuTemplate<string, undefined> {
    public type = DisplayMenuItem;
    public label: string;
    public options: undefined;
    public getter: (() => string);
    public setter?: undefined;

    constructor(label: string, getter: () => string) {
        super();
        this.label = label;
        this.getter = getter;
    }
}