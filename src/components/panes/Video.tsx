import { h } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface IVideoMenuItemOptions {
    defaultUrl: string | undefined,
    showPlayControls: boolean
}

export const VideoMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, IVideoMenuItemOptions>) => {
    return <div class="form-group-item">
        <label>{item.label}</label>
        <input
            class="form-control"
            type="video"
            placeholder="Insert video url here…"
            value={
                (item.getter) ? item.getter() : (
                    (item.options.defaultUrl) ? item.options.defaultUrl : ""
                )
            }
            onInput={(e: Event) => {
                const target = e.target as HTMLInputElement
                
                if (item.setter && target.value) {
                    item.setter(target.value);
                }
            }}
            ></input>

        <label>{item.label}</label>
        <input
            class="form-control"
            type="checkbox"
            placeholder="Insert video url here…"
            value={
                (item.getter) ? item.getter() : (
                    (item.options.showPlayControls) ? item.options.showPlayControls : true
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

export class Video extends MenuTemplate<string, IVideoMenuItemOptions> {
    public type = VideoMenuItem;
    public label: string;
    public options: IVideoMenuItemOptions;
    public getter: () => string;
    public setter: (arg: string) => void;

    constructor(label: string, options: IVideoMenuItemOptions, getter: () => string, setter: (arg: string) => void) {
        super();
        this.label = label;
        this.options = options;
        this.getter = getter;
        this.setter = setter;
    }
}