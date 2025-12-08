import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;

  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit("catalog:changed", { items: this.items });
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItem(itemId: string): IProduct | null {
    return this.items.find(({ id }) => id === itemId) ?? null;
  }

  setCurrentItem(item: IProduct | null): void {
    this.currentItem = item;
    if (item) {
      this.events.emit("product:selected", { item: this.currentItem });
    }
  }

  getCurrentItem(): IProduct | null {
    return this.currentItem;
  }

  clearCurrentItem(): void {
    this.currentItem = null;
  }
}
