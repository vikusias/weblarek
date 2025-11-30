import { Component } from "../../base/Component.ts";
import { IProduct, TCategoryNames } from "../../../types";
import { ensureElement } from "../../../utils/utils.ts";
import { categoryMap } from "../../../utils/constants.ts";

type TCardViewData = Pick<IProduct, "title" | "price">;

export class CardView<T> extends Component<TCardViewData & T> {
  protected readonly titleElem: HTMLElement;
  protected readonly priceElem: HTMLElement;

  constructor(protected readonly container: HTMLElement) {
    super(container);

    this.titleElem = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceElem = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(title: string) {
    this.titleElem.textContent = title;
  }

  set price(price: number | null) {
    this.priceElem.textContent = price ? `${price} синапсов` : "Бесценно";
  }

  /**
   * Возвращает модификатор класса по названию категории
   * @param categoryName - название категории: 'софт-скил' | * 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое'
   */
  static getCategoryClassByCategoryName(categoryName: TCategoryNames): string {
    return categoryMap[categoryName];
  }
}
