import { FunctionComponent, h } from "preact";
import { MenuTemplate, TextArea, Button } from "preact-sidebar";
import { createModelSchema, object } from 'serializr';
import { action, computed, makeObservable, observable } from 'mobx';
import { ObservableStoryObject } from "../helpers/ObservableStoryObject";
import { StoryGraph } from "storygraph";
import { exportClass } from "../../plugins/helpers/exportClass";
import { nameField, connectionField } from "../helpers/plugInHelpers";
import { ContentSchema } from "../../renderer/store/schemas/ContentSchema";
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { useEffect, useRef } from "preact/hooks";


/**
 * Our first little dummy PlugIn
 * 
 * @todo It should actually inherit from StoryObject and not StoryGraph...
 */
// @observable
export class _CustomCode extends ObservableStoryObject {
    public name: string;
    public role: string;
    public isContentNode: boolean;
    public userDefinedProperties: any;
    public childNetwork?: StoryGraph;
    // public content: IContent;
    public icon: string;
    public compiled: Element | null | undefined;

    public static defaultIcon = "icon-picture"

    constructor() {
        super();

        this.name = "Custom Code";
        this.role = "internal.content.customcode";
        this.isContentNode = true;
        this.userDefinedProperties = {};
        this.makeDefaultConnectors();

        this.userDefinedProperties = {
            contents: "",
        }

        this.compiled = undefined;
        // this.menuTemplate = connectionField(this);
        this.icon = _CustomCode.defaultIcon;

        makeObservable(this, {
            name: observable,
            userDefinedProperties: observable,
            compiled: observable,
            connectors: computed,
            menuTemplate: computed,
            updateContents: action,
            updateName: action
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...nameField(this),
            new TextArea("Code", () => this.userDefinedProperties.contents, (arg: string) => this.updateContents(arg)),
            // new Button("Update", () => this.testStuff()),
            ...connectionField(this),
        ];
        if (super.menuTemplate && super.menuTemplate.length >= 1) ret.push(...super.menuTemplate);
        return ret;
    }

    public updateName(name: string) {
        this.name = name;
    }

    public updateContents(newContent: string) {
        const parser = new DOMParser();
        const compiledStuff = parser.parseFromString(newContent, 'text/html').body.firstElementChild;
        console.log(compiledStuff);
        this.compiled = compiledStuff;
    }

    public testStuff() {
        console.log("Wohoo it'S in there!" + this.compiled);
    }

    public getComponent(): FunctionComponent<INGWebSProps> {
        const Comp: FunctionComponent<INGWebSProps> = ({}) => {

            const ref = useRef<HTMLDivElement>();
            useEffect(() => {
                if (ref.current !== null && this.compiled !== null && this.compiled !== undefined) {
                    ref.current?.appendChild(this.compiled);
                }
            });

            const codeContainer = <div id={this.id} class="custom-code">
                        <div ref={ref}></div> 
                </div>;
                return this.modifiers.reduce((p, v) => (
                        v.modify(p)
                    ), codeContainer)
        }
        return Comp
    }

    public getEditorComponent(): FunctionComponent<INGWebSProps> {
        return () => <div class="editor-component"></div>
    }
}

createModelSchema(_CustomCode, {
    content: object(ContentSchema)
})

export const plugInExport = exportClass(
    _CustomCode,
    "Custom Code",
    "internal.content.customcode",
    _CustomCode.defaultIcon,
    true
);
