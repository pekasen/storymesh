import { h } from "preact";
import { computed } from "mobx";
import { action, makeObservable, observable } from 'mobx';
import { createModelSchema, object } from "serializr";
import { HSlider, DropDown, MenuTemplate, ColorPicker, Divider, Text } from "preact-sidebar";
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
    public userDefinedProperties: {
        maxWidth: string,
        margin: number,
        padding: number,
        textColor: string,
        backgroundColor: string,
        backgroundOpacity: number,
        borderRadius: number,
        placeItems: string
    };

    constructor() {
        super();

        this.userDefinedProperties = {
            maxWidth: 'auto',
            margin: 0,
            padding: 0,
            textColor: '#ffffff', // HEX STRING
            backgroundColor: '#252525', // HEX STRING
            backgroundOpacity: 100,
            borderRadius: 0,
            placeItems: 'center'
        }

        makeObservable(this, {
            userDefinedProperties: observable,
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
            new Text("Max width (in px)", {defaultValue: ""}, () => this.userDefinedProperties.maxWidth, (arg: string) => this.updateMaxWidth(arg)),
            new HSlider(
                "Margin",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}px`
                },
                () => this.userDefinedProperties.margin,
                (padding: number) => this.updateMargin(padding)
            ),
            new HSlider(
                "Padding",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}px`
                },
                () => this.userDefinedProperties.padding,
                (padding: number) => this.updatePadding(padding)
            ),
            new HSlider(
                "Border Radius",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}%`
                },
                () => this.userDefinedProperties.borderRadius,
                (radius: number) => this.updateBorderRadius(radius)
            ),
            new ColorPicker(
                "Background color",
                () => this.userDefinedProperties.backgroundColor,
                (color: string) => this.updateBackgroundColor(color)
            ),
            new HSlider(
                "Background Opacity",
                {
                    min: 0,
                    max: 100,
                    formatter: (val: number) => `${val}%`
                },
                () => this.userDefinedProperties.backgroundOpacity,
                (opacity: number) => this.updateBackgroundOpacity(opacity)
            ),
            new ColorPicker(
                "Text Color",
                () => this.userDefinedProperties.textColor,
                (color: string) => this.updateTextColor(color)
            ),
            new DropDown(
                "Place Items",
                {
                    options: ["start", "center", "end"]
                },
                () => this.userDefinedProperties.placeItems,
                (item) => this.updatePlaceItems(item)
            ),
        ];
     
        return ret;
    }

    public updateMaxWidth(newProperty: string) {
        this.userDefinedProperties.maxWidth = newProperty;
    }

    public updateMargin(newProperty: number) {
        this.userDefinedProperties.margin = newProperty;
    }

    public updatePadding(newProperty: number) {
        this.userDefinedProperties.padding = newProperty;
    }

    public updateBorderRadius(newProperty: number) {
        this.userDefinedProperties.borderRadius = newProperty;
    }

    public updateTextColor(newProperty: string) {
        this.userDefinedProperties.textColor = newProperty;
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
        this.userDefinedProperties.backgroundColor = newProperty;
    }

    public updateBackgroundOpacity(newProperty: number) {
        this.userDefinedProperties.backgroundOpacity = newProperty ;
    }

    public updatePlaceItems(placeItems: string): void {
        this.userDefinedProperties.placeItems = placeItems
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
                "max-width": `${this.userDefinedProperties.maxWidth}px`,
                margin: `${this.userDefinedProperties.margin}px`,
                padding: `${this.userDefinedProperties.padding}px`,
                "border-radius": `${this.userDefinedProperties.borderRadius}px`,
                "background-color": `rgba(${this.backgroundRGBA})`,
                color: this.userDefinedProperties.textColor,        
            },
            contentPlacement: {
                width: "100%",
                display: "grid",
                "place-items": `${this.userDefinedProperties.placeItems}`,
            },
          });          

       const { classes } = useStyles();

       return <div class={`${classes.contentPlacement}`}>
                <div id={`_${this.id}`} class={`${classes.contentBackground}`}>
                    {element}
                </div>
            </div>
    }

    requestConnectors(): [string, IConnectorPort][] {
        // return [[this._connector.id, this._connector]];
        return [];
    }

    get backgroundRGBA() {
        const tmp = this.convertToRGB(this.userDefinedProperties.backgroundColor) + "," + this.userDefinedProperties.backgroundOpacity/100;
        console.log("Converting", this.userDefinedProperties.backgroundColor, "to", tmp);
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