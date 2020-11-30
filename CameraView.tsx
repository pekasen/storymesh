import { IConnectorPort, StoryGraph } from 'storygraph';
import { AbstractStoryObject } from "./helpers/AbstractStoryObject";
import { h } from "preact";
import { IMenuTemplate } from '../renderer/utils/PlugInClassRegistry';
import { connectionField, dropDownField, nameField } from './helpers/plugInHelpers';
import { exportClass } from './helpers/exportClass';
import { action, makeObservable, observable } from 'mobx';
import { useContext, useRef } from 'preact/hooks';
import { Store } from '../renderer';
// import { webGLEngine } from "../renderer/index";
import * as BABYLON from 'babylonjs';
import "babylonjs-loaders";
// import "babylonjs-inspector";

class _CameraView extends AbstractStoryObject {
    public content: any;
    public childNetwork: undefined;
    public name: string;
    public role = "internal.content.cameraview";
    public isContentNode = true;
    public userDefinedProperties: any;
    public connectors: Map<string, IConnectorPort>;
    public icon: string;
    public menuTemplate: IMenuTemplate[];
    
    static defaultIcon = "icon-camera";
    
    public cameraIds: string[];
    public activeCamera: string;

    constructor() {
        super();
        this.name = "Camera View";
        this.icon = _CameraView.defaultIcon;
        this.connectors = new Map<string, IConnectorPort>();
        [
            {
                name: "data-in",
                type: "data",
                direction: "in"
            },
            {
                name: "flow-in",
                type: "flow",
                direction: "in"
            },
            {
                name: "flow-out",
                type: "flow",
                direction: "out"
            }
        ].forEach(e => this.connectors.set(e.name, e as IConnectorPort));
        this.menuTemplate = [
           ...nameField(this),
           ...connectionField(this),
           ...dropDownField(
               this,
               () => this.cameraIds as string[],
               () => this.activeCamera,
               (selection) => this.updateActiveCamera(selection)
            )
        ];
        this.content = {};
        this.activeCamera = "";
        this.cameraIds = [];

        makeObservable(this, {
            name: observable,
            content: observable.deep,
            cameraIds: observable,
            activeCamera: observable,
            updateCameraIds: action,
            updateName: action,
            getComponent: false
        });

    }

    public pullData(): any {
        // get parent network
        const port = this.getPort();
        if (port && port.call) return port.call();
    }

    public updateName(name: string) {
        this.name = name;
    }

    public getComponent() {
        
        return () => {
            const canvas = useRef(null);
            const elem = <canvas id={`canvas-${this.id}`}  ref={canvas}/>;
            const engine = new BABYLON.Engine(canvas.current);
            // above code works fine!

            const file = this.pullData() as string | undefined;
            
            if (file) {
                console.log(file)
                BABYLON.SceneLoader.LoadAsync(
                    file, "", engine
                ).then((scene: BABYLON.Scene) => {
                    // scene.debugLayer.show();
                    scene.setActiveCameraByID("Camera");

                    this.updateCameraIds(scene.cameras.map(e => e.id));
                    
                    engine.runRenderLoop(() => {
                        scene.render();
                    });
                });
            }

            return elem;
        };
    }

    public updateCameraIds(ids: string[]) : void {
        this.cameraIds = ids;
    }

    public updateActiveCamera(selection: string) : void {
        this.activeCamera = selection;
    }

    public getEditorComponent() {
        return () => <div></div>
    }

    private getPort() {
        if (this.connections.length > 0) {
            const registry = useContext(Store).storyContentObjectRegistry;
            // get data edges for this node
            const incoming = this.connections.
                filter(edge => {
                    const [id, port]: string[] = StoryGraph.parseNodeId(edge.to);
                    return port.startsWith("data") && id === this.id;
                });
            // pull data from their scene
            if (incoming.length === 1) {
                const [id, port] = StoryGraph.parseNodeId(incoming[0].from);
                const fromNode = registry.getValue(id);
                const _port = fromNode?.connectors.get(port);

                if (_port)
                    return _port
            }
        } else return;
    }
}

export const plugInExport = exportClass(
    _CameraView,
    "Camera View",
    "internal.content.cameraview",
    _CameraView.defaultIcon,
    true
);
