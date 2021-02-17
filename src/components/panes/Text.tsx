import { h } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface ITextMenuItemOptions {
    defaultValue: string | undefined
}

export const TextMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, ITextMenuItemOptions>) => {
    return <div class="form-group-item">
        <label>{item.label}</label>
        <input
            class="form-control"
            type="text"
            placeholder="Insert text here…"
            value={
                (item.getter) ? item.getter() : (
                    (item.options.defaultValue) ? item.options.defaultValue : ""
                )
            }
            onInput={(e: Event) => {
                const target = e.target as HTMLInputElement
                
                if (item.setter && target.value) {
                    item.setter(target.value);
                }
            }}
            ></input>
    </div>
}
