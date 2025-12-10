import { FormView } from "./FormView";
import { IEvents } from "../base/Events";
import { IBuyer, TPayment } from "../../types";

// Интерфейс данных формы заказа
interface IOrderFormData extends Partial<IBuyer> {
  valid: boolean; // валидность формы
  errors: string[]; // массив ошибок
}

export class OrderFormView extends FormView<IOrderFormData> {
  protected paymentButtons: NodeListOf<HTMLButtonElement>;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = this.container.querySelectorAll(".button_alt");
    this.addressInput = this.container.querySelector('input[name="address"]')!;

    // Обработка выбора оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Только эмитим событие, НЕ изменяем классы здесь
        events.emit("order.payment:change", {
          payment: button.name as TPayment,
        });
      });
    });

    // Обработка ввода адреса
    this.addressInput.addEventListener("input", () => {
      events.emit("order.address:change", {
        address: this.addressInput.value,
      });
    });
  }

  protected handleSubmit(): void {
    this.events.emit("order:submit", {
      address: this.addressInput.value,
    });
  }

  // Сеттеры для обновления формы из презентера
  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      // Используем метод toggleClass из родительского класса
      this.toggleClass(button, "button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  render(data: Partial<IOrderFormData>): HTMLElement {
    super.render(data);

    if (data.payment) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.valid !== undefined) {
      this.valid = data.valid;
    }

    if (data.errors) {
      this.errors = data.errors;
    }

    return this.container;
  }
}
