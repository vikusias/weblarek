import { FormView } from "./FormView";
import { IEvents } from "../base/Events";
import { IBuyer } from "../../types";

interface IContactsFormData extends Partial<IBuyer> {
  valid: boolean;
  errors: string[];
}

export class ContactsFormView extends FormView<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = this.container.querySelector('input[name="email"]')!;
    this.phoneInput = this.container.querySelector('input[name="phone"]')!;

    // Обработка ввода данных
    this.emailInput.addEventListener("input", () => {
      events.emit("contacts.email:change", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      events.emit("contacts.phone:change", {
        phone: this.phoneInput.value,
      });
    });
  }

  protected handleSubmit(): void {
    this.events.emit("contacts:submit", {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    });
  }

  // Сеттеры для обновления формы из презентера
  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
