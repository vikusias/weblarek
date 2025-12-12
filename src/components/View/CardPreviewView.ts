import { CardView } from "./CardView";
import { IProduct, ICardActions } from "../../types";
import { categoryMap } from "../../utils/constants";

// Расширяем интерфейс для превью
interface ICardPreviewData extends Partial<IProduct> {
  description?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
}

export class CardPreviewView extends CardView<ICardPreviewData> {
  private categoryElement: HTMLElement | null = null;
  private imageElement: HTMLImageElement | null = null;
  private descriptionElement: HTMLElement | null = null;
  private buttonElement: HTMLButtonElement | null = null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // Находим элементы, специфичные для превью
    this.categoryElement = this.container.querySelector(".card__category");
    this.imageElement = this.container.querySelector(".card__image");
    this.descriptionElement = this.container.querySelector(".card__text");
    this.buttonElement = this.container.querySelector(".card__button");

    // Обработка клика по кнопке
    if (actions?.onClick && this.buttonElement) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  // Специфичные для превью свойства
  set category(value: string) {
    if (this.categoryElement) {
      this.setText(this.categoryElement, value);

      const categoryKey = value as keyof typeof categoryMap;
      const className = categoryMap[categoryKey] || "card__category_other";
      this.categoryElement.className = `card__category ${className}`;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, "Изображение товара");
    }
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.setText(this.descriptionElement, value);
    }
  }

  set buttonText(value: string) {
    if (this.buttonElement) {
      this.setText(this.buttonElement, value);
    }
  }

  set buttonDisabled(value: boolean) {
    if (this.buttonElement) {
      this.setDisabled(this.buttonElement, value);
    }
  }
}
