import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Интерфейс данных для шапки
interface IHeaderData {
  count: number; // Количество товаров в корзине
}

// Вью для шапки сайта
export class HeaderView extends Component<IHeaderData> {
  protected counter: HTMLElement;
  protected basket: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.counter = this.container.querySelector(".header__basket-counter")!;
    this.basket = this.container.querySelector(".header__basket")!;

    this.basket.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  // Обновление количества товаров
  set count(value: number) {
    this.setText(this.counter, value.toString());
  }
}
