import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";
import { IEvents } from "../base/Events.ts";
import { eventNames } from "../../utils/constants.ts";

export interface IHeaderViewData {
  count: number;
}

export class HeaderView extends Component<IHeaderViewData> {
  protected readonly htmlButtonElement: HTMLButtonElement;
  protected readonly basketCounterElement: HTMLElement;

  constructor(
    protected readonly container: HTMLElement,
    protected readonly events: IEvents
  ) {
    super(container);

    this.htmlButtonElement = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.basketCounterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    this.htmlButtonElement.addEventListener("click", () => {
      this.events.emit(eventNames.BASKET_OPEN);
    });
  }

  set count(value: number) {
    this.basketCounterElement.textContent = String(value);
  }
}
