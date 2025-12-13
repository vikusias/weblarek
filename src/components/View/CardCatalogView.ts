import { CardView } from "./CardView";

import { IProduct, ICardActions } from "../../types";

import { categoryMap } from "../../utils/constants";

// Расширяем интерфейс для каталога

interface ICardCatalogData extends Partial<IProduct> {
  image?: string;
}

export class CardCatalogView extends CardView<ICardCatalogData> {
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
}
