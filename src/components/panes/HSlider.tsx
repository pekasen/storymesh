import { h, JSX } from "preact";
import { useRef } from "preact/hooks";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export interface IHSliderMenuItemOptions{
    min: number
    max: number
    formatter: (srg: string | number) => string
}

export const HSliderMenuItem: IMenuItemRenderer = (item: IMenuTemplate): JSX.Element => {
    const pRef = useRef<HTMLParagraphElement>(null);

    return <div class="form-group-item slider-item">
        <label>{item.label}</label>
        <p ref={pRef}>{ // ref={pRef}
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
                
                if (item.setter && target.value) {
                    item.setter(target.value);
                    if (pRef !== null && pRef.current !== null && item.getter) {
                        const val = Number(item.getter());
                        const string = (item.options.formatter) ? item.options.formatter(val) : val
                        pRef.current.innerHTML = string;
                    }
                }
            }}
        />
    </div>
}
