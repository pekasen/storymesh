import { IStoreableObject } from './StoreableObject';
import { UIStore } from './UIStore';
import { ClassRegistry, ValueRegistry } from '../utils/registry';
import { IStoryObject } from 'storygraph/dist/StoryGraph/IStoryObject';
import { PlugInClassRegistry } from '../utils/PlugInClassRegistry';
import { plugInLoader } from './PlugInStore';
import { AbstractStoryObject } from '../../plugins/helpers/AbstractStoryObject';
import { NotificationStore } from './Notification';

export interface IRootStoreProperties {
    uistate: UIStore
    storyContentObjectRegistry: ValueRegistry<IStoryObject>
    storyContentTemplatesRegistry: ClassRegistry<IStoryObject>
}

export class RootStore implements IStoreableObject<IRootStoreProperties> {
    uistate: UIStore
    storyContentObjectRegistry: ValueRegistry<AbstractStoryObject>
    storyContentTemplatesRegistry: PlugInClassRegistry<AbstractStoryObject>
    notifications: NotificationStore;

    constructor(uistate?: UIStore) {
        /**
         * initialize the template store
         */
        this.uistate = uistate || new UIStore(this);

        /**
         * In this registry we store our instantiated StoryObjects
         */
        this.storyContentObjectRegistry = new ValueRegistry<AbstractStoryObject>()

        /**
         * In this registry we store our templates and plugin classes
         */
        this.storyContentTemplatesRegistry = new PlugInClassRegistry<AbstractStoryObject>()
        /**
         * Read the plugins and register them in the template store
         */
        const plugins = plugInLoader();
        this.storyContentTemplatesRegistry.register(plugins);
        /**
         * If we are in a empty and untitled document, make a root storyobject
         */
        if (this.uistate.untitledDocument) {
            const emptyStory = this.storyContentTemplatesRegistry.getNewInstance("internal.container.container");
            if (emptyStory) {
                emptyStory.name = "MyStory";
                this.storyContentObjectRegistry.register(
                    emptyStory
                );
                this.uistate.setLoadedItem(emptyStory.id);
                this.uistate.topLevelObjectID = emptyStory.id;
            }
        }
        /**
         * Initialize notification buffer
         */
        this.notifications = new NotificationStore();
    }

    loadFromPersistance(from: IRootStoreProperties): void {
        // this.model.loadFromPersistance(from.model);
        this.uistate.loadFromPersistance(from.uistate);
    }

    writeToPersistance(): void {
        null
    }

    reset(): void {
        // this.model = new List();
        this.uistate = new UIStore(this);
    }
}
