import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketData {
  items: HTMLElement[];
  total: number;
  canCheckout: boolean;
}

export class BasketView extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.listElement = this.container.querySelector(".basket__list")!;
    this.totalElement = this.container.querySelector(".basket__price")!;
    this.buttonElement = this.container.querySelector(".basket__button")!;

    // Обработка клика на кнопку оформления заказа
    this.buttonElement.addEventListener("click", () => {
      events.emit("order:start");
    });
  }

  // Сеттер для элементов товаров
  set items(items: HTMLElement[]) {
    this.listElement.innerHTML = "";

    if (items.length > 0) {
      this.listElement.append(...items);
    }
    // Если товаров нет, просто оставляем список пустым
  }

  // Сеттер для общей суммы
  set total(value: number) {
    this.setText(this.totalElement, `${value} синапсов`);
  }

  // Сеттер для кнопки оформления
  set canCheckout(value: boolean) {
    this.setDisabled(this.buttonElement, !value);
  }
}
  // Установка общей суммы
  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }
  // Разблокировка/блокировка кнопки оформления заказа
  set canCheckout(value: boolean) {
    this.setDisabled(this._button, !value);
  }
  // Обновление данных корзины
  render(data: Partial<IBasketData>): HTMLElement {
    if (data.items) {
      this.items = data.items;
    }

    if (data.total !== undefined) {
      this.total = data.total;
    }

    if (data.canCheckout !== undefined) {
      this.canCheckout = data.canCheckout;
    }

    return this.element;
  }
}
