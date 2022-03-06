import { ipcRenderer } from 'electron/renderer';
import { readFile, writeFile } from "fs";
import Logger from 'js-logger';
import { deserialize, serialize } from 'serializr';
import { StoryObjectSchema, VReg } from 'storygraph';
import { rootStore } from '../index';
import { RootStoreSchema } from "../store/rootStore";
import { ValueRegistrySchema } from './registry';

/**
 * registers file-event handlers
 */
export function registerHandlers(): void {
    ipcRenderer.on('save', (e, { file }) => {
        // rootStore.root.uistate.setFile(file);
        const json = serialize(rootStore.root);
        Logger.info(json)
        if (file !== undefined) {
            rootStore.root.uistate.setFile(file)
        }
        writeFile(
            file || rootStore.root.uistate.file,
            JSON.stringify(json),
            (err) => {
                if (err) throw(err); // if the selected file does not exist, raise hell!
                else {
                    const { root } = rootStore;
                    root.notifications.postNotification("Saved", null, "normal", 5);
                }
            }
        );
    });
    
    ipcRenderer.on('load', (e, { file }) => {
        // rootStore.root.uistate.setFile(file);
        // rootStore.root.reset();

        readFile(file, { encoding: 'utf8' }, (err, data) => {
            if (err)
                throw err;
            const parsedData = JSON.parse(data);
            if (parsedData) {
                deserialize(RootStoreSchema, parsedData, (err, result) => {
                    if (err) throw(err);
                    
                    Logger.info("Heres what's loaded", result);
                    rootStore.root.replace(result);
                }, null);
            }
        });
    });
    
    ipcRenderer.on('request', () => {
        ipcRenderer.send('request-reply', {
            file: rootStore.root.uistate.file
        });
    });
    
    ipcRenderer.on('new', () => {
        rootStore.root.reset();
    });

    ipcRenderer.on('delete', () => {
        const selectedItemIds = rootStore.root.uistate.selectedItems.ids;
        const reg = rootStore.root.storyContentObjectRegistry;
        Logger.info("delete", selectedItemIds);
        const loadedObject = rootStore.root.storyContentObjectRegistry.get(rootStore.root.uistate.loadedItem);

        selectedItemIds.forEach(selectedItemID => {
            const selectedItem = reg.get(selectedItemID);
            if ( selectedItem && selectedItem.parent && selectedItem.deletable) {
                const parentItem = reg.get(selectedItem.parent)
                // remove ties and die
                parentItem?.childNetwork?.removeNode(reg, selectedItem.id);
                rootStore.root.uistate.moveableItems.deregister(selectedItemID);
                rootStore.root.storyContentObjectRegistry.rm(selectedItemID);
            } else if (selectedItemID.startsWith("edge.")) { // disconnect edges                
                const selectedEdges = loadedObject?.childNetwork?.edges.filter((edge) => edge.id == selectedItemID);
                if (selectedEdges)
                    loadedObject?.childNetwork?.disconnect(rootStore.root.storyContentObjectRegistry, selectedEdges);
            }            
        });
    });

    ipcRenderer.on("undo", () => {
        rootStore.root.protocol.undo();
    });
    
    ipcRenderer.on("redo", () => {
        rootStore.root.protocol.redo();
    });

    ipcRenderer.on("export", (e, { file }) => {
        const json = serialize(VReg, rootStore.root.storyContentObjectRegistry);
        Logger.info(json)
        if (file !== undefined) {
            rootStore.root.uistate.setFile(file)
        }
        writeFile(
            file,
            JSON.stringify(json),
            (err) => {
                if (err) throw(err); // if the selected file does not exist, raise hell!
                else {
                    const { root } = rootStore;
                    root.notifications.postNotification("Export complete", null, "normal", 5);
                }
            }
        );
    })
}
