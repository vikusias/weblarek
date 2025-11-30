import { IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";
import { eventNames } from "../../utils/constants.ts";

export class Catalog {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Установить список товаров и вызвать событие
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit(eventNames.CATALOG_SET_ITEMS);
  }

  // Получить все товары
  getItems(): IProduct[] {
    return this.items;
  }

  // Найти товар по id, вернуть null если не найден
  getItem(itemId: string): IProduct | null {
    return this.items.find(({ id }) => id === itemId) ?? null;
  }

  // Установить текущий выбранный товар и вызвать событие
  setCurrentItem(item: IProduct): void {
    this.currentItem = item;
    this.events.emit(eventNames.CATALOG_SET_CURRENT_ITEM);
  }

  // Получить текущий выбранный товар
  getCurrentItem(): IProduct | null {
    return this.currentItem;
  }
}
