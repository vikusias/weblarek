// Тип для ответа API
export type ApiListResponse<Type> = {
  total: number; // Общее число элементов, возвращаемых API
  items: Type[]; // Массив элементов определенного типа
};

// Тип для методов HTTP-запросов, используемых в API
export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export class Api {
  readonly baseUrl: string; // Базовый URL API, задается при создании экземпляра
  protected options: RequestInit; // Опции для fetch-запросов, включают заголовки и др.

  // Конструктор инициализирует базовый URL и опции (по умолчанию пустой объект)
  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    // Устанавливаем заголовки по умолчанию, добавляя Content-Type и любые дополнительные из options
    this.options = {
      headers: {
        "Content-Type": "application/json",
        ...((options.headers as object) ?? {}), // объединение пользовательских заголовков
      },
    };
  }

  // Защищенный метод обработки ответа сервера
  protected handleResponse(response: Response): Promise<object> {
    if (response.ok) {
      return response.json();
    } else {
      return response
        .json()
        .then((data) => Promise.reject(data.error ?? response.statusText));
    }
  }

  // Метод для выполнения GET-запроса
  get(uri: string) {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: "GET", // метод GET
    }).then(this.handleResponse); // обработка ответа
  }

  // Метод для выполнения POST, PUT или DELETE-запроса
  post(uri: string, data: object, method: ApiPostMethods = "POST") {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method, // указываем метод
      body: JSON.stringify(data), // сериализация данных в JSON
    }).then(this.handleResponse);
  }
}
