import { h, JSX } from "preact";
import { useRef } from "preact/hooks";
import { IMenuItemRenderer, IMenuTemplate } from "../SideBar";

export const HSliderMenuItem: IMenuItemRenderer = (item: IMenuTemplate): JSX.Element => {
    const pRef = useRef<HTMLParagraphElement>();

    return <div class="form-group-item slider-item">
        <label>{item.label}</label>
        <input
            type="range"
            min={item.options?.min}
            max={item.options?.max}
            value={item.getter()}
            class="slider" 
            onInput={(e: Event) => {
                const target = e.target as HTMLInputElement
                
                if (item.setter && target.value && item.getter) {
                    item.setter(target.value);
                    if (pRef && pRef.current && pRef !== null && pRef.current !== null) {
                        const val = Number(item.getter());
                        const string = (item.options.formatter) ? item.options.formatter(val) : val
                        pRef.current.innerHTML = string;
                    }
                }
            }}
        />
        <p ref={pRef}>{
            (item.options.formatter) ? item.options.formatter(item.getter()) : item.getter()
        }</p>
    </div>
}
