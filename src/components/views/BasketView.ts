import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";
import { IEvents } from "../base/Events.ts";
import { eventNames } from "../../utils/constants.ts";

type TBasketViewData = {
  items: HTMLElement[];
  total: number;
};

export class BasketView extends Component<TBasketViewData> {
  private listElement: HTMLUListElement;
  private buttonElement: HTMLButtonElement;
  private priceElement: HTMLElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );

    this._initializeEventListeners();
  }

  private _initializeEventListeners() {
    this.buttonElement.addEventListener("click", () => {
      this.events.emit(eventNames.BASKET_CHECKOUT);
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(total: number) {
    if (total === 0) {
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.disabled = false;
    }
    this.priceElement.textContent = `${total} синапсов`;
  }
}
