import { CardView } from "./CardView";
import { IProduct, ICardActions } from "../../types";

// Расширяем интерфейс для корзины
interface ICardBasketData extends Partial<IProduct> {
  index?: number;
}

export class CardBasketView extends CardView<ICardBasketData> {
  private indexElement: HTMLElement | null = null;
  private deleteButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // Находим элементы, специфичные для карточки в корзине
    this.indexElement = this.container.querySelector(".basket__item-index");
    this.deleteButton = this.container.querySelector(".basket__item-delete");

    // Обработка клика по кнопке удаления
    if (actions?.onClick && this.deleteButton) {
      this.deleteButton.addEventListener("click", actions.onClick);
    }
  }

  // Специфичные для корзины свойства
  set index(value: number) {
    if (this.indexElement) {
      this.setText(this.indexElement, String(value));
    }
  }
}
