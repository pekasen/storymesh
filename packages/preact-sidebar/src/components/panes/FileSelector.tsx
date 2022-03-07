import { h, JSX } from "preact";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface IFileSelectorMenuItemsOptions {

}

export const FileSelectorMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, IFileSelectorMenuItemsOptions>): JSX.Element => {
    return <div class="form-group-item">
        {
            (item.label !== "") ? <label>{item.label}</label> : null
        }
        <input class="form-control" type="text" value={((item.getter !== undefined) ? item.getter() : undefined)}></input>
        {/* <button class="btn btn-default" onClick={() => {
            const file = window.
            );

            if (file && file.length === 1 && item.valueReference) item.valueReference(file[0]);
        }}>
            load Scene
        </button> */}
        <input type="file" />
    </div>
}
