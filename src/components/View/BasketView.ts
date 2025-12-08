import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Интерфейс данных корзины
interface IBasketData {
  items: HTMLElement[]; // элементы товаров
  total: number; // сумма
  canCheckout: boolean; // возможность оформить заказ
}

export class BasketView extends Component<IBasketData> {
  protected _list: HTMLElement; // список товаров
  protected _total: HTMLElement; // отображение суммы
  protected _button: HTMLButtonElement; // кнопка оформить заказ

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._list = this.element.querySelector(".basket__list")!;
    this._total = this.element.querySelector(".basket__price")!;
    this._button = this.element.querySelector(".basket__button")!;

    this._button.addEventListener("click", () => {
      events.emit("order:start");
    });
  }
  // Установка элементов товаров
  set items(items: HTMLElement[]) {
    this._list.innerHTML = "";
    if (items.length) {
      this._list.append(...items);
    } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "basket__empty";
      emptyMessage.textContent = "Корзина пуста";
      this._list.appendChild(emptyMessage);
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
