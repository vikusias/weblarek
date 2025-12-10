export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TBuyerValidityMessages = { [k in keyof IBuyer]?: string };

export type TPayment = "card" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  address: string;
  phone: string;
  email: string;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrderApiRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface IGetProductsApiResponse {
  total: number;
  items: IProduct[];
}

export interface IErrorApiResponse {
  error: string;
}

export interface IOrderApiResponse {
  id: string;
  total: number;
}

export type TCategoryNames =
  | "софт-скил"
  | "хард-скил"
  | "кнопка"
  | "дополнительное"
  | "другое";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IFormViewActions {
  onSubmit: (data: object) => void;
  onChange?: (field: string, value: string) => void;
}

// Интерфейсы для моделей
export interface ICatalog {
  getItems(): IProduct[];
  getItem(id: string): IProduct | undefined;
  setItems(items: IProduct[]): void;
}

export interface IBasket {
  addItem(item: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getItems(): IProduct[];
  getTotalPrice(): number;
  getTotalItems(): number;
  hasItem(id: string): boolean;
}

export interface ICustomer {
  setPayment(payment: TPayment): void;
  setAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  clear(): void;
  getData(): IBuyer;
  checkValidity(): TBuyerValidityMessages;
}
