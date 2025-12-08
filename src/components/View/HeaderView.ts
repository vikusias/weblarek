import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Интерфейс данных для шапки
interface IHeaderData {
  count: number; // Количество товаров в корзине
}
// Вью для шапки сайта
export class HeaderView extends Component<IHeaderData> {
  protected _counter: HTMLElement; // Элемент для отображения количества
  protected _basket: HTMLButtonElement; // Кнопка корзины

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._counter = this.element.querySelector(".header__basket-counter")!;
    this._basket = this.element.querySelector(".header__basket")!;

    this._basket.addEventListener("click", () => {
      events.emit("basket:open"); // Эмиттинг события открытия корзины
    });
  }

  // Обновление количества товаров
  set count(value: number) {
    this.setText(this._counter, value.toString());
  }
}
