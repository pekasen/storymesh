import { FunctionComponent, h } from "preact";
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { action, computed, makeObservable, observable } from 'mobx';
import { StoryGraph } from 'storygraph';
import { StoryObject } from '../helpers/AbstractStoryObject';
import { connectionField, nameField } from '../helpers/plugInHelpers';
import { exportClass } from '../helpers/exportClass';
import { createModelSchema, object } from 'serializr';
import { useContext, useState } from "preact/hooks";
import { CheckBox, MenuTemplate, Text } from "preact-sidebar";
import { ContentSchema } from "../../renderer/store/schemas/ContentSchema";
import { Width } from "./Story";

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
    public content: any;
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
            altResource: "https://source.unsplash.com/random/640x480",
            contentType: "url",
            altText: "Image description",
            hasMobileResource: true
        }

        this.userDefinedProperties = {
            caption: "This is the caption",
            mediaSource: "Who made this?"
        }
        // this.menuTemplate = connectionField(this);
        this.icon = _ImageObject.defaultIcon;

        makeObservable(this, {
            name: observable,
            userDefinedProperties: observable,
            connectors: computed,
            menuTemplate: computed,
            content: observable.deep,
            updateName: action,
            updateImageURL: action,
            updateAltText: action,
            updateCaption: action,
            updateMediaSource: action,
            updateHasMobileVersion: action
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...nameField(this),
            new Text("Image URL", {defaultValue: ""}, () => this.content.resource, (arg: string) => this.updateImageURL(arg)),
            new CheckBox("Mobile Version", () => this.content.hasMobileResource, (arg) => this.updateHasMobileVersion(arg)),
            new Text("Alt text", { placeHolder: "Image description" }, () => this.content.altText, (arg: string) => this.updateAltText(arg)),
            new Text("Caption", { placeHolder: "This is the caption" }, () => this.userDefinedProperties.caption, (arg: string) => this.updateCaption(arg)),
            new Text("Source", { placeHolder: "Who made this?" }, () => this.userDefinedProperties.mediaSource, (arg: string) => this.updateMediaSource(arg)),

            ...connectionField(this),
        ];
        if (this.content.hasMobileResource) ret.splice(3, 0, new Text("Mobile URL", {defaultValue: ""}, () => this.content.altResource, (arg: string) => this.updateAltImageURL(arg)));
        if (super.menuTemplate && super.menuTemplate.length >= 1) ret.push(...super.menuTemplate);
        return ret;
    }

    public updateImageURL(newURL: string) {
        this.content.resource = newURL;
    }

    public updateAltImageURL(newURL: string) {
        this.content.altResource = newURL;
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
    
    public updateHasMobileVersion(arg: boolean): void {
        this.content.hasMobileResource = arg;
    }

    public getComponent(): FunctionComponent<INGWebSProps> {
        const Comp: FunctionComponent<INGWebSProps> = ({ content, userDefinedProperties, modifiers }) => {

            const [, setState] = useState({});

            this._rerender = () => {
                setState({});
            }

            const widthClasses = useContext(Width);

            const resource = (!content?.hasMobileResource) ? content?.resource : (widthClasses.indexOf("SM") !== -1) ? content?.resource : content?.altResource;

            const imgContainer = <div id={this.id} class="imagewrapper image">
                    <figure>
                        <img src={resource} alt={content?.altText} />
                        <figcaption>{userDefinedProperties.caption} <span class="media-source">// {userDefinedProperties.mediaSource}</span></figcaption>
                    </figure>
                </div>;
                if (modifiers) return modifiers.reduce((p, v) => (
                    // @ts-ignore
                        v.modify(p)
                    ), imgContainer)
                else return imgContainer
        }
        return Comp
    }

    public getEditorComponent(): FunctionComponent<INGWebSProps> {
        return () => <div class="editor-component"></div>
    }
}

createModelSchema(_ImageObject, {
    content: object(ContentSchema)
})

export const plugInExport = exportClass(
    _ImageObject,
    "Image",
    "internal.content.image",
    _ImageObject.defaultIcon,
    true
);
