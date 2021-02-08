import { action, makeObservable, observable } from "mobx";
import { Component, createRef, h } from "preact";
import { useRef } from "preact/hooks";
import { createModelSchema, list, object } from "serializr";
import { ReactionConnectorOutPort, IConnectorPort } from "storygraph";
import { IMenuTemplate } from "../../renderer/utils/PlugInClassRegistry";
import { exportClass } from "../helpers/exportClass";
import { HMTLModifier } from "../helpers/HTMLModifier";

export class HotSpot {
    protected _name: string | undefined;    
    public x: number;
    public y: number;
    protected static numOfInstances = 1;
    public reactionPOut = new ReactionConnectorOutPort("heelo", () => undefined)

    constructor(x?: number, y?: number) {
        this.x = x ?? 0.5;
        this.y = y ?? 0.5;
        HotSpot.numOfInstances += 1;

        makeObservable(this, {
            x: true,
            y: true,
            updateXY: action
        });
    }

    public updateXY(x?: number, y?: number): void {
        if (x) {
            this.x = this._clip(x);
        }
        if (y) {
            this.y = this._clip(y);
        }
    }

    public render(): preact.JSX.Element {
        throw("This method should not be called");
    }

    protected _clip(x: number, min = 0, max = 1): number {
        return ((x >= min) ? (x < max) ? x : max : min)
    }

    public get(property: string): string | number | undefined {
        switch (property) {
            case "x": return this.x;
            case "y": return this.y;
            case "name": return this.name;
            default: break;
        }
    }

    public get name(): string {
        return `${this._name}${(HotSpot.numOfInstances > 0) ? "-" + HotSpot.numOfInstances : ""}`
    }
}

class CircleHotSpot extends HotSpot {
    public radius: number;
    protected _num: number;
    
    public get name() {
        if (this._name === undefined) return "CircleHotSpot" + this._num;
        else return this._name;
    }

    public set name(name: string) {
        this._name = name
    }

    constructor(x?:number, y?: number, r?: number) {
        super(x, y);
        this._num = CircleHotSpot.numOfInstances;
        CircleHotSpot.numOfInstances += 1;

        this.radius = r ?? 0.25;
        makeObservable(this, {
            radius: true,
            updateRadius: action
        });
    }

    public updateRadius(radius: number) {
        this.radius = this._clip(radius, 0, Math.PI);
    }

    public render(svg?: Element): preact.JSX.Element {
        if (svg) {
            const { width, height } = svg.getBoundingClientRect();

            const relX = width * this.x;
            const relY = height * this.y;
            const relR = Math.sqrt(width * width + height * height) * this.radius;

            console.log("circle dims", {x: relX, y: relY, r: relR});
            
            return <circle class={"debug"} cx={relX} cy={relY} r={relR} onClick={() => console.log(`Hello from ${this.name}`)}/>
        } else return <circle />
    }
    
    public get(property: string): string | number | undefined {
        switch (property) {
            case "radius": return this.radius;
            default: return super.get(property);
        }
    }
}

class HotSpotModifierData {
    [key: string]: HotSpot[]

    constructor() {
        this.hotspots = [
            new CircleHotSpot(),
            new CircleHotSpot(0.9, 0.9, 0.1),
        ];

        makeObservable(this, {
            hotspots: observable
        })
    }
}
export class HTMLHotSpotModifier extends HMTLModifier {
    public name = "Hot-o-Spot-o"
    public role = "internal.modifier.hotspot";
    public data = new HotSpotModifierData();

    constructor() {
        super();

        makeObservable(this, {
            data: observable,
            addHotSpot: action,
            removeHotSpot: action
        })
    }

    public modify(element: h.JSX.Element): h.JSX.Element {
        const sizeRef = useRef();
        element.props.ref = sizeRef;

        // Hacky this/that trick
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        class SVGOverlay extends Component {
            svgRef = createRef();
            hotspots: preact.JSX.Element[] = [];
            
            render() {
                return <svg id={that.id} ref={this.svgRef}>
                    {this.hotspots}
                </svg>
            }

            componentDidMount(){
                if (this.svgRef.current) {
                    this.hotspots = that.data.hotspots.map(e => e.render());
                    this.forceUpdate();
                }
            }
        }

        return <div id={that.id} class="hotspot-container">
            <SVGOverlay />
            {element}
        </div>;
    }

    public addHotSpot(hotspot: HotSpot): void {
        this.data.hotspots.push(hotspot);
    }

    public removeHotSpot(hotspot: HotSpot): void {
        this.data.hotspots.splice(
            this.data.hotspots.indexOf(hotspot), 1
        )
    }

    public get menuTemplate(): IMenuTemplate[] {
        return [
            ...super.menuTemplate,
            {
                label: "Hotspots",
                type: "hotspot-table",
                value: () => this.data.hotspots,
                valueReference: () => (null),
                options: {
                    columns: [
                        {
                            name: "Name",
                            type: "string",
                            editable: true,
                            property: "name"
                        },
                        {
                            name: "X",
                            type: "number",
                            editable: true,
                            property: "x"
                        },
                        {
                            name: "Y",
                            type: "number",
                            editable: true,
                            property: "y"
                        },
                        {
                            name: "R",
                            type: "number",
                            editable: true,
                            property: "radius"
                        },
                        {
                            name: "delete",
                            type: "function",
                            editable: true,
                            property: (e: HotSpot) => {
                                this.removeHotSpot(e);
                            }
                        }
                    ]
                }
            },
            {
                label: "Add HotSpot",
                type: "button",
                value: () => undefined,
                valueReference: () => this.addHotSpot(new CircleHotSpot())
            }
        ];
    }

    public get getRenderingProperties(): any {
        return super.getRenderingProperties;
    }

    public requestConnectors(): [string, IConnectorPort][] {
        return this.data.hotspots.map((value) => {
            const out = value.reactionPOut
            out.name = value.name;
            return [out.id, out];
        });
    }
}


export const HotSpotSchema = createModelSchema(HotSpot, {
    x: true,
    y: true,
    name: true
});

export const CircleHotSpotSchema = createModelSchema(CircleHotSpot, {
    radius: true
});

export const HotSpotModifierDataSchema = createModelSchema(HotSpotModifierData, {
    hotspots: list(object(CircleHotSpotSchema))
});

export const HTMLHotSpotModifierSchema = createModelSchema(HTMLHotSpotModifier, {
    data: object(HotSpotModifierData),
    name: true,
    role: true
});

export const plugInExport = exportClass(
    HTMLHotSpotModifier,
    "HotSpot",
    "internal.modifier.hotspot",
    "icon-speaker",
    true
);
