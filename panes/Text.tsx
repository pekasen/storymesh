import { h } from "preact";
import { IMenuTemplate } from "../../renderer/utils/PlugInClassRegistry";
import { exportClass } from "../helpers/exportClass";

interface IMenuItemRenderer {
    render(item: IMenuTemplate): preact.JSX.Element
}

export class TextMenuItem implements IMenuItemRenderer {
    render(item: IMenuTemplate) {
        return <div class="form-group-item">
            <label>{item.label}</label>
            <input
                class="form-control"
                type="text"
                placeholder="Insert text here…"
                value={item.value()}
                onInput={(e: Event) => {
                    const target = e.target as HTMLInputElement
                    
                    if (item.valueReference && target.value && target.value !== item.value().length) {
                        item.valueReference(target.value);
                    }
                }}
                ></input>
        </div>
    }
}

export const plugInExport = exportClass(
    TextMenuItem,
    "",
    "internal.pane.text",
    "",
    true
);
