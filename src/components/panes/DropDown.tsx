import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface IDropDownMenuItemOptions {
    options: string[]
}

export const DropDownMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, IDropDownMenuItemOptions>): JSX.Element => {
    if (item.getter === undefined) return <div></div>

    return <div class="form-group-item">
        <label>{item.label}</label>
        <select
            class="form-control"
                name={item.label.toLowerCase()}
                id={item.label.toLowerCase()}
                size={1}
                onInput={(e: Event) => {
                    const target = e.target as HTMLSelectElement;

                    if (item.setter && target) {
                        if (target.selectedOptions.length === 1) {
                            item.setter(
                                (target.selectedOptions.item(0)?.value !== undefined) ? target.selectedOptions.item(0)?.value : ""
                            );
                        }
                    }
                }}
            >
            {
                item.options?.options.map((value: string) => (
                    <option value={value} selected={((item.getter !== undefined) ? item.getter() === value : undefined)}>{value}</option>
                ))
            }
        </select>
    </div>
}
