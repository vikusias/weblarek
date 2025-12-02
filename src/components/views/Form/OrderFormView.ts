import { FormView } from "./FormView.ts";
import { IBuyer, TPayment } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { eventNames } from "../../../utils/constants.ts";

type TOrderFormViewData = Pick<IBuyer, "payment" | "address">;

export class OrderFormView extends FormView<TOrderFormViewData> {
  protected readonly paymentBtnElems: HTMLButtonElement[];
  protected readonly addressInputElem: HTMLInputElement;

  constructor(
    protected readonly container: HTMLFormElement,
    protected readonly events: IEvents
  ) {
    super(container);

    this.paymentBtnElems = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      this.container
    );
    this.addressInputElem = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.paymentBtnElems.forEach((btnElem: HTMLButtonElement) => {
      btnElem.addEventListener("click", (evt) => {
        const target = evt.target as HTMLButtonElement;
        const payment = target.name as TPayment;

        this.events.emit<Pick<IBuyer, "payment">>(
          eventNames.ORDER_FORM_SET_PAYMENT,
          {
            payment,
          }
        );
      });
    });

    this.addressInputElem.addEventListener("input", () => {
      this.events.emit<Pick<IBuyer, "address">>(
        eventNames.ORDER_FORM_SET_ADDRESS,
        {
          address: this.addressInputElem.value,
        }
      );
    });

    this.container.addEventListener("submit", (evt: SubmitEvent) => {
      evt.preventDefault();
      this.events.emit(eventNames.ORDER_FORM_SUBMIT);
    });
  }

  set payment(payment: TPayment) {
    this.paymentBtnElems.forEach((btnElem: HTMLButtonElement) => {
      const btnName = btnElem.name as TPayment;
      btnElem.classList.toggle("button_alt-active", btnName === payment);
    });
  }

  set address(address: string) {
    this.addressInputElem.value = address;
  }
}
