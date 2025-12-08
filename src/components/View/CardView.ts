import { Component } from "../base/Component";
import { IProduct, TCategoryNames } from "../../types";
import { categoryMap } from "../../utils/constants";

// Тип ключа категории
export type CategoryKey = keyof typeof categoryMap;

// Абстрактный класс карточки товара
export abstract class CardView<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement | null = null;
  protected _image: HTMLImageElement | null = null;
  protected _button: HTMLButtonElement | null = null;

  constructor(container: HTMLElement) {
    super(container);
    // Находим элементы внутри карточки
    this._title = this.element.querySelector(".card__title")!;
    this._price = this.element.querySelector(".card__price")!;
    this._category = this.element.querySelector(".card__category");
    this._image = this.element.querySelector(".card__image");
    this._button = this.element.querySelector(".button");
  }
  // Установка заголовка
  set title(value: string) {
    this.setText(this._title, value);
  }

  // Установка цены
  set price(value: number | null) {
    if (value === null || value === undefined) {
      this.setText(this._price, "Бесценно");
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  // Установка категории
  set category(value: TCategoryNames) {
    if (this._category) {
      this.setText(this._category, value);
      this._category.className =
        "card__category " + (categoryMap[value] || "card__category_other");
    }
  }
  // Установка изображения
  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, "Изображение товара");
    }
  }
  // Установка текста кнопки
  set buttonText(value: string) {
    if (this._button) {
      this.setText(this._button, value);
    }
  }
  // Отключение/включение кнопки
  set buttonDisabled(value: boolean) {
    if (this._button) {
      this.setDisabled(this._button, value);
    }
  }
}

// Экспорт типа IProduct
export type { IProduct };
