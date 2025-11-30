import { CardView } from "./CardView.ts";
import { ensureElement } from "../../../utils/utils.ts";

type TCardBasketViewData = {
  index: number;
};
type TActions = {
  onClick?: () => void;
};

export class CardBasketView extends CardView<TCardBasketViewData> {
  protected readonly indexElem: HTMLSpanElement;
  protected readonly btnElem: HTMLButtonElement;

  constructor(
    protected readonly container: HTMLElement,
    protected readonly actions?: TActions
  ) {
    super(container);

    this.indexElem = ensureElement<HTMLSpanElement>(
      ".basket__item-index",
      this.container
    );
    this.btnElem = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    if (this.actions?.onClick) {
      this.btnElem.addEventListener("click", this.actions.onClick);
    }
  }

  set index(index: number) {
    this.indexElem.textContent = String(index);
  }
}
