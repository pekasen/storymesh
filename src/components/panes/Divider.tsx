import { h } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";


export const DividerMenuItem: IMenuItemRenderer = (item: IMenuTemplate<undefined, undefined>): h.JSX.Element => {
    return <div class="form-group-item"><hr /></div>
}
export class Divider extends MenuTemplate<undefined, undefined> {
    public type = DividerMenuItem;
    public label: string;
    public options: undefined;
    public getter: undefined;
    public setter: undefined;

    constructor(label: string) {
        super();
        this.label = label;
    }
}
