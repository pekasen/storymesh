import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const TextAreaMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, undefined>): JSX.Element => {
    return <div class="form-group-item">
        <label>{item.label}</label>
        <textarea class="form-control" rows={5}  onInput={(e: Event) => {
            const target = e.target as HTMLInputElement
            
            if (item.setter && target.value) {
                item.setter(target.value);
            }
        }}>{(item.getter !== undefined) ? item.getter() : null}</textarea>
    </div>
}
