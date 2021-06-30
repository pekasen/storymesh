import { h } from "preact";
import { computed } from "mobx";
import { action, makeObservable, observable } from 'mobx';
import { createModelSchema, object } from "serializr";
import { HSlider, DropDown, MenuTemplate, ColorPicker, Divider } from "preact-sidebar";
// @ts-expect-error
import { createUseStyles } from 'preact-jss-hook';
import { HMTLModifier } from "../../plugins/helpers/HTMLModifier";
import { IConnectorPort } from "storygraph";
import { exportClass } from "../../plugins/helpers/exportClass";
import { ConnectorSchema } from "../../renderer/store/schemas/ConnectorSchema";

export class _ContentBubble extends HMTLModifier {

    public name: string = "Bubble";
    public role: string = "internal.modifier.contentbubble";
    public data: any = {
        toggle: true
    }
    public static defaultIcon = "icon-eye";
    public padding: number;
    public textColor: string;
    public backgroundColor: string;
    public backgroundOpacity: number;
    public borderRadius: number;
    public placeItems: string;

    constructor() {
        super();

        this.padding = 0;
        this.textColor = "#ffffff"; // HEX STRING
        this.backgroundColor = "#252525"; // HEX STRING
        this.backgroundOpacity = 100;
        this.borderRadius = 0;
        this.placeItems = 'center';

        makeObservable(this, {
            padding:                    observable,
            textColor:                  observable,
            backgroundColor:            observable,
            backgroundOpacity:          observable,
            borderRadius:               observable,
            placeItems:                 observable,
            updatePadding:              action,
            updateTextColor:            action,
            updateBackgroundColor:      action,
            updateBackgroundOpacity:    action,
            updateBorderRadius:         action,
            updatePlaceItems:           action,
            backgroundRGBA:              computed,
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...super.menuTemplate,
            new Divider(""),
            new HSlider(
                "Padding",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}px`
                },
                () => this.padding,
                (padding: number) => this.updatePadding(padding)
            ),
            new HSlider(
                "Border Radius",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}%`
                },
                () => this.borderRadius,
                (radius: number) => this.updateBorderRadius(radius)
            ),
            new ColorPicker(
                "Background color",
                () => this.backgroundColor,
                (color: string) => this.updateBackgroundColor(color)
            ),
            new HSlider(
                "Background Opacity",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}%`
                },
                () => this.backgroundOpacity,
                (opacity: number) => this.updateBackgroundOpacity(opacity)
            ),
            new ColorPicker(
                "Text Color",
                () => this.textColor,
                (color: string) => this.updateTextColor(color)
            ),
            new DropDown(
                "Place Items",
                {
                    options: ["start", "center", "end"]
                },
                () => this.placeItems,
                (item) => this.updatePlaceItems(item)
            ),
        ];
     
        return ret;
    }

    public updatePadding(newProperty: number) {
        this.padding = newProperty;
    }

    public updateBorderRadius(newProperty: number) {
        this.borderRadius = newProperty;
    }

    public updateTextColor(newProperty: string) {
        this.textColor = newProperty;
    }

    public convertToRGB (c: string){
        let r = parseInt(c.slice(1,3), 16);
        let g = parseInt(c.slice(3,5), 16);
        let b = parseInt(c.slice(5,7), 16);
        return [r,g,b].join(", ");
    }

    //TODO: convert HEX to RGB to change alpha-value
    public updateBackgroundColor(newProperty: string) {
        console.log("Setting bgcol", newProperty);
        this.backgroundColor = newProperty;
    }

    public updateBackgroundOpacity(newProperty: number) {
        this.backgroundOpacity = newProperty ;
    }

    public updatePlaceItems(placeItems: string): void {
        this.placeItems = placeItems
    }

    // private _trigger = () => {
    //     Logger.info("Trigger fired", this);
    //     this.data.toggle = !this.data.toggle
    //     // request rerendering
    //     this._connector.notificationCenter?.push(this._connector.parent + "/rerender")
    // }
    // private _connector = new ReactionConnectorInPort("reaction-in", this._trigger);

    public modify(element: h.JSX.Element): h.JSX.Element {
        // this._connector.handleNotification = this._trigger;
        const useStyles = createUseStyles({
            contentBackground: {
                padding: `${this.padding}px`,
                "border-radius": `${this.borderRadius}px`,
                "background-color": `rgba(${this.backgroundRGBA})`,
                color: this.textColor,
                display: "grid",
                "place-items": `${this.placeItems}`          
            },
          });          

       const { classes } = useStyles();

       return <div id={`_${this.id}`} class={`${classes.contentBackground}`}>
                {element}
            </div>
    }

    requestConnectors(): [string, IConnectorPort][] {
        // return [[this._connector.id, this._connector]];
        return [];
    }

    get backgroundRGBA() {
        const tmp = this.convertToRGB(this.backgroundColor) + "," + this.backgroundOpacity/100;
        console.log("Converting", this.backgroundColor, "to", tmp);
        return tmp;
    }
}

export const _ContentBubbleModifierSchema = createModelSchema(_ContentBubble, {
    _connector: object(ConnectorSchema)
});

export const plugInExport = exportClass(
    _ContentBubble,
    "Content Bubble",
    "internal.modifier.contentbubble",
    "icon-speaker",
    true
);