import Logger from "js-logger";
import { h } from "preact";
import { runInAction } from "mobx";
import { action, makeObservable, observable } from 'mobx';
import { createModelSchema, object } from "serializr";
import { IConnectorPort, ReactionConnectorInPort } from "storygraph";
import { connectionField, dropDownField, nameField } from '../helpers/plugInHelpers';
import { ConnectorSchema } from "../../renderer/store/schemas/ConnectorSchema";
import { exportClass } from "../helpers/exportClass";
import { HMTLModifier } from "../helpers/HTMLModifier";
import { HSlider, MenuTemplate, Text, CheckBox, ColorPicker, Divider, DropDown } from "preact-sidebar";
import { createUseStyles } from 'preact-jss-hook';

export class FilterModifier extends HMTLModifier {

    public name = "";
    public role = "internal.modifier.filter";
    public data: any = {
        toggle: true
    }
    public stopValue: string;// 50%, 360deg, #e5e5e5, ...
    public transformOption: string; // rotate, scale, translateX, ...
    public filterOption: string; // grayscale, blur, ...
    public valueType: string; // %, deg, px
    public maxFilterAmount: number;
    public filterAmount: number;

    constructor() {
        super();

        this.stopValue = "100";
        this.filterAmount = 100;
        this.transformOption = "rotate";
        this.filterOption = "grayscale";
        this.valueType = "%";
        this.maxFilterAmount = 100;

        makeObservable(this, {
            stopValue: observable,
            filterAmount: observable,
            transformOption: observable,
            filterOption: observable,
            valueType: observable,
            maxFilterAmount: observable,
            updateStopValue: action,
            updateFilterAmount: action,
            updateValueType: action
        });
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...super.menuTemplate,
            ...nameField(this),
            //TODO: Slider should be configurable to do half-steps
            new Divider(""),
            ...dropDownField(
                this,
                () => ["grayscale", "invert", "hue-rotate", "blur", "contrast", "opacity"],
                () => this.filterOption,
                (selection: string) => {
                    Logger.info(selection);
                    runInAction(() => this.filterOption = selection),
                    this.updateValueType();
                    this.updateStopValue(selection);
                }
            ),
            new HSlider(
                "Filter amount",
                {
                    min: 0,
                    max: this.maxFilterAmount,
                    formatter: (val: number) => `${val}${this.valueType}`
                },
                () => this.filterAmount,
                (filterAmount: number) => this.updateFilterAmount(filterAmount)
            )
        ];
            
        return ret;
    }

    public updateFilterAmount(newFilterAmount: any): void {
        this.filterAmount = newFilterAmount;
    }

    public updateStopValue(newStopValue: any): void {
        this.stopValue = newStopValue;
    }
    
    public updateValueType(): void {
        if (this.filterOption === "hue-rotate") {
            this.valueType = "deg";
            this.maxFilterAmount = 360;
        } else if (this.filterOption === "blur") {
            this.valueType = "px";
            this.maxFilterAmount = 50;
        } else {
            this.valueType = "%";
            this.maxFilterAmount = 100;
        }
    }

    public modify(element: h.JSX.Element): h.JSX.Element {
        const cssEndOutput = `${this.filterOption}(${this.filterAmount}${this.valueType})`;

        const useStyles = createUseStyles({
            active: JSON.parse('{"filter": "' + cssEndOutput.toString() + '" }'),
          });          

       const { classes } = useStyles();

        return <div id={`_${this.id}`} class={`${classes.active}`}>
                {element}
            </div>
    }

    requestConnectors(): [string, IConnectorPort][] {
        return [];
    }
}

export const FilterModifierSchema = createModelSchema(FilterModifier, {
    _connector: object(ConnectorSchema)
});

export const plugInExport = exportClass(
    FilterModifier,
    "Filter",
    "internal.modifier.filter",
    "icon-mouse",
    true
);
