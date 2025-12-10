import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export interface ICatalog {
  getItems(): IProduct[];
  getItem(id: string): IProduct | undefined;
  setItems(items: IProduct[]): void;
}

export class Catalog implements ICatalog {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit("catalog:changed", { items: this.items });
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItem(itemId: string): IProduct | undefined {
    return this.items.find(({ id }) => id === itemId);
  }
}
