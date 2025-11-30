import { Component } from "../../base/Component.ts";
import { ensureElement } from "../../../utils/utils.ts";

type TFormViewData = {
  error: string;
};

export class FormView<T> extends Component<T & TFormViewData> {
  protected readonly submitBtnElem: HTMLButtonElement;
  protected readonly errorsElem: HTMLElement;

  constructor(protected readonly container: HTMLFormElement) {
    super(container);

    this.submitBtnElem = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container
    );
    this.errorsElem = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
  }

  set error(error: string) {
    this.submitBtnElem.disabled = !!error;
    this.errorsElem.textContent = error;
  }
}
