import { createRef, FunctionComponent, h } from "preact";
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { StoryGraph } from 'storygraph';
import { StoryObject } from '../helpers/AbstractStoryObject';
import { IContent } from 'storygraph/dist/StoryGraph/IContent';
import { connectionField, nameField } from '../helpers/plugInHelpers';
import { exportClass } from '../helpers/exportClass';
import { createModelSchema, object } from 'serializr';
import { useRef, useState, useEffect } from "preact/hooks";
import { MenuTemplate, Text, CheckBox, HSlider } from "preact-sidebar";
import { ContentSchema } from "../../renderer/store/schemas/ContentSchema";
import { Container } from "./Container";

/**
 */
// @observable
export class VideoObject extends StoryObject {
    public name: string;
    public role: string;
    public isContentNode: boolean;
    public userDefinedProperties: unknown;
    public content: IContent;
    public icon: string;
    // TODO: may be refactor these properties into a seperate object, e.g. userDefinedProperties?
    public playbackControls = false;
    public autoPlay = false;
    public loopable = false;
    public scrollableBackground = false;
    public muted = false;
    public scrollThroughSpeed = 1;
    public scrollThroughSpeedFactor = 100;
    public static defaultIcon = "icon-video";

    // TODO: are these all supposed to be private? I added the keyword…
    private myRequestAnimationFrame: number;
    private idVideo = this.id.concat(".preview");
    private classList: string;
    private videoElement = createRef();
    private videoWrapper: HTMLElement | undefined | null;

    constructor() {
        super();

        this.name = "Video";
        this.role = "internal.content.video";
        this.isContentNode = true;
        this.userDefinedProperties = {};
        this.makeDefaultConnectors();
        this.classList = "";
        this.myRequestAnimationFrame = 0;

        this.content = {
            resource: "https://dl5.webmfiles.org/big-buck-bunny_trailer.webm",
            contentType: "url",
            altText: "This is a video"
        }
        // this.menuTemplate = connectionField(this);
        this.icon = VideoObject.defaultIcon;

        makeObservable(this, {
            name: observable,
            userDefinedProperties: observable,
            content: observable,
            autoPlay: observable,
            playbackControls: observable,
            loopable: observable,
            scrollableBackground: observable,
            muted: observable,
            scrollThroughSpeed: observable,
            connectors: computed,
            menuTemplate: computed,
            updateName: action,
            updateVideoURL: action,
            updateScrollableBackground: action
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...nameField(this),
            new Text("URL", { defaultValue: "" },
                () => this.content.resource,
                (arg: string) => this.updateVideoURL(arg)),
            new CheckBox(
                "Show Controls",
                () => this.playbackControls,
                (sel: boolean) => {
                    runInAction(() => this.playbackControls = sel)
                }),
            new CheckBox(
                "Enable AutoPlay",
                () => this.autoPlay,
                (sel: boolean) => {
                    runInAction(() => this.autoPlay = sel)
                }),
            new CheckBox(
                "Enable Looping",
                () => this.loopable,
                (sel: boolean) => {
                    runInAction(() => this.loopable = sel)
                }),
            new CheckBox(
                "Muted",
                () => this.muted,
                (sel: boolean) => {
                    runInAction(() => this.muted = sel)
                }),
            new CheckBox(
                "Set as scrollable container background",
                () => this.scrollableBackground,
                (sel: boolean) => {
                    runInAction(() => this.updateScrollableBackground(sel))
                }),
            new HSlider(
                "Scroll-through speed",
                {
                    min: 1,
                    max: 10,
                    formatter: (val: number) => `${val}`
                },
                () => this.scrollThroughSpeed,
                (sel: number) => {
                    runInAction(() => {
                        this.scrollThroughSpeed = sel;
                        this.updateScrollableBackground(this.scrollableBackground);
                    })
                }),
            ...connectionField(this),
        ];
        if (super.menuTemplate && super.menuTemplate.length >= 1) ret.push(...super.menuTemplate);
        return ret;
    }

    public updateVideoURL(newURL: string): void {
        this.content.resource = newURL;
    }

    public updateName(name: string): void {
        this.name = name;
    }

    public updateScrollableBackground(newScrollableBackground: boolean): void {
        this.scrollableBackground = newScrollableBackground;
        if (this.scrollableBackground) {
            if (this.videoElement && this.videoElement.current) {
                if (!this.classList.includes("bound-to-scroll")) {
                    this.classList = this.classList.concat(" bound-to-scroll").trim();
                }
            }
        } else {
            if (this.videoElement && this.videoElement.current) {
                this.classList = this.classList.replace("bound-to-scroll", "").trim();
            }
        }
    }

    public getComponent(): FunctionComponent<INGWebSProps> {
        const Comp: FunctionComponent<INGWebSProps> = ({ registry, content }) => {
            // const [, setState] = useState({});
            // this._rerender = () => {
            //     setState({});
            // };

            this.videoElement = createRef(); // TODO why does this help? why is the reference otherwise null here?

            const vid = <video class={this.classList}
                id={this.idVideo}
                ref={this.videoElement}
                type="video/webm; codecs='vp8, vorbis'"
                src={content?.resource}
                autoPlay={this.autoPlay}
                controls={this.playbackControls}
                loop={this.loopable}
                muted={this.muted}
                // autoBuffer={"true"}
                preload="preload"
            ></video>;

            useEffect(() => {
                // @ts-ignore
                const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                // @ts-ignore
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                // @ts-ignore
                const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

                const that = this;
                function scrollPlay(): void {
                    if (that.parent) {
                        that.videoWrapper = document.getElementById(that.parent);
                        const parentNode = registry?.getValue(that.parent) as unknown as Container;
                        if (that.videoElement && that.videoElement.current && that.scrollableBackground && 
                                that.videoWrapper && !isNaN(that.videoElement.current.duration)) 
                        { //TODO: check why duration is sometimes NaN
                            that.videoElement.current.currentTime = that.videoElement.current.duration -
                                (that.videoWrapper?.getBoundingClientRect().bottom - that.videoElement.current.getBoundingClientRect().bottom)
                                / (that.scrollThroughSpeed * that.scrollThroughSpeedFactor);
                            parentNode.userDefinedProperties.height = (Math.floor(that.videoElement.current.duration * that.scrollThroughSpeed * that.scrollThroughSpeedFactor
                                + that.videoElement.current.getBoundingClientRect().height)) + "px";
                            that.videoWrapper.style.height = parentNode.userDefinedProperties.height;
                            that.myRequestAnimationFrame = requestAnimationFrame(scrollPlay);
                        }
                    }
                }
                if (this.scrollableBackground) {
                    requestAnimationFrame(scrollPlay);
                } else {
                    cancelAnimationFrame(this.myRequestAnimationFrame);
                }
            }, [this.scrollableBackground]);

            return this.modifiers.reduce((p, v) => (
                v.modify(p)
            ), vid)
        }
        return Comp
    }

    public getEditorComponent(): FunctionComponent<INGWebSProps> {
        return () => <div class="editor-component"></div>
    }

    public updateValue(): void {
    }
}


createModelSchema(VideoObject, {
    content: object(ContentSchema),
    autoPlay: true,
    loopable: true,
    scrollable: true,
    playbackControls: true
})

export const plugInExport = exportClass(
    VideoObject,
    "Video",
    "internal.content.video",
    VideoObject.defaultIcon,
    true
);
