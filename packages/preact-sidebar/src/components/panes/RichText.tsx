import { Component, createRef, h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";
import { MenuTemplate } from "../../classes/MenuTemplate";
import  { Jodit } from "jodit";

export const RichTextMenuItem: IMenuItemRenderer = (item: IMenuTemplate<string, undefined>) => {
    
    class RichText extends Component {
        ref = createRef<HTMLDivElement>();

        render() {
            return <div>
                {
                    (item.label !== "") ? <label>{item.label}</label> : null
                }
                 <textarea class="text-editor" name="text-editor"></textarea>
            </div>
        }

        componentDidMount() {
                const editor = new Jodit('.text-editor');
    
                if (editor) {
                    if (item.getter !== undefined) {
                        editor.value = item.getter();
                    }
        
                    editor.events.on('change', () => {
                        if (item.setter !== undefined && editor !== undefined) {
                            item.setter(editor.value);
                        }
                    });
               }
        }

        componentWillUnmount() {
            if (this.ref && this.ref.current) this.ref.current.remove();
        }
    }
    
    
    // useEffect(() => {
        

    //         // (async () => {
    //         //     import("quill").then((Quill) => {
                    
    //         //     });                
    //         // })();
    //     }
    // });

    return <RichText />;
}

export class RichText extends MenuTemplate<string, undefined> {
    public type = RichTextMenuItem;
    public label: string;
    public options: undefined;
    public getter: (() => string);
    public setter: ((arg: string) => void);

    constructor(label: string, getter: () => string, setter: (arg: string) => void) {
        super();
        this.label = label;
        this.getter = getter;
        this.setter = setter;
    }
}
