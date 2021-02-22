import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Delta from "quill-delta";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";
import Quill from "quill";

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
