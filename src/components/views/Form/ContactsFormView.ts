import { FormView } from "./FormView.ts";
import { IBuyer } from "../../../types";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { eventNames } from "../../../utils/constants.ts";

type TContactsFormViewData = Pick<IBuyer, "email" | "phone">;

export class ContactsFormView extends FormView<TContactsFormViewData> {
  protected readonly emailInputElem: HTMLInputElement;
  protected readonly phoneInputElem: HTMLInputElement;

  constructor(
    protected readonly container: HTMLFormElement,
    protected readonly events: IEvents
  ) {
    super(container);

    this.emailInputElem = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInputElem = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInputElem.addEventListener("input", () => {
      this.events.emit<Pick<IBuyer, "email">>(
        eventNames.CONTACTS_FORM_SET_EMAIL,
        {
          email: this.emailInputElem.value,
        }
      );
    });

    this.phoneInputElem.addEventListener("input", () => {
      this.events.emit<Pick<IBuyer, "phone">>(
        eventNames.CONTACTS_FORM_SET_PHONE,
        {
          phone: this.phoneInputElem.value,
        }
      );
    });

    this.container.addEventListener("submit", (evt: SubmitEvent) => {
      evt.preventDefault();
      this.events.emit(eventNames.CONTACTS_FORM_SUBMIT);
    });
  }

  set email(email: string) {
    this.emailInputElem.value = email;
  }

  set phone(phone: string) {
    this.phoneInputElem.value = phone;
  }
}
