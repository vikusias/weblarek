import { IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";
import { eventNames } from "../../utils/constants.ts";

export class Basket {
  private items: IProduct[] = [];

  constructor(protected readonly events: IEvents) {}

  // Получить все товары в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавить товар в корзину и вызвать событие
  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit(eventNames.BASKET_ADD_ITEM);
  }

  // Удалить товар по идентификатору и вызвать событие
  deleteItem(itemToDelete: IProduct): void {
    this.items = this.items.filter(({ id }) => id !== itemToDelete.id);
    this.events.emit(eventNames.BASKET_DELETE_ITEM);
  }

  // Очистить корзину и вызвать событие
  clear(): void {
    this.items = [];
    this.events.emit(eventNames.BASKET_CLEAR);
  }

  // Рассчитать общую стоимость товаров
  getTotalPrice(): number {
    return this.items.reduce((sum, { price }) => sum + (price ?? 0), 0);
  }

  // Получить количество товаров
  getTotalItems(): number {
    return this.items.length;
  }

  // Проверить наличие товара по id
  hasItem(itemId: string): boolean {
    return this.items.some(({ id }) => id === itemId);
  }
}
