import { FunctionComponent, h } from "preact";
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { action, computed, makeObservable, observable } from 'mobx';
import { StoryGraph } from 'storygraph';
import { StoryObject } from '../helpers/AbstractStoryObject';
import { IContent } from 'storygraph/dist/StoryGraph/IContent';
import { connectionField, nameField } from '../helpers/plugInHelpers';
import { exportClass } from '../helpers/exportClass';
import { createModelSchema } from 'serializr';
import { useEffect, useState } from "preact/hooks";
import { MenuTemplate, Text } from "preact-sidebar";
import { ThinSprite } from "babylonjs/Sprites/thinSprite";

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
            altText: "This is an image"
        }

        this.userDefinedProperties = {
            caption: "This is the image caption",
            mediaSource: "Who made this?"
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
            updateCaption: action,
            updateMediaSource: action
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...nameField(this),
            new Text("URL", {defaultValue: ""}, () => this.content.resource, (arg: string) => this.updateImageURL(arg)),
            new Text("Alt text", {defaultValue: "This is an image"}, () => this.content.altText, (arg: string) => this.updateAltText(arg)),
            new Text("Caption", {defaultValue: "This is the caption"}, () => this.userDefinedProperties.caption, (arg: string) => this.updateCaption(arg)),
            new Text("Source", {defaultValue: "Who made dis?"}, () => this.userDefinedProperties.mediaSource, (arg: string) => this.updateMediaSource(arg)),

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

    public updateMediaSource(mediaSource: string) {
        this.userDefinedProperties.mediaSource = mediaSource;
    }

    public getComponent(): FunctionComponent<INGWebSProps> {
        const Comp: FunctionComponent<INGWebSProps> = ({ content }) => {

            const [, setState] = useState({});

            this._rerender = () => {
                setState({});
            }

            const imgContainer = <div id={this.id} class="imagewrapper image">
                    <figure>
                        <img src={content?.resource} alt={this.content.altText} />
                        <figcaption>{this.userDefinedProperties.caption} <span class="media-source">// {this.userDefinedProperties.mediaSource}</span></figcaption>
                    </figure>
                </div>;
                return this.modifiers.reduce((p, v) => (
                        v.modify(p)
                    ), imgContainer)
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
