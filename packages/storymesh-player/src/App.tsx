import { FunctionComponent, h } from "preact";
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { VReg } from "storygraph";

type WidthClass = "XS" | "SM" | "MD" | "LG" | "XL";

export const App: FunctionComponent = () => {

    const [state, setState] = useState({
        classes: ["XS"]
    });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const updater = (newState: any) => {
            setTimeout(() => setState(newState), 500);
        }
        
        const getCurrentWidthClass = (width: number) => {
            const classes = [
                { class: "XS", condition: (x: number) => x >= 0 },
                { class: "SM", condition: (x: number) => x >= 576 },
                { class: "MD", condition: (x: number) => x >= 768 },
                { class: "LG", condition: (x: number) => x >= 960 },
                { class: "XL", condition: (x: number) => x >= 1200 },
            ];
    
            return classes.filter(e => e.condition(width)).map(e => e.class as WidthClass);
        }
        // observe size changes
        const sizeObserver = new ResizeObserver((entries: { contentRect: { width: any; }; }[]) => {
            const storyDivWidth = entries[0].contentRect.width;
            const classString: WidthClass[] = getCurrentWidthClass(storyDivWidth);
            // add this line to debounce sizeObserver
            if (state.classes.length != classString.length) {
                updater({
                    classes: classString
                });
            }
        });

        if (ref.current) {
            sizeObserver.observe(ref.current);
        }
        return () => {
            sizeObserver.disconnect();
        }
    });

    const topLevelObject = useMemo(() => {
        const v = VReg.instance();
        const topLevelObjectId = v.entrypoint;
        if (!topLevelObjectId) throw('preview entrypoint not set')
        const topLevelObject = v.get(topLevelObjectId);
        if (!topLevelObject ) throw("BIGGY!");
        

        return topLevelObject
    }, [VReg.instance().entrypoint])

    console.log('Rendering STOBJ with ID:' , topLevelObject.id)

    const Thing = topLevelObject.getComponent()

    return <div class="story-container" >
            <div class={`storywrapper ${state.classes.join(" ")}`} ref={ref}>
                <div class={"ngwebs-story "}>
                    {Thing({
                        registry: VReg.instance(),
                        id: topLevelObject.id,
                        renderingProperties: topLevelObject.renderingProperties,
                        content: topLevelObject.content,
                        modifiers: topLevelObject.modifiers,
                        graph: topLevelObject.childNetwork,
                        userDefinedProperties: topLevelObject.userDefinedProperties
                    }, { "test": "Hello World"})}
                </div>
            </div>
    </div>
}
