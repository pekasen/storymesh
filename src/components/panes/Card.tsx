import { h, JSX } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface ICardMenuItemOptions {
    items: IMenuTemplate[]
}

export const CardMenuItem: IMenuItemRenderer = (item: IMenuTemplate<void, ICardMenuItemOptions>): JSX.Element => {
    return <div class="form-group-item">
        <div class="form-control card">
            {
                item.options.items.map(_item => (
                    _item.type(_item)
                ))
            }
        </div>
    </div>
}

export class Card extends MenuTemplate<void, ICardMenuItemOptions> {
    public type = CardMenuItem;
    public label: string;
    public options: ICardMenuItemOptions;
    public getter?: undefined;
    public setter?: undefined;

    constructor(label: string, options: ICardMenuItemOptions) {
        super();
        this.label = label;
        this.options = options;
    }
}
