import { makeObservable, observable, runInAction } from "mobx";
import { Component, createRef, h } from "preact";
import { createModelSchema, list, object } from "serializr";
import { ReactionConnectorOutPort, IConnectorPort } from "storygraph";
import { ConnectorSchema } from "../../renderer/store/schemas/ConnectorSchema";
import { CheckBox, MenuTemplate } from "preact-sidebar";
import { exportClass } from "../helpers/exportClass";
import { HMTLModifier } from "../helpers/HTMLModifier";
import { dropDownField, nameField } from "../helpers/plugInHelpers";

export class InteractionModifier {
    protected _name: string | undefined;
    public reactionOut = new ReactionConnectorOutPort("reaction-out");
    public debug = false;

    constructor() { }

    public get(property: string): string | number | undefined {
        switch (property) {
            case "name": return this.name;
            default: break;
        }
    }

    public get name(): string {
        return `${this._name}`
    }

    public set name(name: string) {
        this._name = name
    }
}

class InteractionModifierData {
    interactionModifier: InteractionModifier;
    [key: string]: unknown;

    constructor() {
        this.interactionModifier = new InteractionModifier();

        makeObservable(this, {
            interactionModifier: observable
        })
    }
}

export interface IHTMLInteractionModifierProperties {
    wrappedObject: HTMLInteractionModifier
}

class WrapperComponent extends Component<IHTMLInteractionModifierProperties> {
    elemRef = createRef();
    wrapped: HTMLInteractionModifier;

    constructor(props: IHTMLInteractionModifierProperties) {
        super();
        this.wrapped = props.wrappedObject;
    }

    render() {
        return <div ref={this.elemRef}>{this.props.children}</div>
    }

    componentDidMount() {
        this.wrapped.intersectionObserverEnter?.observe(this.elemRef.current);
        this.wrapped.intersectionObserverExit?.observe(this.elemRef.current);
    }
}

export class HTMLInteractionModifier extends HMTLModifier {
    public name = "Interaction"
    public role = "internal.modifier.InteractionModifier";
    public data = new InteractionModifierData();
    intersectionObserverEnter: IntersectionObserver | undefined;
    intersectionObserverExit: IntersectionObserver | undefined;
    onClick: boolean = false;
    onDblClick: boolean = false;
    onPointerEnter: boolean = false;
    onPointerLeave: boolean = false;
    onEnterView: boolean = false;
    onExitView: boolean = false;

    constructor() {
        super();
        makeObservable(this, {
            data: observable
        });
    }


    public modify(element: h.JSX.Element): h.JSX.Element {
        class WrapperComponentEnter extends WrapperComponent {
            constructor(props: IHTMLInteractionModifierProperties) {
                super(props);
                const thatWrapped = this.wrapped;

                function onEnter(entry: IntersectionObserverEntry[]) {
                    entry.forEach((change) => {
                        if (change.isIntersecting) {
                            thatWrapped.data.interactionModifier.reactionOut.notify();
                        }
                    });
                }

                let options = { threshold: [0.25] };
                thatWrapped.intersectionObserverEnter = new IntersectionObserver(onEnter, options);
            }
        }

        class WrapperComponentExit extends WrapperComponent {
            constructor(props: IHTMLInteractionModifierProperties) {
                super(props);
                const thatWrapper = this.wrapped;

                function onExit(entry: IntersectionObserverEntry[]) {
                    entry.forEach((change) => {
                        if (!change.isIntersecting) {
                            thatWrapper.data.interactionModifier.reactionOut.notify();
                        }
                    });
                }
                let options = { threshold: [0.25] };
                thatWrapper.intersectionObserverExit = new IntersectionObserver(onExit, options);
            }
        }

        let toReturn = <div onClick={() => {
            if (this.onClick) {
                this.data.interactionModifier.reactionOut.notify();
            }
        }}
            onDblClick={() => {
                if (this.onDblClick) {
                    this.data.interactionModifier.reactionOut.notify();
                }
            }}
            onPointerEnter={() => {
                if (this.onPointerEnter) {
                    this.data.interactionModifier.reactionOut.notify();
                }
            }}
            onPointerLeave={() => {
                if (this.onPointerLeave) {
                    this.data.interactionModifier.reactionOut.notify();
                }
            }}>
            {element}
        </div>;

        if (this.onEnterView) {
            toReturn = <WrapperComponentEnter wrappedObject={this}>{toReturn}</WrapperComponentEnter>;
        }
        if (this.onExitView) {
            toReturn = <WrapperComponentExit wrappedObject={this}>{toReturn}</WrapperComponentExit>;
        }

        return toReturn;
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [
            ...super.menuTemplate,
            ...nameField(this),
            new CheckBox(
                "enable OnClick Event",
                () => this.onClick,
                (sel: boolean) => {
                    runInAction(() => this.onClick = sel)
                }),
            new CheckBox(
                "enable OnDoubleClick Event",
                () => this.onDblClick,
                (sel: boolean) => {
                    runInAction(() => this.onDblClick = sel)
                }),
            new CheckBox(
                "enable OnPointerEnter Event",
                () => this.onPointerEnter,
                (sel: boolean) => {
                    runInAction(() => this.onPointerEnter = sel)
                }),
            new CheckBox(
                "enable OnPointerLeave Event",
                () => this.onPointerLeave,
                (sel: boolean) => {
                    runInAction(() => this.onPointerLeave = sel)
                }),
            new CheckBox(
                "enable OnEnterView Event",
                () => this.onEnterView,
                (sel: boolean) => {
                    runInAction(() => this.onEnterView = sel)
                }),
            new CheckBox(
                "enable OnExitView Event",
                () => this.onExitView,
                (sel: boolean) => {
                    runInAction(() => this.onExitView = sel)
                })];
        return ret;
    }

    public get getRenderingProperties(): any {
        return super.getRenderingProperties;
    }

    // TODO: reaction outputs are not deleted if InteractionModifier is deleted
    public requestConnectors(): [string, IConnectorPort][] {
        const out = this.data.interactionModifier.reactionOut;
        out.name = this.data.interactionModifier.name;
        return [[out.id, out]];
    }
}

export const InteractionSchema = createModelSchema(InteractionModifier, {
    name: true,
    reactionOut: object(ConnectorSchema)
});

export const HTMLInteractionModifierSchema = createModelSchema(HTMLInteractionModifier, {
    data: object(InteractionModifierData),
    name: true,
    role: true
});

export const plugInExport = exportClass(
    HTMLInteractionModifier,
    "Interaction",
    "internal.modifier.InteractionModifier",
    "icon-mouse",
    true
);
