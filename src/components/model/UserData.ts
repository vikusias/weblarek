import { FormErrors,  IUser } from "../../types";
import { IEvents } from "../base/events";

export class UserData {
  public order!: IUser; // Используем ! для утверждения, что свойство будет инициализировано
  private formErrors: FormErrors = {};
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.resetOrder();
  }

  /**
   * Сбросить заказ до начальных значений
   */
  clearOrder(): void {
    this.resetOrder();
  }

  /**
   * Устанавливает значение поля заказа по ключу
   * @param field Ключ поля заказа
   * @param value Значение поля
   */
  setOrderField<K extends keyof IUser>(field: K, value: IUser[K]): void {
    this.order[field] = value;
    this.events.emit("order:change");

    if (this.isOrderValid()) {
      this.events.emit("order:ready", this.order);
    }
  }

  /**
   * Проверяет валидность заказа
   * @returns true, если заказ валиден
   */
  isOrderValid(): boolean {
    const errors: FormErrors = {};

    if (!this.order.email || !this.isValidEmail(this.order.email)) {
      errors.email = "Необходимо указать корректный email";
    }

    if (!this.order.phone) {
      errors.phone = "Необходимо указать телефон";
    }

    if (!this.order.address) {
      errors.address = "Необходимо указать адрес";
    }

    if (this.order.payment === null || this.order.payment === "") {
      errors.payment = "Необходимо выбрать способ оплаты";
    }

    this.formErrors = errors;
    this.events.emit("formErrors:change", this.formErrors);

    return Object.keys(errors).length === 0;
  }

  /**
   * Получает текущие ошибки формы
   * @returns Объект ошибок
   */
  getFormErrors(): FormErrors {
    return { ...this.formErrors };
  }

  /**
   * Валидация email
   * @param email Строка email
   * @returns true, если email валиден
   */
  private isValidEmail(email?: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? emailRegex.test(email) : false;
  }

  /**
   * Внутренний метод сброса заказа
   */
  private resetOrder(): void {
    this.order = {
      address: "",
      phone: "",
      payment: null,
      email: "",
    };
  }
}
