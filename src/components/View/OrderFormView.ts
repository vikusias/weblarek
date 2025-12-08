import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBuyer, TPayment } from "../../types";

// Интерфейс данных формы заказа
interface IOrderFormData extends Partial<IBuyer> {
  valid: boolean; // валидность формы
  errors: string[]; // массив ошибок
}

// Вью формы заказа
export class OrderFormView extends Component<IOrderFormData> {
  protected _buttons: HTMLButtonElement[]; // кнопки выбора оплаты
  protected _address: HTMLInputElement; // поле адреса
  protected _submit: HTMLButtonElement; // кнопка отправки
  protected _errors: HTMLElement; // область ошибок

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._buttons = Array.from(this.element.querySelectorAll(".button_alt"));
    this._address = this.element.querySelector('input[name="address"]')!;
    this._submit = this.element.querySelector('button[type="submit"]')!;
    this._errors = this.element.querySelector(".form__errors")!;

    // Обработка выбора способа оплаты
    this._buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this._buttons.forEach((btn) =>
          btn.classList.remove("button_alt-active")
        );
        button.classList.add("button_alt-active");

        events.emit("order.payment:change", {
          payment: button.name as TPayment,
        });
        this.validateForm(); // Валидация формы
      });
    });

    // Обработка ввода адреса
    this._address.addEventListener("input", () => {
      events.emit("order.address:change", {
        address: this._address.value,
      });
      this.validateForm();
    });

    // Обработка отправки формы
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      const payment = this._buttons.find((btn) =>
        btn.classList.contains("button_alt-active")
      )?.name as TPayment;

      if (payment && this._address.value.trim()) {
        events.emit("order:submit", {
          payment,
          address: this._address.value,
        });
      }
    });
  }

  set payment(value: TPayment) {
    this._buttons.forEach((button) => {
      if (button.name === value) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
    this.validateForm();
  }

  set address(value: string) {
    this._address.value = value;
    this.validateForm();
  }

  set valid(value: boolean) {
    this.setDisabled(this._submit, !value);
  }

  set errors(value: string[]) {
    const errorText = value.length > 0 ? value.join(", ") : "";
    this.setText(this._errors, errorText);
    this._errors.style.display = errorText ? "block" : "none";
  }

  private validateForm() {
    const hasPayment = this._buttons.some((btn) =>
      btn.classList.contains("button_alt-active")
    );
    const hasAddress = this._address.value.trim().length > 0;
    this.valid = hasPayment && hasAddress;

    // Показываем подсказки
    if (!hasPayment && this._address.value.trim()) {
      this.errors = ["Выберите способ оплаты"];
    } else if (!hasAddress && hasPayment) {
      this.errors = ["Введите адрес доставки"];
    } else {
      this.errors = [];
    }
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

    this.validateForm();

    return this.element;
  }
}
