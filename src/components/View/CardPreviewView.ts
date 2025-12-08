import { CardView } from "./CardView";
import { IProduct, ICardActions } from "../../types";

interface ICardPreview extends IProduct {
  buttonText: string; // Текст кнопки
  canBuy: boolean; // Можно ли купить
  description: string; // Описание
}

// Вью для предпросмотра карточки
export class CardPreviewView extends CardView<ICardPreview> {
  protected _description: HTMLElement; // Элемент описания
  protected _button: HTMLButtonElement; // Кнопка

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._description = this.element.querySelector(".card__text")!;
    this._button = this.element.querySelector(".button")!;

    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  // Установка описания
  set description(value: string) {
    this.setText(this._description, value);
  }

  // Установка возможности покупки
  set canBuy(value: boolean) {
    this.buttonDisabled = !value;
  }

  // Метод рендеринга
  render(data: Partial<ICardPreview>): HTMLElement {
    super.render(data);

    if (data.description) {
      this.description = data.description;
    }

    if (data.buttonText) {
      this.buttonText = data.buttonText;
    }

    if (data.canBuy !== undefined) {
      this.canBuy = data.canBuy;
    }

    return this.element;
  }
}
