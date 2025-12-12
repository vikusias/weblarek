import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class FormView<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.submitButton = this.container.querySelector('button[type="submit"]')!;
    this.errorsElement = this.container.querySelector(".form__errors")!;

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  protected abstract handleSubmit(): void;

  set valid(value: boolean) {
    this.setDisabled(this.submitButton, !value);
  }

  set errors(value: string[]) {
    const text = value.join(", ");
    this.setText(this.errorsElement, text);
  }
}
