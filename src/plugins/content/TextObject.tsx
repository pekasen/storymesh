import { action, makeObservable, observable } from 'mobx';
// @ts-expect-error
import { FunctionComponent, h } from "preact";
import { MenuTemplate, RichText, TextArea } from "preact-sidebar";
import { createModelSchema, list, ModelSchema, object, optional, primitive } from 'serializr';
import { StoryGraph } from 'storygraph';
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { StoryObject } from '../helpers/AbstractStoryObject';
import { exportClass } from '../helpers/exportClass';
import { connectionField, nameField } from '../helpers/plugInHelpers';
import Markup from "preact-markup";

interface ITextObjectContent {
    resource: string
    altText: string
    contentType: "text"
}

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
    public content: ITextObjectContent;
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
            resource: "",
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
            new TextArea("Content", () => this.content.resource, (arg: string) => this.updateText(arg)),
            // {
            //     label: "Content",
            //     type: "textarea",
            //     value: () => this.content.resource,
            //     valueReference: (text: string) => {this.updateText(text)}
            // },
            //...dropDownField(
            //    this,
            //    () => ["h1", "h2", "h3", "b", "p"],
            //    () => this.userDefinedProperties.tag,
            //    (selection: string) => {
            //        Logger.info(selection);
            //        runInAction(() => this.userDefinedProperties.tag = selection);
            //    }
            //),
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

    public getComponent() {    
        const Comp: FunctionComponent<INGWebSProps> = (args => {
            const p = <Markup type="html" markup={args.content?.resource ? args.content?.resource : ""} />;
            return this.modifiers.reduce((p, v) => {
                return (v.modify(p));
            }, p);
        });

        return Comp
    }
}

const AttributeSchema: ModelSchema<any> = {
    factory: () => ({}),
    props: {
        "*": true
    }
}

const TextContentSchema: ModelSchema<ITextObjectContent> = {
    factory: () => ({
        resource: "",
        altText: "",
        contentType: "text"
    }),
    props: {
        resource: primitive(),
        altText: primitive(),
        contentType: primitive()
    }
}

createModelSchema(_TextObject,{
    content: object(TextContentSchema)
});

export const plugInExport = exportClass(
    _TextObject,
    "Text",
    "internal.content.text",
    _TextObject.defaultIcon,
    true
);
