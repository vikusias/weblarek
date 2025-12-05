import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureAllElements, ensureElement } from "../../utils/utils";

// Интерфейс, описывающий общие свойства формы
export interface IForm {
  isValid: boolean;
  errors: string[];
}

// Интерфейс данных формы заказа
export interface IOrderForm {
  payment: string;
  address: string;
}

// Интерфейс данных формы контактов
export interface IContactsForm {
  phone: string;
  email: string;
}

// Базовый класс формы, универсальный для любых данных T
export class Form<T> extends Component<IForm> {
  protected buttonSubmit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.buttonSubmit = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container
    );
    this._errors = ensureElement(".form__errors", this.container);

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  // Установка валидности формы (включение/выключение кнопки)
  set isValid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  // Установка ошибок, отображаемых в блоке
  set errors(value: string) {
    this._errors.textContent = value;
  }

  // Метод рендеринга, обновляет состояние формы
  render(state: Partial<T> & IForm) {
    const { isValid, errors, ...inputs } = state;
    super.render({ isValid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}

// Класс формы заказа
export class FormOrder extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = Array.from(
      ensureAllElements(".button_alt", this.container)
    );
    this._buttons.forEach((button) => {
      button.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLButtonElement;
        const name = target.name as keyof IOrderForm;
        const field = "payment" as keyof IOrderForm;
        this.onInputChange(field, name);
      });
    });
  }

  // Установка выбранного способа оплаты
  set payment(name: string) {
    this._buttons.forEach((button) => {
      this.toggleClass(button, "button_alt-active", button.name === name);
    });
  }

  // Установка адреса
  set address(value: string) {
    (this.container.elements.namedItem("address") as HTMLInputElement).value =
      value;
  }
}

// Класс формы контактов
export class FormContacts extends Form<IContactsForm> {
  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  // Установка номера телефона
  set phone(value: string) {
    (this.container.elements.namedItem("phone") as HTMLInputElement).value =
      value;
  }

  // Установка email
  set email(value: string) {
    (this.container.elements.namedItem("email") as HTMLInputElement).value =
      value;
  }
}
