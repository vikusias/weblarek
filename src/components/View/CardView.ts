import { Component } from "../base/Component";

export abstract class CardView<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Находим только общие элементы, которые есть во всех карточках
    this.titleElement = this.container.querySelector(".card__title")!;
    this.priceElement = this.container.querySelector(".card__price")!;
  }

  // Установка заголовка (общий для всех карточек)
  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  // Установка цены (общий для всех карточек)
  set price(value: number | null) {
    if (value === null) {
      this.setText(this.priceElement, "Бесценно");
    } else {
      this.setText(this.priceElement, `${value} синапсов`);
    }
  }
}
