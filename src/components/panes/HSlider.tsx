import { Component, createRef, h, JSX } from "preact";
import { useRef } from "preact/hooks";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface IHSliderMenuItemOptions{
    min: number
    max: number
    formatter: (srg: number) => string
}

export const HSliderMenuItem: IMenuItemRenderer = (item: IMenuTemplate<number, IHSliderMenuItemOptions>): JSX.Element => {
    // const pRef = useRef<HTMLParagraphElement>();

    class HSlider extends Component {
        pRef = createRef<HTMLParagraphElement>();

        render() {
            return <div class="form-group-item slider-item">
                <label>{item.label}</label>
                <p ref={this.pRef}>{ // ref={pRef}
                    ((item.getter !== undefined) ? 
                        (item.options.formatter !== undefined) ?
                    item.options.formatter(item.getter()) : item.getter() : null)
                }</p>
                <input
                    type="range"
                    min={item.options?.min}
                    max={item.options?.max}
                    value={((item.getter !== undefined) ? item.getter() : undefined)}
                    class="slider" 
                    onInput={(e: Event) => {
                        const target = e.target as HTMLInputElement
                        const value = Number(target.value);
                        if (item.setter && target.value) {
                            item.setter(value);
                            if (
                                this.pRef != null &&
                                this.pRef !== undefined &&
                                this.pRef.current != null &&
                                this.pRef.current !== undefined
                                && item.getter
                            ) {

                                const string = (item.options.formatter) ? item.options.formatter(value) : String(value)
                                this.pRef.current.innerText = string;
                            }
                        }
                    }}
                />
            </div>
        }
    }

    return <HSlider />
}

export class HSlider extends MenuTemplate<number, IHSliderMenuItemOptions> {
    public type = HSliderMenuItem;
    public label: string;
    public options: IHSliderMenuItemOptions;
    public getter: (() => number);
    public setter: ((arg: number) => void);

    constructor(label: string, options: IHSliderMenuItemOptions, getter: () => number, setter: (arg: number) => void) {
        super();
        this.label = label;
        this.options = options;
        this.getter = getter;
        this.setter = setter
    }
}
