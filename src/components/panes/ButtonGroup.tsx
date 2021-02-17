import { h } from "preact";
import { IMenuItemRenderer, IMenuTemplate, IMenuTemplateOptions } from "../SideBar";

export interface IButtonGroupOptions extends IMenuTemplateOptions{
    callbacks: {
        trigger: () => void
        label: string;
    }[]
}

export const ButtonGroupMenuItem: IMenuItemRenderer = (item: IMenuTemplate<void, IButtonGroupOptions>) => (
    <div class="form-group-item">
        <div class={"btn-group"}>
            {
                item.options.callbacks.map((e) => {
                    return <button class="btn btn-default" onClick={() => {
                        if (e.trigger) e.trigger()
                    }}>{e.label}</button>        
                })
            }
        </div>
    </div>
);
