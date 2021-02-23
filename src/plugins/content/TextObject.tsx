import { FunctionComponent, h } from "preact";
import { runInAction } from "mobx";
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { action, makeObservable, observable } from 'mobx';
import { StoryGraph } from 'storygraph';
import { IContent } from 'storygraph/dist/StoryGraph/IContent';
import { connectionField, dropDownField, nameField } from '../helpers/plugInHelpers';
import { StoryObject } from '../helpers/AbstractStoryObject';
import { exportClass } from '../helpers/exportClass';
import { createModelSchema } from 'serializr';
import Delta from "quill-delta";
import Op from "quill-delta/dist/Op";
import { MenuTemplate, RichText } from "preact-sidebar";
/**
 * Our first little dummy PlugIn
 * 
 * @todo It should actually inherit from StoryObject and not StoryGraph...
 */
class _TextObject extends StoryObject {
    public name: string;
    public role: string;
    public isContentNode: boolean;
    public userDefinedProperties: {
        tag: string
    };
    public content: IContent;
    public childNetwork?: StoryGraph | undefined;
    public icon: string;
    public static defaultIcon = "icon-newspaper";
    
    constructor() {
        super();
        this.isContentNode = true;
        this.role = "internal.content.text";
        this.name = "Text";
        this.renderingProperties = {
            width: 100,
            order: 1,
            collapsable: false
        };
        this.makeDefaultConnectors();
        this.content = {
            resource: "Type here...",
            altText: "empty",
            contentType: "text"
        };
        this.userDefinedProperties = {
            tag: "p"
        };
        this.icon = _TextObject.defaultIcon;

        makeObservable(this, {
            id: false,
            name:                   observable,
            userDefinedProperties:  observable.deep,
            content:                observable,
            updateName:             action,
            updateText:             action
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...nameField(this),
            new RichText("Content", () => this.content.resource, (arg: Delta) => this.updateText(arg)),
            // {
            //     label: "Content",
            //     type: "textarea",
            //     value: () => this.content.resource,
            //     valueReference: (text: string) => {this.updateText(text)}
            // },
            ...dropDownField(
                this,
                () => ["h1", "h2", "h3", "b", "p"],
                () => this.userDefinedProperties.tag,
                (selection: string) => {
                    console.log(selection);
                    runInAction(() => this.userDefinedProperties.tag = selection);
                }
            ),
            ...connectionField(this)
        ];
        if (super.menuTemplate) ret.push(...super.menuTemplate);
        return ret;
    }

    public getEditorComponent(): FunctionComponent<INGWebSProps> {
        return () => <div class="editor-component">
            <p>{this.content.resource}</p>
        </div>
    }

    public updateName(newValue: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        this.name = newValue;
    }

    public updateText(text: string) {
        if (this.content) this.content.resource = text;
    }

    // renderDelta (delta: Delta): h.JSX.Element {
    //     return delta.ops.map((op: Op) => {
    //       // handle newline chars
      
    //       // handle attributes
    //       if (op.attributes !== undefined) {
    //         return Object.keys(op.attributes).reduce((p, v) => {
    //           switch(v) {
    //           case "bold": return <b>{p}</b>;
    //           case "link": return <a href={(op.attributes !== undefined && op.attributes.link !== undefined) ? op.attributes.link : null}>{p}</a>;
    //           case "color": return <p style={`color: ${(op.attributes !== undefined && op.attributes.color !== undefined) ? op.attributes.color : null}`}>{p}</p>;
    //           }
    //         }, op.insert);
    //         // else handle text content
    //       } else return op.insert
    //     });
    //   }

    public getComponent() {
        
        function renderDelta (delta: Delta) {
            if (!delta.ops) return <p></p>
            return delta.ops.map((op: Op) => {
                // handle newline chars
            
                // handle attributes
                if (op.attributes !== undefined) {
                    return Object.keys(op.attributes).reduce((p, v) => {
                    switch(v) {
                    case "bold": return <b>{p}</b>;
                    case "link": return <a href={(op.attributes !== undefined && op.attributes.link !== undefined) ? op.attributes.link : null}>v</a>;
                    case "color": return <p style={`color: ${(op.attributes !== undefined && op.attributes.color !== undefined) ? op.attributes.color : null}`}>{p}</p>;
                    }
                    }, op.insert);
                    // else handle text content
                } else return op.insert
            });
        }
  

        const Comp: FunctionComponent<INGWebSProps> = (args => {
            console.log("rendering", args);

            // const elemMap = new Map<string, FunctionalComponent>([
            //     ["h1", ({children, ...props}) => (<h1 {...props}>{children}</h1>)],
            //     ["h2", ({children, ...props}) => (<h2 {...props}>{children}</h2>)],
            //     ["h3", ({children, ...props}) => (<h3 {...props}>{children}</h3>)],
            //     ["b", ({children, ...props}) => (<b {...props}>{children}</b>)],
            //     ["p", ({children, ...props}) => (<p {...props}>{children}</p>)],
            // ]);
            // let Elem: FunctionalComponent | undefined;

            // if (args.userDefinedProperties && args.userDefinedProperties.tag) {
            //     Elem = elemMap.get(args.userDefinedProperties.tag);
            // }
            // if (!Elem) {
            //     Elem = ({children, ...props}) => (<p {...props}>{children}</p>)
            // }

           

            // const p = <Elem>{args.content?.resource}</Elem>;
            // p.props.contenteditable = true;

            const p = <p>{renderDelta(new Delta(args.content?.resource as unknown as Op[]))}</p>
            
            return this.modifiers.reduce((p,v) => {
                return (v.modify(p));
            }, p);
        });
        return Comp
    }
}

createModelSchema(_TextObject,{
    
})

export const plugInExport = exportClass(
    _TextObject,
    "Text",
    "internal.content.text",
    _TextObject.defaultIcon,
    true
);
