import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

const BASKET_STORAGE_KEY = "weblarek_basket";

export class Basket {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      const itemsToSave = this.items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
      }));
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(itemsToSave));
    } catch (error) {
      console.warn("Не удалось сохранить корзину в localStorage:", error);
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(BASKET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.items = parsed;
        this.events.emit("basket:changed", { items: this.items });
      }
    } catch (error) {
      console.warn("Не удалось загрузить корзину из localStorage:", error);
      localStorage.removeItem(BASKET_STORAGE_KEY);
    }
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.saveToStorage();
      this.events.emit("basket:changed", { items: this.items });
    }
  }

  deleteItem(itemId: string): void {
    this.items = this.items.filter(({ id }) => id !== itemId);
    this.saveToStorage();
    this.events.emit("basket:changed", { items: this.items });
  }

  clear(): void {
    this.items = [];
    localStorage.removeItem(BASKET_STORAGE_KEY);
    this.events.emit("basket:changed", { items: this.items });
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, { price }) => {
      return price ? sum + price : sum;
    }, 0);
  }

  getTotalItems(): number {
    return this.items.length;
  }

  hasItem(itemId: string): boolean {
    return this.items.some(({ id }) => id === itemId);
  }

  getItem(itemId: string): IProduct | undefined {
    return this.items.find((item) => item.id === itemId);
  }
}
