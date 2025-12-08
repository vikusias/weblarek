# Проектная работа "Веб-ларек"

[github]: https://github.com/vikusias/weblarek

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Товар

```
interface IProduct {
id: string; // Уникальный идентификатор товара
description: string; // Описание товара
image: string; // URL изображения товара
title: string; // Название товара
category: string; // Категория товара
price: number | null; // Цена товара, null – товар бесценный
}
```

#### Покупатель

```
interface IBuyer {
  payment: TPayment;    // Способ оплаты: 'online' | 'cash'
  address: string;      // Адрес доставки
  email: string;        // Электронная почта
  phone: string;        // Телефон
}
```

#### Сообщения валидации

```
type TBuyerValidityMessages = Partial<{
  payment: string;
  address: string;
  email: string;
  phone: string;
}>;
```

#### Категории товаров

```
type TCategoryNames =
  | 'софт-скил'
  | 'хард-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'другое';
```

### Модели данных

#### Каталог товаров Catalog

```
 class Catalog {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;
```

Основные методы:

- setItems(items: IProduct[]): void // Установка списка товаров
- getItems(): IProduct[] // Получение всех товаров
- getItem(itemId: string): IProduct | null // Поиск товара по ID
- setCurrentItem(item: IProduct | null): void // Установка текущего товара
- getCurrentItem(): IProduct | null // Получение текущего товара
- clearCurrentItem(): void // Сброс текущего товара
  }

#### Корзина Basket

```
 class Basket {
  private items: IProduct[] = [];
```

Основные методы:

- addItem(item: IProduct): void // Добавление товара
- deleteItem(itemId: string): void // Удаление товара по ID
- clear(): void // Очистка корзины
- getItems(): IProduct[] // Все товары в корзине
- getTotalPrice(): number // Общая стоимость
- getTotalItems(): number // Количество товаров
- hasItem(itemId: string): boolean // Проверка наличия товара

Работа с localStorage:

- private saveToStorage(): void // Сохранение в localStorage
- private loadFromStorage(): void // Загрузка из localStorage
  }

#### Покупатель Customer

```
  class Customer {
  private payment: TPayment = "";
  private address: string = "";
  private phone: string = "";
  private email: string = "";
```

Основные методы:

- setPayment(payment: TPayment): void // Установка способа оплаты
- setAddress(address: string): void // Установка адреса
- setPhone(phone: string): void // Установка телефона
- setEmail(email: string): void // Установка email
- getData(): IBuyer // Получение всех данных
- clear(): void // Очистка данных

Валидация:

- checkValidity(): TBuyerValidityMessages // Проверка данных
- isValid(): boolean // Проверка на валидность
  }

### Слой API взаимодействия

```
- class ProductApi {
constructor(private api: IApi) {}
```

- Получает список товаров
  async getProducts(): Promise<IGetProductsApiResponse> {
  return this.api.get<IGetProductsApiResponse>("/product");
  }

- Оформляет заказ
  async order(data: IOrderApiRequest): Promise<IOrderApiResponse> {
  return this.api.post<IOrderApiResponse>("/order", data);
  }
  }

  - Получение товаров
    interface IGetProductsApiResponse {
    items: IProduct[];
    }

- Оформление заказа
  interface IOrderApiRequest {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
  }

```
interface IOrderApiResponse {
  id: string;
  total: number;
}
```

## Представления (Views)

Все компоненты UI наследуются от базового класса Component<T>:

- Отображают данные пользователю

- Генерируют события при взаимодействии

- Не содержат бизнес-логику

```
HeaderView
```

Назначение: отображает шапку сайта, включая кнопку для открытия корзины.
Конструктор:

```
constructor(container: HTMLElement, events: IEvents)
```

— принимает DOM-элемент контейнера и объект событий для взаимодействия.

Свойства:

- counter: HTMLElement — элемент для отображения количества товаров в корзине.
- basket: HTMLButtonElement — кнопка для открытия корзины.

Методы:

- set count(value: number) — обновляет число товаров в счетчике.

```
ModalView
```

Назначение: реализует диалоговое окно для отображения динамического контента.
Конструктор:

```
constructor(container: HTMLElement, events: IEvents)
```

— получает контейнер для модальных окон.

Свойства:

- closeButton: HTMLButtonElement — кнопка закрытия.
- content: HTMLElement — область для вставки содержимого.
- overlay: HTMLElement — оверлей модального окна.

Методы:

- set content(value: HTMLElement) — вставляет содержимое в модальное окно.
- showLoading(message?: string) — отображает индикатор загрузки.
- open() — показывает окно, устанавливает обработчики закрытия
- close() — скрывает окно, удаляет обработчики.

```
GalleryView
```

Назначение: контейнер для отображения карточек товаров.
Конструктор:

```
constructor(container: HTMLElement)
```

— задает DOM-элемент, в который вставляются карточки.

Свойства:

- set items(value: HTMLElement[]) — наполняет контейнер карточками.

```
CardView<T>
```

(базовый класс карточек)

Назначение: базовый класс для отображения карточки товара.

Конструктор:

```
constructor(container: HTMLElement)
```

— принимает контейнер.

Свойства:

- set title(value: string) — название товара.
- set price(value: number | null) — цена товара.
- set category(value: TCategoryNames) — категория товара, с соответствующим стилем.
- set image(value: string) — изображение товара.
- set buttonText(value: string) — текст кнопки.
- set buttonDisabled(value: boolean) — состояние кнопки.

Методы:

- setText(element: HTMLElement, text: string) — вспомогательный метод для установки текста.
- setImage(element: HTMLImageElement, src: string, alt?: string) — установка изображения.

```
CardBasketView
```

(карточка товара в корзине) — наследуется от CardView<ICardBasket>
Назначение: отображение товара в корзине с номером позиции и кнопкой удаления.

Конструктор:

```
constructor(container: HTMLElement, actions?: ICardActions)
```

Свойства:

- set index(value: number) — отображает порядковый номер.
- index: HTMLElement — элемент для номера.
- deleteButton: HTMLButtonElement — кнопка удаления.

Методы:

- render(data: Partial<ICardBasket>) — обновляет карточку.

```
CardCatalogView
```

(карточка товара в каталоге) — наследуется от CardView<IProduct>

Конструктор:

constructor(container: HTMLElement, actions?: ICardActions)

```

```

Свойства:

- set id(value: string) — идентификатор товара.
- get id(): string — получение id.
- set category(value: TCategoryNames) — категория товара.
- set image(value: string) — изображение.

Методы:

- render(data: Partial<IProduct>) — обновляет карточку.

```

CardPreviewView

```

(предпросмотр товара) — наследует CardView<ICardPreview>

Конструктор:

```

constructor(container: HTMLElement, actions?: ICardActions)

```

Свойства:

- set description(value: string) — описание.
- set canBuy(value: boolean) — блокировка кнопки.
- set buttonText(value: string) — текст кнопки.
- categoryElem — элемент категории.
- imageElem — изображение товара.
- description: HTMLElement — описание.
- button: HTMLButtonElement — кнопка.

Методы:

- render(data: Partial<ICardPreview>) — обновляет отображение.

```

BasketView

```

Назначение: отображает список товаров в корзине, сумму, кнопку оформления.

Конструктор:

```

constructor(container: HTMLElement, events: IEvents)

```

Свойства:

- set items(value: HTMLElement[]) — список карточек товаров.
- set total(value: number) — сумма.
- list: HTMLElement — контейнер для товаров.
- total: HTMLElement — элемент суммы.
- button: HTMLButtonElement — кнопка оформления заказа.

Методы:

- render(data: Partial<IBasketData>) — обновляет отображение.
- set canCheckout(value: boolean) — активирует/деактивирует кнопку.

```

OrderFormView

```

Назначение: форма для оформления заказа

Конструктор:

```

constructor(container: HTMLElement, events: IEvents)

```

Свойства:

- set payment(value: TPayment) — активирует выбранный способ оплаты.
- set address(value: string) — заполняет адрес.
- buttons: HTMLButtonElement[] — кнопки выбора способа.
- address: HTMLInputElement — поле адреса.
- submit: HTMLButtonElement — кнопка отправки.
- errors: HTMLElement — блок ошибок.

Методы:

- valid: boolean — активность кнопки.
  errors: string[] — вывод ошибок.
- render(data: Partial<IOrderFormData>) — обновляет отображение.

```

ContactsFormView

```

Назначение: форма ввода контактов

Конструктор:

```

constructor(container: HTMLElement, events: IEvents)

```

Свойства:

- set email(value: string) — электронная почта.
- set phone(value: string) — телефон.
- email: HTMLInputElement — поле email.
- phone: HTMLInputElement — поле телефон.
- submit: HTMLButtonElement — кнопка.
- errors: HTMLElement — блок ошибок.

Методы:

- valid: boolean
  errors: string[]
  render(data: Partial<IContactsFormData>)

```

OrderSuccessView

Назначение: отображение подтверждения заказа.

```

Конструктор:

```

constructor(container: HTMLElement, events: IEvents)

```

Свойства:

- set total(value: number) — отображает сумму заказа.
- description: HTMLElement — описание.
- closeButton: HTMLButtonElement — кнопка закрытия.

Методы:

- render(data: IOrderSuccessData) — обновление отображения.

Эта структура отражает разделение ответственности, использование наследования и взаимодействие через события, что делает архитектуру гибкой и расширяемой.

## Presenter (Презентер)

Класс

```
App
```

- Главный координатор приложения:

- Обрабатывает события от View

- Обновляет Model

- Координирует переходы между состояниями

- Управляет модальными окнами

```
class App {
   Модели
  private catalog: Catalog;
  private basket: Basket;
  private customer: Customer;

  Представления
  private modal: ModalView;
  private header: HeaderView;
  private gallery: GalleryView;

    Валидаторы форм
  private formValidators: {
    order: boolean;
    contacts: boolean;
  };

  constructor(private events: IEvents, private api: ProductApi) {
    Инициализация компонентов
    this.initViews();
    this.setupEventListeners();
    this.loadProducts();
  }

    Основные методы:
  private initViews(): void              // Инициализация представлений
  private setupEventListeners(): void    // Настройка обработчиков событий
  private loadProducts(): void           // Загрузка товаров с сервера
  private renderCatalog(): void          // Рендер каталога
  private showProductModal(): void       // Показ деталей товара
  private showBasketModal(): void        // Показ корзины
  private showOrderModal(): void         // Показ формы заказа
  private showContactsModal(): void      // Показ формы контактов
  private processOrder(): void           // Отправка заказа
  private validateOrderForm(): void      // Валидация формы заказа
  private validateContactsForm(): void   // Валидация формы контактов
  private updateHeader(): void           // Обновление шапки
}

```
