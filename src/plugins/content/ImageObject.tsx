import { FunctionComponent, h } from "preact";
import { INGWebSProps, IMenuTemplate } from "../../renderer/utils/PlugInClassRegistry";

import { action, computed, makeObservable, observable } from 'mobx';
import { StoryGraph } from 'storygraph';
import { StoryObject } from '../helpers/AbstractStoryObject';
import { IContent } from 'storygraph/dist/StoryGraph/IContent';
import { connectionField, nameField } from '../helpers/plugInHelpers';
import { exportClass } from '../helpers/exportClass';
import { createModelSchema } from 'serializr';

/**
 * Our first little dummy PlugIn
 * 
 * @todo It should actually inherit from StoryObject and not StoryGraph...
 */
// @observable
class _ImageObject extends StoryObject {
    public name: string;
    public role: string;
    public isContentNode: boolean;
    public userDefinedProperties: any;
    public childNetwork?: StoryGraph;
    public content: IContent;
    public icon: string;

    public static defaultIcon = "icon-picture"

    constructor() {
        super();

        this.name = "Image";
        this.role = "internal.content.image";
        this.isContentNode = true;
        this.userDefinedProperties = {};
        this.makeDefaultConnectors();

        this.content = {
            resource: "https://source.unsplash.com/random/1920x1080",
            contentType: "url",
            altText: "This is an image",
        }

        this.userDefinedProperties = {
            caption: "This is the image caption"
        }
        // this.menuTemplate = connectionField(this);
        this.icon = _ImageObject.defaultIcon;

        makeObservable(this, {
            name: observable,
            userDefinedProperties: observable,
            connectors: computed,
            menuTemplate: computed,
            content: observable,
            updateName: action,
            updateImageURL: action,
            updateAltText: action,
            updateCaption: action
        });
    }

    public get menuTemplate(): IMenuTemplate[] {
        const ret: IMenuTemplate[] = [
            ...nameField(this),
            {
                label: "url",
                value: () => this.content.resource,
                valueReference: (url: string) => this.updateImageURL(url),
                type: "text"
            },
            {
                label: "Alt-Text",
                value: () => this.content.altText,
                valueReference: (altText: string) => this.updateAltText(altText),
                type: "text"
            },
            {
                label: "Caption",
                value: () => this.userDefinedProperties.caption,
                valueReference: (caption: string) => this.updateCaption(caption),
                type: "textarea"
            },
            ...connectionField(this),
        ];
        if (super.menuTemplate && super.menuTemplate.length >= 1) ret.push(...super.menuTemplate);
        return ret;
    }

    public updateImageURL(newURL: string) {
        this.content.resource = newURL;
    }

    public updateName(name: string): void {
        this.name = name;
    }

    public updateAltText(altText: string) {
        this.content.altText = altText;
    }

    public updateCaption(caption: string) {
        this.userDefinedProperties.caption = caption;
    }

    public getComponent(): FunctionComponent<INGWebSProps> {
        const Comp: FunctionComponent<INGWebSProps> = ({ content }) => {
            const img = <img src={content?.resource}></img>;
            return (
                <div class="imagewrapper">
                    <figure>
                        {
                            this.modifiers.reduce((p, v) => (
                                v.modify(p)
                            ), img)
                        }
                        <figcaption>{this.userDefinedProperties.caption}</figcaption>
                    </figure>
                </div>
            );
        }
        return Comp
    }

    public getEditorComponent(): FunctionComponent<INGWebSProps> {
        return () => <div class="editor-component"></div>
    }
}

createModelSchema(_ImageObject, {})

export const plugInExport = exportClass(
    _ImageObject,
    "Image",
    "internal.content.image",
    _ImageObject.defaultIcon,
    true
);
