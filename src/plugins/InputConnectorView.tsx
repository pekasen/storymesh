import { AbstractStoryObject } from "./helpers/AbstractStoryObject";
import { h } from "preact";
import { exportClass } from './helpers/exportClass';
import { IConnectorPort, IEdge } from 'storygraph';
import { ConnectorPort } from "../renderer/utils/ConnectorPort";
import { IMenuTemplate } from '../renderer/utils/PlugInClassRegistry';
import { IRegistry } from 'storygraph/dist/StoryGraph/IRegistry';
import { connectionField, nameField } from './helpers/plugInHelpers';
import { action, makeObservable, observable } from 'mobx';
import { stringify } from 'uuid';

export class InputConnectorView extends AbstractStoryObject {
    public name: string;
    public role: string;
    public icon: string;
    public connections: IEdge[];
    public connectors: Map<string, IConnectorPort>;
    public content: undefined;
    public childNetwork: undefined;
    public userDefinedProperties: undefined;
    public menuTemplate: IMenuTemplate[];
    public isContentNode = false;
    public deletable = false;

    public static defaultIcon = "icon-down";

    constructor() {
        super();
        
        this.name = "Inputs";
        this.role = "internal.container.inputconnectorview";
        this.icon = InputConnectorView.defaultIcon;
        this.menuTemplate = [
            ...nameField(this),
            ...connectionField(this)
        ];
        this.connections = [];
        this.connectors = new Map<string, IConnectorPort>();

        makeObservable(this,{
            name: observable,
            updateName: action,
            updateConnections: action
        });
    }

    setup(registry: IRegistry): void {
        if (!this.parent) throw("No, no, no, ye' dirty olde bastard!");
        const parentNode = registry.getValue(this.parent) as AbstractStoryObject;
        if (!parentNode) throw("No, no, no, that'S not possible!");
        // this.menuTemplate = parentNode.menuTemplate;

        parentNode.
        connectors.
        forEach(e => {
            const _new = new ConnectorPort(e.type, "out");
            if (e.direction === "in") {
                this.connectors.set(
                    _new.name, _new
                )
            }
        });
    }

    getComponent() {
        return () => <div></div>
    }

    getEditorComponent() {
        return () => <div></div>
    }

    updateName(name: string): void {
        this.name = name;
    }
}

export const plugInExport = exportClass(
    InputConnectorView,
    "InputConnectorView",
    "internal.container.inputconnectorview",
    InputConnectorView.defaultIcon,
    false
);
