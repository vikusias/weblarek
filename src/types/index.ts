import { categoryMap } from "../utils/constants.ts";

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

export type TCategoryNames = keyof typeof categoryMap;
