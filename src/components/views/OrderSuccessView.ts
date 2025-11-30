import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";
import { IOrderApiResponse } from "../../types";
import { IEvents } from "../base/Events.ts";
import { eventNames } from "../../utils/constants.ts";

type TOrderSuccessViewData = Pick<IOrderApiResponse, "total">;

export class OrderSuccessView extends Component<TOrderSuccessViewData> {
  protected readonly descriptionElem: HTMLParagraphElement;
  protected readonly closeBtnElem: HTMLButtonElement;

  constructor(
    protected readonly container: HTMLElement,
    protected readonly events: IEvents
  ) {
    super(container);

    this.descriptionElem = ensureElement<HTMLParagraphElement>(
      ".order-success__description",
      this.container
    );
    this.closeBtnElem = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.closeBtnElem.addEventListener("click", () => {
      this.events.emit(eventNames.ORDER_SUCCESS_CLICK_CLOSE);
    });
  }

  set total(total: number) {
    this.descriptionElem.textContent = `Списано ${total} синапсов`;
  }
}
