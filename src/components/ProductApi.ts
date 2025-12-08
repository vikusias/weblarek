import {
  IApi,
  IGetProductsApiResponse,
  IOrderApiRequest,
  IOrderApiResponse,
} from "../types";
export type { IProduct } from "../types";

// Класс для взаимодействия с API по товарам и заказам
export class ProductApi {
  constructor(private api: IApi) {} // Передача api-интерфейса через конструктор

  // Метод получения списка товаров
  async getProducts(): Promise<IGetProductsApiResponse> {
    try {
      return await this.api.get<IGetProductsApiResponse>("/product");
    } catch (error) {
      console.error("Ошибка при получении товаров:", error); // Лог ошибок
      throw error; // Переброс ошибки
    }
  }

  // Метод оформления заказа
  async order(data: IOrderApiRequest): Promise<IOrderApiResponse> {
    try {
      return await this.api.post<IOrderApiResponse>("/order", data);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error); // Лог ошибок
      throw error; // Переброс ошибки
    }
  }
}
