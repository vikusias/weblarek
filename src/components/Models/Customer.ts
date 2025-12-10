import { IEvents } from "../base/Events";
import { IBuyer, TBuyerValidityMessages, TPayment } from "../../types";
import { validateEmail, validatePhone } from "../../utils/utils";

export interface ICustomer {
  setPayment(payment: TPayment): void;
  setAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  clear(): void;
  getData(): IBuyer;
  checkValidity(): TBuyerValidityMessages;
}

export class Customer implements ICustomer {
  private payment: TPayment = "";
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(private events: IEvents) {}

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("customer:changed");
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("customer:changed");
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("customer:changed");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("customer:changed");
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  checkValidity(): TBuyerValidityMessages {
    const errors: TBuyerValidityMessages = {};

    if (!this.payment) {
      errors.payment = "Выберите способ оплаты";
    }

    if (!this.address.trim()) {
      errors.address = "Необходимо указать адрес";
    }

    if (!this.phone.trim()) {
      errors.phone = "Необходимо указать номер телефона";
    } else if (!validatePhone(this.phone)) {
      errors.phone = "Неверный формат телефона";
    }

    if (!this.email.trim()) {
      errors.email = "Необходимо указать email";
    } else if (!validateEmail(this.email)) {
      errors.email = "Неверный формат email";
    }

    return errors;
  }

  clear(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit("customer:changed");
  }
}
