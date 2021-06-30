import { Container } from "./Container";
import { exportClass } from "../helpers/exportClass";
import { createContext, FunctionComponent } from "preact";
import { INGWebSProps } from "../../renderer/utils/PlugInClassRegistry";
import { useEffect, useRef, useState } from "preact/hooks";
import { h } from "preact";

type WidthClass = "XS" | "SM" | "MD" | "LG" | "XL";

interface IPreviewState {
    classes: WidthClass[]
}

export const Width = createContext(["XS"]);
export class Story extends Container {
    role = "internal.content.story";
    name = "My Story";
    
    constructor() {
        super();
    }
    
    getComponent() {
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
        const ret: FunctionComponent<INGWebSProps> = ({ registry, id, renderingProperties, content, modifiers, graph, userDefinedProperties }) => {
            const [state, setState] = useState({
                classes: ["XS"]
            });
            const setClasses = (storyDivWidth: any) => {
                const classString: WidthClass[] = getCurrentWidthClass(storyDivWidth);
            
                if (classString.length !== state.classes.length) {
                    setState({
                        classes: classString
                    });
                }
            }
            const ref = useRef<HTMLDivElement>();
            const sizeObserver = new ResizeObserver((entries: { contentRect: { width: any; }; }[]) => {
                const storyDivWidth = entries[0].contentRect.width;
                setClasses(storyDivWidth);
            });

            useEffect(() => {
                if (ref.current) {
                    sizeObserver.observe(ref.current);
                    setClasses(ref.current.clientWidth);
                }

                return () => {
                    sizeObserver.disconnect();
                }
            });
            
            const ContainerComp = super.getComponent();

            return <div class={`storywrapper ${state.classes.join(" ")}`} ref={ref}>
                <div class={"ngwebs-story"} id={id}>
                    <Width.Provider value={state.classes}>
                        <ContainerComp registry={registry} id={id} renderingProperties={renderingProperties} content={content} modifiers={modifiers} graph={graph} userDefinedProperties={userDefinedProperties} />
                    </Width.Provider>
                </div>
            </div>
        }
        return ret
    }
}

export const plugInExport = exportClass(Story, "Story", "internal.content.story", "", false);
