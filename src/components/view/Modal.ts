import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IModal {
  content: HTMLElement | null;
}

export class Modal extends Component<IModal> {
  private closeButton: HTMLButtonElement;
  private contentContainer: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    // Инициализация элементов с помощью ensureElement
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.contentContainer = ensureElement(".modal__content", this.container);

    // Назначение обработчиков событий
    this.closeButton.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("click", this.close.bind(this));
    this.contentContainer.addEventListener("click", (event) =>
      event.stopPropagation()
    );
  }

  // Установка содержимого модального окна
  set content(value: HTMLElement | null) {
    if (value) {
      this.contentContainer.replaceChildren(value);
    } else {
      this.contentContainer.innerHTML = ""; // Очищение содержимого
    }
  }

  // Открытие модального окна
  open() {
    this.container.classList.add("modal_active");
    this.events.emit("popup:open");
  }

  // Закрытие модального окна
  close() {
    this.container.classList.remove("modal_active");
    this.events.emit("popup:close");
    this.content = null; // Очистка содержимого при закрытии
  }

  // Метод для рендеринга и автоматического открытия
  render(data: Partial<IModal>): HTMLElement {
    super.render(data);
    if (data.content) {
      this.content = data.content;
    }
    this.open();
    return this.container;
  }
}
