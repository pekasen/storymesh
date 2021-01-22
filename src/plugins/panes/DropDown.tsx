import { h, JSX } from "preact";
import { IMenuTemplate } from "../../renderer/utils/PlugInClassRegistry";
import { exportClass } from "../helpers/exportClass";

interface IMenuItemRenderer {
    render(item: IMenuTemplate): preact.JSX.Element
}

export class DropDownMenuItem implements IMenuItemRenderer {
    render(item: IMenuTemplate): JSX.Element {
        return <div class="form-group-item">
                            <label>{item.label}</label>
                            <select
                            class="form-control"
                                name={item.label.toLowerCase()}
                                id={item.label.toLowerCase()}
                                size={1}
                                onInput={(e: Event) => {
                                    const target = e.target as HTMLSelectElement;

                                    if (item.valueReference && target) {
                                        if (target.selectedOptions.length === 1) {
                                            item.valueReference(target.selectedOptions.item(0)?.value);
                                        }
                                    }
                                }}
                            >
                            {
                                item.options?.map(e => (
                                    <option value={e}>{e}</option>
                                ))
                            }
                            </select>
                        </div>
    }
}

export const plugInExport = exportClass(
    DropDownMenuItem,
    "",
    "internal.pane.dropdown",
    "",
    true
);
