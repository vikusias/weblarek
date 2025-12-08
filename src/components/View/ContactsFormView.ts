import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBuyer } from "../../types";
import { validateEmail, validatePhone } from "../../utils/utils";

interface IContactsFormData extends Partial<IBuyer> {
  valid: boolean;
  errors: string[];
}

export class ContactsFormView extends Component<IContactsFormData> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  private _emailTimeout: number | null = null;
  private _phoneTimeout: number | null = null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._email = this.element.querySelector('input[name="email"]')!;
    this._phone = this.element.querySelector('input[name="phone"]')!;
    this._submit = this.element.querySelector('button[type="submit"]')!;
    this._errors = this.element.querySelector(".form__errors")!;

    // Обработка ввода данных с debounce
    this._email.addEventListener("input", () => {
      if (this._emailTimeout) clearTimeout(this._emailTimeout);

      this._emailTimeout = window.setTimeout(() => {
        events.emit("contacts.email:change", {
          email: this._email.value,
        });
        this.validateForm();
      }, 300);
    });

    this._phone.addEventListener("input", () => {
      if (this._phoneTimeout) clearTimeout(this._phoneTimeout);

      this._phoneTimeout = window.setTimeout(() => {
        events.emit("contacts.phone:change", {
          phone: this._phone.value,
        });
        this.validateForm();
      }, 300);
    });

    // Форматирование телефона
    this._phone.addEventListener("keydown", (e) => {
      this.formatPhoneInput(e);
    });

    // Обработка отправки формы
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this._email.value.trim() && this._phone.value.trim()) {
        events.emit("contacts:submit", {
          email: this._email.value,
          phone: this._phone.value,
        });
      }
    });
  }

  set email(value: string) {
    this._email.value = value;
    this.validateForm();
  }

  set phone(value: string) {
    this._phone.value = value;
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
    const email = this._email.value.trim();
    const phone = this._phone.value.trim();
    const errors: string[] = [];

    if (!email && !phone) {
      errors.push("Заполните все поля");
    } else {
      if (!email) errors.push("Введите email");
      else if (!validateEmail(email)) errors.push("Неверный формат email");

      if (!phone) errors.push("Введите телефон");
      else if (!validatePhone(phone)) errors.push("Неверный формат телефона");
    }

    this.valid = errors.length === 0;
    this.errors = errors;
  }

  private formatPhoneInput(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, "");

    if (value.length <= 3) {
      input.value = value;
    } else if (value.length <= 6) {
      input.value = `+7 (${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length <= 8) {
      input.value = `+7 (${value.slice(0, 3)}) ${value.slice(
        3,
        6
      )}-${value.slice(6, 8)}`;
    } else {
      input.value = `+7 (${value.slice(0, 3)}) ${value.slice(
        3,
        6
      )}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
    }
  }

  render(data: Partial<IContactsFormData>): HTMLElement {
    super.render(data);

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
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
