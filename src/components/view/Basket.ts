import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IBasket {
  items: HTMLElement[];
  fullPrice: number;
}

export class Basket extends Component<IBasket> {
  private basketList: HTMLUListElement;
  private basketButton: HTMLButtonElement;
  private basketPrice: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.basketPrice = ensureElement(".basket__price", this.container);

    // Обработка события клика по кнопке "Продолжить" или "Перейти к оформлению"
    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:continue");
    });

    // Инициализация пустого массива товаров
    this._items = [];
  }

  private _items: HTMLElement[] = [];

  // Геттер для items
  get items(): HTMLElement[] {
    return this._items;
  }

  // Сеттер для items, обновляет список в DOM и состояние кнопки
  set items(items: HTMLElement[]) {
    this._items = items;

    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.basketButton.disabled = false;
    } else {
      this.basketList.replaceChildren(
        createElement<HTMLParagraphElement>("p", {
          textContent: "Корзина пуста",
        })
      );
      this.basketButton.disabled = true;
    }
  }

  // Установка общей стоимости и управление состоянием кнопки
  set fullPrice(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
    this.basketButton.disabled = value === 0;
  }
}
