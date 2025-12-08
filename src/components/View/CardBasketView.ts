import { CardView } from "./CardView";
import { IProduct, ICardActions } from "../../types";

// Расширение интерфейса товара для корзины
interface ICardBasket extends IProduct {
  index: number; // индекс позиции в корзине
}

// Вью для карточки товара в корзине
export class CardBasketView extends CardView<ICardBasket> {
  protected _index: HTMLElement; // элемент для отображения индекса
  protected _deleteButton: HTMLButtonElement; // кнопка удаления

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._index = this.element.querySelector(".basket__item-index")!;
    this._deleteButton = this.element.querySelector(".basket__item-delete")!;

    if (actions?.onClick) {
      this._deleteButton.addEventListener("click", actions.onClick);
    }
  }
  // Установка индекса
  set index(value: number) {
    this.setText(this._index, value.toString());
  }
  // Рендеринг
  render(data: Partial<ICardBasket>): HTMLElement {
    super.render(data);

    if (data.index !== undefined) {
      this.index = data.index;
    }

    return this.element;
  }
}
