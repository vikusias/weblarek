import { Api, ApiListResponse } from "../base/Api";
import { IItem, IOrder, IOrderResult } from "../../types";

// Поле для хранения базового URL CDN
export class AppApi extends Api {
  readonly cdn: string;

  // Конструктор класса. Инициализирует базовые параметры API и сохраняет URL CDN
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options); // вызов конструктора базового класса Api
    this.cdn = cdn; // сохраняем URL CDN для использования в методах
  }

  // Асинхронный метод получения списка всех товаров.
  async getAllItem(): Promise<IItem[]> {
    // Получение данных с сервера (ответ содержит список товаров)
    const data: ApiListResponse<IItem> = await this.get("/product/");
    // Обработка массива товаров
    return data.items.map((item) => ({
      ...item, // копируем все свойства товара
      image: this.cdn + item.image.replace(".svg", ".png"), // создаем полную ссылку на изображение
    }));
  }
  //  Асинхронный метод получения товара по его ID.
  async getItemId(itemId: string): Promise<IItem> {
    // Запрос к API для получения конкретного товара по ID
    const item: IItem = await this.get(`/product/${itemId}`);
    // Обновляем ссылку на изображение и возвращаем объект товара
    return {
      ...item,
      image: this.cdn + item.image.replace(".svg", ".png"),
    };
  }

  //Асинхронный метод для отправки заказа.
  async postItem(order: IOrder): Promise<IOrderResult> {
    // Отправка данных заказа на сервер
    const data: IOrderResult = await this.post("/order", order);
    // Возврат ответа без изменений
    return data;
  }
}
