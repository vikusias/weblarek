import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Интерфейс для данных о заказе (общая сумма)
interface IOrderSuccessData {
  total: number;
}

export class OrderSuccessView extends Component<IOrderSuccessData> {
  protected _description: HTMLElement; // Элемент для отображения суммы
  protected _closeButton: HTMLButtonElement; // Кнопка закрытия окна

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    // Находим элементы в DOM
    this._description = this.element.querySelector(
      ".order-success__description"
    )!;
    this._closeButton = this.element.querySelector(".order-success__close")!;

    // Обработка клика по кнопке закрытия
    this._closeButton.addEventListener("click", () => {
      events.emit("order:success");
    });
  }

  // Установка текста суммы
  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }
}
