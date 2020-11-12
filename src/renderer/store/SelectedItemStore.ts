import { makeAutoObservable } from 'mobx'

export class SelectedItemStore {
    private selectedItemIds: string[]

    constructor() {
        this.selectedItemIds = [];
        makeAutoObservable(this);
    }

    setSelectedItems(ids: string[]): void {
        this.selectedItemIds = ids;
    }

    addToSelectedItems(id: string): void {
        if (!this.isSelected(id)) this.selectedItemIds.push(id)
    }

    removeFromSelectedItems(id: string): void {
        if (this.isSelected(id)) this.selectedItemIds.splice(
            this.selectedItemIds.findIndex(e => e === id), 1
        )
    }

    isSelected(id: string): boolean {
        return this.selectedItemIds.find(value => value === id) !== undefined
    }

    get size(): number {
        return this.selectedItemIds.length
    }

    get first(): string {
        return (this.selectedItemIds.length !== 0) ? this.selectedItemIds[0] : ""
    }

    get ids(): string[] {
        return this.selectedItemIds
    }
}