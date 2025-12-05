import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class ItemData {
  private items: IItem[] = [];
  private readonly events: IEvents;
  public preview?: IItem;

  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Устанавливает весь список товаров
   * @param items Массив товаров
   */
  setAllItems(items: IItem[]): void {
    this.items = [...items]; // копируем массив для защиты внутреннего состояния
    this.events.emit("item:setAllItems");
  }

  /**
   * Находит товар по ID
   * @param itemId Идентификатор товара
   * @returns Товар или undefined, если не найден
   */
  getItem(itemId: string): IItem | undefined {
    return this.items.find((item) => item.id === itemId);
  }

  /**
   * Возвращает все товары
   * @returns Массив товаров
   */
  getAllItems(): IItem[] {
    return [...this.items]; // возвращаем копию массива
  }

  /**
   * Устанавливает текущий просмотренный товар
   * @param item Товар для предварительного просмотра
   */
  setPreview(item: IItem): void {
    this.preview = item;
    this.events.emit("preview:changed", item);
  }
}
