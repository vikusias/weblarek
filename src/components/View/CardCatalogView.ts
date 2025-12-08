import { CardView } from "./CardView";
import { IProduct, ICardActions } from "../../types";
// Вью карточки каталога
export class CardCatalogView extends CardView<IProduct> {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    const button = this.element as HTMLButtonElement;
    // Обработка клика по карточке
    if (actions?.onClick) {
      button.addEventListener("click", actions.onClick);
    }
  }

  // Установка id карточки
  set id(value: string) {
    this.element.dataset.id = value;
  }
  // Получение id карточки
  get id(): string {
    return this.element.dataset.id || "";
  }
  // Рендеринг карточки
  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);

    if (data.price === null) {
      this.buttonText = "Недоступно";
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }

    return this.element;
  }
}
