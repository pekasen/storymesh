// import { FunctionComponent, h } from "preact";
// import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
// import { action, computed, makeObservable, observable } from 'mobx';
// import { StoryGraph } from 'storygraph';
// import { StoryObject } from '../helpers/AbstractStoryObject';
// import { IContent } from 'storygraph/dist/StoryGraph/IContent';
// import { connectionField, nameField } from '../helpers/plugInHelpers';
// import { exportClass } from '../helpers/exportClass';
// import { createModelSchema, object } from 'serializr';
// import { useState } from "preact/hooks";
// import { MenuTemplate, Text } from "preact-sidebar";
// import { ContentSchema } from "../../renderer/store/schemas/ContentSchema";

// /**
//  * Our first little dummy PlugIn
//  * 
//  * @todo It should actually inherit from StoryObject and not StoryGraph...
//  */
// // @observable
// class _ImageObject extends StoryObject {
//     public name: string;
//     public role: string;
//     public isContentNode: boolean;
//     public userDefinedProperties: any;
//     public childNetwork?: StoryGraph;
//     public content: IContent;
//     public mobileResource: string;
//     public isMobile: boolean;
//     public icon: string;

//     public static defaultIcon = "icon-picture"

//     constructor() {
//         super();

//         this.name = "Image";
//         this.role = "internal.content.image";
//         this.isContentNode = true;
//         this.userDefinedProperties = {};
//         this.makeDefaultConnectors();

//         this.content = {
//             resource: "https://source.unsplash.com/random/1920x1080",
//             contentType: "url",
//             altText: "Image description"
//         }

//         this.isMobile = false;
//         this.mobileResource = "https://source.unsplash.com/random/1920x1080";

//         this.userDefinedProperties = {
//             caption: "This is the caption",
//             mediaSource: "Who made this?"
//         }
//         // this.menuTemplate = connectionField(this);
//         this.icon = _ImageObject.defaultIcon;

//         makeObservable(this, {
//             name: observable,
//             userDefinedProperties: observable,
//             isMobile: observable,
//             connectors: computed,
//             menuTemplate: computed,
//             content: observable,
//             updateName: action,
//             updateImageURL: action,
//             updateMobileImageURL: action,
//             updateAltText: action,
//             updateCaption: action,
//             updateMediaSource: action,
//             setMobile: action
//         });
//     }

//     public get menuTemplate(): MenuTemplate[] {
//         const ret: MenuTemplate[] = [
//             ...nameField(this),
//             new Text("URL", {defaultValue: ""}, () => this.content.resource, (arg: string) => this.updateImageURL(arg)),
//             new Text("Mobile version", {defaultValue: ""}, () => this.mobileResource, (arg: string) => this.updateMobileImageURL(arg)),
//             new Text("Alt text", { placeHolder: "Image description" }, () => this.content.altText, (arg: string) => this.updateAltText(arg)),
//             new Text("Caption", { placeHolder: "This is the caption" }, () => this.userDefinedProperties.caption, (arg: string) => this.updateCaption(arg)),
//             new Text("Source", { placeHolder: "Who made this?" }, () => this.userDefinedProperties.mediaSource, (arg: string) => this.updateMediaSource(arg)),

//             ...connectionField(this),
//         ];
//         if (super.menuTemplate && super.menuTemplate.length >= 1) ret.push(...super.menuTemplate);
//         return ret;
//     }

//     public updateImageURL(newURL: string) {
//         this.content.resource = newURL;
//     }

//     public updateMobileImageURL(newURL: string) {
//         this.mobileResource = newURL;
//     }

//     public updateName(name: string): void {
//         this.name = name;
//     }

//     public updateAltText(altText: string) {
//         this.content.altText = altText;
//     }

//     public updateCaption(caption: string) {
//         this.userDefinedProperties.caption = caption;
//     }

//     public updateMediaSource(mediaSource: string) {
//         this.userDefinedProperties.mediaSource = mediaSource;
//     }

//     //Check which classes exist on the storywrapper?

//     public setMobile(){
//         const Storywrapper = document.getElementById('storywrapper');
    
//         if (!Storywrapper.classList.contains('MD') || !Storywrapper.classList.contains('LG')){
//             this.isMobile = true;
//         }
//             this.isMobile = false;
// }

//     public getComponent(): FunctionComponent<INGWebSProps> {
//         const Comp: FunctionComponent<INGWebSProps> = ({ content }) => {

//             const [, setState] = useState({});

//             this._rerender = () => {
//                 setState({});
//             }

//             const imgContainer = <div id={this.id} class="imagewrapper image">
//                     <figure>
//                         <img src={this.isMobile ?  this.mobileResource : content?.resource} alt={this.content.altText} />
//                         <figcaption>{this.userDefinedProperties.caption} <span class="media-source">// {this.userDefinedProperties.mediaSource}</span></figcaption>
//                     </figure>
//                 </div>;
//                 return this.modifiers.reduce((p, v) => (
//                         v.modify(p)
//                     ), imgContainer)
//         }
//         return Comp
//     }

//     public getEditorComponent(): FunctionComponent<INGWebSProps> {
//         return () => <div class="editor-component"></div>
//     }
// }

// createModelSchema(_ImageObject, {
//     content: object(ContentSchema)
// })

// export const plugInExport = exportClass(
//     _ImageObject,
//     "Image",
//     "internal.content.image",
//     _ImageObject.defaultIcon,
//     true
// );
