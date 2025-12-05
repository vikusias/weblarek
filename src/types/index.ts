export interface IUser {
  address: string;
  phone: string;
  payment: string | null; // добавляем null
  email: string;
}

// Класс UserData с свойством order типа IUser
export class UserData {
  order: IUser = {
    phone: "",
    address: "",
    email: "",
    payment: null,
  };

  // Можно добавить методы для работы с данными
  setOrderData(data: Partial<IUser>) {
    this.order = { ...this.order, ...data };
  }

  getOrderData(): IUser {
    return this.order;
  }
}

export interface IItem {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
}

export interface IItemView extends IItem {
  index: number;
  itemButton: boolean;
}

export interface IOrder extends IUser {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof IUser, string>>;
