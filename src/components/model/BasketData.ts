import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class BasketData {
  private items: IItem[] = [];
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Заменяет весь список товаров в корзине
   * @param items Массив товаров
   */
  setAllItems(items: IItem[]): void {
    this.items = [...items]; // копируем массив для предотвращения внешних изменений
    this.events.emit("basket:setAllItems");
  }

  /**
   * Вычисляет общую сумму цен товаров в корзине
   * @returns Общая цена
   */
  getFullPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  /**
   * Добавляет товар в корзину
   * @param item Товар для добавления
   */
  addItem(item: IItem): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  /**
   * Удаляет товар по ID
   * @param id Идентификатор товара для удаления
   */
  deleteItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed");
  }

  /**
   * Проверяет, есть ли товар в корзине
   * @param item Товар для проверки
   * @returns true, если товар есть в корзине
   */
  getBasketItems(item: IItem): boolean {
    return this.items.includes(item);
  }

  /**
   * Возвращает массив ID всех товаров с ненулевой ценой
   * @returns Массив ID товаров
   */
  getBasketIdItems(): string[] {
    return this.items
      .filter((item) => item.price !== null && item.price !== undefined)
      .map((item) => item.id);
  }

  /**
   * Очищает всю корзину
   */
  deleteAllItems(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  /**
   * Возвращает все товары в корзине
   * @returns Массив товаров
   */
  getAllItems(): IItem[] {
    return [...this.items]; // возвращаем копию массива для защиты внутреннего состояния
  }
}
