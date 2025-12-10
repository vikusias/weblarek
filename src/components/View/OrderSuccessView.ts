import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Интерфейс для данных о заказе (общая сумма)
interface IOrderSuccessData {
  total: number;
}

export class OrderSuccessView extends Component<IOrderSuccessData> {
  protected description: HTMLElement; // Элемент для отображения суммы
  protected closeButton: HTMLButtonElement; // Кнопка закрытия окна

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    // Находим элементы в DOM
    this.description = this.container.querySelector(
      ".order-success__description"
    )!;
    this.closeButton = this.container.querySelector(".order-success__close")!;

    // Обработка клика по кнопке закрытия
    this.closeButton.addEventListener("click", () => {
      events.emit("order:success");
    });
  }

  // Установка текста суммы
  set total(value: number) {
    this.setText(this.description, `Списано ${value} синапсов`);
  }
}
