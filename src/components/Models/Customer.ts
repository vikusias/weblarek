import { IBuyer, TBuyerValidityMessages, TPayment } from "../../types";

export class Customer {
  private payment: TPayment = "";

  private address: string = "";

  private phone: string = "";

  private email: string = "";

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,

      address: this.address,

      phone: this.phone,

      email: this.email,
    };
  }

  clear(): void {
    this.payment = "";

    this.address = "";

    this.phone = "";

    this.email = "";
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
    }

    if (!this.email.trim()) {
      errors.email = "Необходимо указать email";
    }

    return errors;
  }
}
