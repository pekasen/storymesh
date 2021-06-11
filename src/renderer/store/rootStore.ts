import { ipcRenderer } from "electron";
import { makeAutoObservable } from 'mobx';
import { deepObserve } from "mobx-utils";
import { existsSync, readFileSync } from "original-fs";
import { createModelSchema, deserialize, object } from "serializr";
import { PReg, StoryObject, VReg, AbstractStoryModifier } from "storygraph";
import { __prefPath } from "../../constants";
import { Container } from "storymesh-plugin-base";
import { Preferences } from "../../preferences";
import { IPlugInRegistryEntry } from "../utils/PlugInClassRegistry";
import { AutoValueRegistrySchema } from '../utils/registry';
import { NotificationStore } from './Notification';
import { plugInLoader2, PlugInStore } from './PlugInStore';
import { StateProcotol } from "./StateProcotol";
import { UIStore } from './UIStore';
import { start } from "storygraph";



export interface IRootStoreProperties {
    uistate: UIStore
    storyContentObjectRegistry: VReg
    storyContentTemplatesRegistry: PReg
}

export class RootStore {
    uistate: UIStore
    storyContentObjectRegistry: VReg
    pluginStore: PReg;
    notifications: NotificationStore;
    protocol: StateProcotol;
    userPreferences: Preferences;

    constructor(uistate?: UIStore) {
        /**
         * load'dem user perferencenses
         */
        this.userPreferences = new Preferences();
        this.readPreferences();
        ipcRenderer.on('reload-preferences', () => {
            this.readPreferences();
        });
        const { ppreg, preg, vreg } = start();
        /**
         * initialize the UI store
         */
        this.uistate = uistate || new UIStore();
        /**
         * In this registry we store our instantiated StoryObjects
         */
        // this.storyContentObjectRegistry = new ValueRegistry<StoryObject>();
        this.storyContentObjectRegistry = vreg;
        /**
         * In this registry we store our templates and plugin classes
         */
        this.pluginStore = preg;
        /**
         * Read the plugins and register them in the template store
         */
        const plugins = plugInLoader2("plugins/content");
        const modifiers = plugInLoader2("plugins/modifiers");

        plugins.forEach((plug: IPlugInRegistryEntry<StoryObject>) => this.pluginStore.set(plug.id, plug));
        modifiers.forEach(plug => this.pluginStore.set(plug.id, plug));
    
        /**
         * If we are in a empty and untitled document, make a root storyobject
         */
        if (this.uistate.untitledDocument) {
            const emptyStory = new Container();
            // const emptyStory = this.pluginStore.get("internal.content.container") as StoryObject;
            if (emptyStory) {
                this.storyContentObjectRegistry.set(
                    emptyStory.id, emptyStory
                );
                (emptyStory as Container).setup(this.storyContentObjectRegistry, this.uistate);
                emptyStory.name = "My Story";
                // this.topLevelObject = emptyStory;
                this.uistate.setLoadedItem(emptyStory.id);
                this.uistate.topLevelObjectID = emptyStory.id;
            }
        }
        /**
         * Initialize notification buffer
         */
        this.notifications = new NotificationStore();
        /**
         * Initialize protocol buffer
         */
        this.protocol = new StateProcotol();

        makeAutoObservable(this, {
            protocol: false
        });

        deepObserve(this, (change): void => {
            // Logger.info("changed state", path);
            this.protocol.persist(change);
        });
    }

    reset(): void {
        this.uistate = new UIStore();
    }

    replace(root: RootStore): void {
        this.storyContentObjectRegistry = root.storyContentObjectRegistry;
        this.uistate = root.uistate;
    }

    readPreferences(): void {
        if (existsSync(__prefPath)) {
            const data = readFileSync(
                __prefPath,
                {
                    encoding: "utf8"
                }
            );
            const _d = JSON.parse(data);
            const _e  = deserialize(Preferences, _d);
    
            if (_e) this.userPreferences = _e;
        }
    }
}

/**
 * Initialize model schema
 */
export const RootStoreSchema = createModelSchema(
    RootStore,
    {
        uistate: object(UIStore),
        storyContentObjectRegistry: object(AutoValueRegistrySchema()),
    }
);

// observe(this, (change) => Logger.info("changed state", change));
        // spy((change) => {
        //     // Logger.info("changed state", change)
        //     if (change.type == "add" ||
        //         change.type == "splice" ||
        //         change.type == "update" ||
        //         change.type == "remove") {
        //             this.protocol.persist(change);
        //         }
        // });
        // reaction(
        //     () => {
                

        //         // eslint-disable-next-line @typescript-eslint/ban-types
        //         const traverse = (o: object) => {
        //             const _ret: unknown[] = [];
        //             Object.entries(o).forEach(value => {
        //                 const [key, val] = value;
        //                 Logger.info(key);

        //                 if (val && typeof val === "object") {
        //                     _ret.push(...traverse(val));
        //                 } else if (val) {
        //                     _ret.push(val)
        //                 }
        //             })
        //             return _ret;
        //         }
                
        //         const _r = traverse(this.storyContentObjectRegistry);
        //         Logger.info(_r);

        //     },
        //     (arg, prev, r) => {
        //         Logger.info("state", r);
        //     }
        // )