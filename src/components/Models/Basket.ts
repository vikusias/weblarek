import { IProduct } from "../../types";

export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    deleteItem(itemToDelete: IProduct): void {
        this.items = this.items.filter(({id}) => id !== itemToDelete.id);
    }

    clear(): void {
        this.items = [];
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, {price}) => {
            if (price) {
                sum += price;
            }

            return sum;
        }, 0);
    }

    getTotalItems(): number {
        return this.items.length;
    }

    hasItem(itemId: string): boolean {
        return this.items.some(({id}) => id === itemId);
    }
}
