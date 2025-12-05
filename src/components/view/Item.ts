import { IItemView } from "../../types";
import { ensureElement, isEmpty } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

// Интерфейс IAction определяет структуру объекта действия с обязательным методом
export interface IAction {
  // Метод, вызываемый при клике, принимает MouseEvent
  onClick: (event: MouseEvent) => void;
}

// Класс Item — базовый компонент
export class Item extends Component<IItemView> {
  private itemTitle: HTMLElement;
  private itemPrice: HTMLElement;

  // Конструктор принимает контейнер, события и действие (обработчик клика)
  constructor(
    protected container: HTMLElement,
    protected events: IEvents,
    protected action?: IAction
  ) {
    super(container);
    this.itemTitle = ensureElement(".card__title", this.container);
    this.itemPrice = ensureElement(".card__price", this.container);

    // Назначение обработчика, если он есть
    if (this.action?.onClick) {
      this.container.addEventListener("click", this.action.onClick);
    }
  }

  // Цена отображает "Бесценно" если значение пустое, иначе — цену с "синапсами"
  set price(value: number | null) {
    if (isEmpty(value)) {
      this.itemPrice.textContent = `Бесценно`;
    } else {
      this.itemPrice.textContent = `${value} синапсов`;
    }
  }

  // ID, сохраняет его в data-атрибут контейнера
  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.itemTitle.textContent = value;
  }
}

// Класс ItemElement расширяет Item, добавляя изображение, категорию и кнопку
export class ItemElement extends Item {
  private itemImage: HTMLImageElement; // Изображение товара
  private itemCategory: HTMLElement; // Категория товара
  private button: HTMLButtonElement; // Кнопка (например, "Купить")

  // Объект для хранения CSS-классов по категориям
  private itemCategoryColor: Record<string, string> = {
    другое: "card__category_other",
    "софт-скил": "card__category_soft",
    дополнительное: "card__category_additional",
    кнопка: "card__category_button",
    "хард-скил": "card__category_hard",
  };

  constructor(container: HTMLElement, events: IEvents, action?: IAction) {
    super(container, events, action);
    this.itemImage = ensureElement(
      ".card__image",
      this.container
    ) as HTMLImageElement;
    this.itemCategory = ensureElement(".card__category", this.container);
    this.button = container.querySelector(".card") as HTMLButtonElement;

    // Добавление обработчика, если есть
    if (this.action?.onClick) {
      if (this.button) {
        this.button.addEventListener("click", this.action.onClick);
      } else {
        this.container.addEventListener("click", this.action.onClick);
      }
    }
  }
  // Установка изображения и альтернативного текста
  set image(value: string) {
    this.itemImage.src = value;
    this.itemImage.alt = this.title;
  }
  // Установка категории
  set category(value: string) {
    // Удаляем предыдущие классы категории
    Object.values(this.itemCategoryColor).forEach((className) => {
      this.itemCategory.classList.remove(className);
    });
    this.itemCategory.textContent = value;
    const className = this.itemCategoryColor[value];
    if (className) {
      this.itemCategory.classList.add(className);
    }
  }
}

// Класс ItemPreview расширяет ItemElement, добавляя описание и кнопку
export class ItemPreview extends ItemElement {
  private itemDescription: HTMLElement;
  private _itemButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, action?: IAction) {
    super(container, events, action);
    this.itemDescription = ensureElement(".card__text", this.container);
    this._itemButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    // Назначаем обработчик клика на кнопку
    this._itemButton.addEventListener("click", (event: MouseEvent) => {
      if (this.action?.onClick) {
        this.action.onClick(event);
      }
    });
  }

  // Установка текста на кнопке
  set itemButton(value: boolean) {
    if (value) {
      this._itemButton.textContent = "Убрать";
    } else {
      this._itemButton.textContent = "Купить";
    }
  }
  // Установка описания
  set description(value: string) {
    this.itemDescription.textContent = value;
  }
}

// Класс BasketItem — элемент корзины с индексом и кнопкой удаления
export class BasketItem extends Item {
  private _index: HTMLElement;
  private buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, action?: IAction) {
    super(container, events, action);
    this._index = ensureElement(".basket__item-index", this.container);
    this.buttonDelete = ensureElement(
      ".basket__item-delete",
      this.container
    ) as HTMLButtonElement;

    // Назначаем обработчик клика по кнопке удаления
    if (this.action?.onClick) {
      this.buttonDelete.addEventListener("click", this.action.onClick);
    }
  }

  // Установка текста индекса
  set index(value: string) {
    this._index.textContent = value;
  }
}
