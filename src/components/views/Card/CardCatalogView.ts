import { IProduct, TCategoryNames } from "../../../types";
import { CardView } from "./CardView.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { CDN_URL } from "../../../utils/constants.ts";

type TCardCatalogViewData = Pick<IProduct, "image" | "category">;
type TCardCatalogViewActions = {
  onClick?: () => void;
};

export class CardCatalogView extends CardView<TCardCatalogViewData> {
  protected readonly categoryElem: HTMLElement;
  protected readonly imageElem: HTMLImageElement;

  constructor(
    protected readonly container: HTMLElement,
    protected readonly actions?: TCardCatalogViewActions
  ) {
    super(container);

    this.categoryElem = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElem = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    if (this.actions?.onClick) {
      this.container.addEventListener("click", this.actions.onClick);
    }
  }

  set category(category: TCategoryNames) {
    const categoryClassModifier =
      CardView.getCategoryClassByCategoryName(category);

    this.categoryElem.textContent = category;
    this.categoryElem.className = `card__category ${categoryClassModifier}`;
  }

  set image(imageSrc: string) {
    this.setImage(this.imageElem, CDN_URL + imageSrc);
  }
}
