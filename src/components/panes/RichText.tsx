import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Delta from "quill-delta";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";
import Quill from "quill";
import { MenuTemplate } from "../../classes/MenuTemplate";

export const RichTextMenuItem: IMenuItemRenderer = (item: IMenuTemplate<Delta, undefined>) => {
    const ref = useRef<HTMLDivElement>(undefined);
    
    useEffect(() => {
        if (ref.current !== null) {
            const quill = new Quill(ref.current, {
                modules: {
                    toolbar: [
                        [{
                            header: [1, 2, false
                        ]}],
                        ["bold", "link", "underline"],
                        ["link", "code-block"]
                    ]
                }
            });

            if (item.getter !== undefined) {
                quill.setContents(item.getter());
            }

            quill.on('text-change', () => {
                console.log(quill.getContents());
                if (item.setter !== undefined) {
                    item.setter(quill.getContents())
                }
            });

            // (async () => {
            //     import("quill").then((Quill) => {
                    
            //     });                
            // })();
        }
    });

    return <div>
        <label>{item.label}</label>
        <div ref={ref}></div>
    </div>
}

export class RichText extends MenuTemplate<Delta, undefined> {
    public type = RichTextMenuItem;
    public label: string;
    public options: undefined;
    public getter: (() => Delta);
    public setter: ((arg: Delta) => void);

    constructor(label: string, getter: () => Delta, setter: (arg: Delta) => void) {
        super();
        this.label = label;
        this.getter = getter;
        this.setter = setter;
    }
}
