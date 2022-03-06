import { ipcRenderer } from "electron";
import { makeAutoObservable, observable } from 'mobx';
import { deepObserve } from "mobx-utils";
import { existsSync, readFileSync } from "original-fs";
import { createModelSchema, deserialize, object } from "serializr";
import { PReg, VReg, PPReg } from "storygraph";
import { __prefPath } from "../../constants";
import { Container } from "storymesh-plugin-base";
import { Preferences } from "../../preferences";
import { AutoValueRegistrySchema } from '../utils/registry';
import { NotificationStore } from './Notification';
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
    pluginPackstore: PPReg;
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
        this.storyContentObjectRegistry = makeAutoObservable(vreg, {
            __registry: observable.deep,
        });
        
        /**
         * In this registry we store our templates and plugin classes
         */
        this.pluginStore = preg;
        this.pluginPackstore = ppreg;
        
        /**
         * Read the plugins and register them in the template store
         */    
        Promise.all(
            this.userPreferences.installedPackages.map(pp_name => (
                import(pp_name)
            ))
        ).then((values) => {
            values.forEach((value) => {
                const { PlugInExports } = value;
                console.dir("Thing", PlugInExports);
                ppreg.set(PlugInExports.name, PlugInExports);
                // TODO: send message to App that loading is finished and we can build the UI
            });
        });
        
        /**
         * If we are in a empty and untitled document, make a root storyobject
         */
        if (this.uistate.untitledDocument) {
            const emptyStory = new Container();
            // const emptyStory = this.pluginStore.get("internal.content.container") as StoryObject;
            if (emptyStory) {
                this.storyContentObjectRegistry.set(
                    // @ts-ignore
                    emptyStory.id, emptyStory
                );
                (emptyStory as Container).setup(this.storyContentObjectRegistry);
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
            // @ts-ignore
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
        storyContentObjectRegistry: object(VReg), // AutoValueRegistrySchema() 
    }
);
