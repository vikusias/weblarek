import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export interface IBasket {
  addItem(item: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getItems(): IProduct[];
  getTotalPrice(): number;
  getTotalItems(): number;
  hasItem(id: string): boolean;
}

export class Basket implements IBasket {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {
    this.events.emit("basket:changed", {
      items: this.items,
      total: this.getTotalPrice(),
      count: this.getTotalItems(),
    });
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, { price }) => {
      return price !== null ? sum + price : sum;
    }, 0);
  }

  getTotalItems(): number {
    return this.items.length;
  }

  hasItem(itemId: string): boolean {
    return this.items.some(({ id }) => id === itemId);
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.events.emit("basket:changed", {
        items: this.getItems(),
        total: this.getTotalPrice(),
        count: this.getTotalItems(),
      });
    }
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(({ id }) => id !== itemId);
    this.events.emit("basket:changed", {
      items: this.getItems(),
      total: this.getTotalPrice(),
      count: this.getTotalItems(),
    });
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed", {
      items: this.getItems(),
      total: this.getTotalPrice(),
      count: this.getTotalItems(),
    });
  }
}
