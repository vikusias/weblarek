import { IProduct } from "../../types";

export class Catalog {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(itemId: string): IProduct | null {
    return this.items.find(({ id }) => id === itemId) ?? null;
  }

  setCurrentItem(item: IProduct | null): void {
    this.currentItem = item;
  }

  getCurrentItem(): IProduct | null {
    return this.currentItem;
  }
}
