import { FunctionalComponent } from 'preact';
import { MenuTemplate } from 'preact-sidebar';
import { IStoryObject, StoryGraph } from 'storygraph';
import { IContent, IRenderingProperties, IStoryModifier } from 'storygraph';
import { Class, ClassRegistry, IRegistryEntry, ValueRegistry } from './registry';

/**
 * Creates a PlugIn-Registry
 */
export class PlugInClassRegistry<T extends IPlugIn> extends ClassRegistry<T> {
    
    public registry: Map<string, IPlugInRegistryEntry<T>>;

    constructor() {
        super();
        this.registry = new Map();
        // makeObservable(this, {
        //     register: action,
        //     registry: observable
        // })
    }
}

export interface IPlugInRegistryEntry<T> extends IRegistryEntry<T> {
    name: string;
    id: string;
    author: string;
    version: string;
    icon: string;
    website?: string;
    description?: string;
    public?: boolean;
    category?: string;
    class: Class<T>;
}

export interface INGWebSProps {
    id: string
    registry: ValueRegistry<IStoryObject>
    renderingProperties?: IRenderingProperties
    userDefinedProperties?: any;
    content?: IContent
    modifiers?: IStoryModifier[]
    graph?: StoryGraph
}

export interface IPlugIn {
    menuTemplate: MenuTemplate[];
    getComponent?(): FunctionalComponent<INGWebSProps>;
}
