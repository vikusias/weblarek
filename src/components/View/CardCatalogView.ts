import { CardView } from "./CardView";
import { IProduct, ICardActions } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardCatalogView extends CardView<IProduct> {
  private categoryElement: HTMLElement | null = null;
  private imageElement: HTMLImageElement | null = null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // Находим элементы, специфичные для карточки каталога
    this.categoryElement = this.container.querySelector(".card__category");
    this.imageElement = this.container.querySelector(".card__image");

    // Обработка клика по карточке
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  // Установка категории (только для каталога)
  set category(value: string) {
    if (this.categoryElement) {
      this.setText(this.categoryElement, value);

      // Устанавливаем класс для цвета категории
      const categoryKey = value as keyof typeof categoryMap;
      const className = categoryMap[categoryKey] || "card__category_other";
      this.categoryElement.className = `card__category ${className}`;
    }
  }

  // Установка изображения (только для каталога)
  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, "Изображение товара");
    }
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);

    if (data.category && this.categoryElement) {
      this.category = data.category;
    }

    if (data.image && this.imageElement) {
      this.image = data.image;
    }

    return this.container;
  }
}
