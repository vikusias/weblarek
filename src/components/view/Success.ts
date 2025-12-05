import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  private closeButton: HTMLElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement, private actions?: ISuccessActions) {
    super(container);
    // Инициализация элементов с помощью утилиты
    this.closeButton = ensureElement(".order-success__close", this.container);
    this.descriptionElement = ensureElement(
      ".order-success__description",
      this.container
    );
    // Назначение обработчика события
    this.closeButton.addEventListener("click", () => {
      if (this.actions?.onClick) {
        this.actions.onClick();
      }
    });
  }

  // Приватное поле для хранения значения
  private _total: number = 0;

  // Геттер для свойства total
  get total(): number {
    return this._total;
  }

  // Сеттер для свойства total, обновляет текстовое содержимое элемента
  set total(value: number) {
    this._total = value;
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
