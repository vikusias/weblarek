import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Вью для модального окна
export class ModalView extends Component<{ content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement; // Кнопка закрытия
  protected _content: HTMLElement; // Контейнер для контента
  protected _overlay: HTMLElement; // Оверлей (область за модалкой)

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = this.element.querySelector(".modal__close")!;
    this._content = this.element.querySelector(".modal__content")!;
    this._overlay = this.element;

    // Обработчики событий
    this._closeButton.addEventListener("click", this.close.bind(this));
    this._overlay.addEventListener("click", this.handleOutsideClick.bind(this));
  }

  // Установка содержимого модалки
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  // Показ индикатора загрузки
  showLoading(message: string = "Загрузка...") {
    const loading = document.createElement("div");
    loading.className = "modal__loading";
    loading.innerHTML = `
      <div class="modal__loading-spinner"></div>
      <p class="modal__loading-text">${message}</p>
    `;
    this._content.replaceChildren(loading);
  }

  // Показ ошибки с опцией повтора
  showError(message: string, onRetry?: () => void) {
    const error = document.createElement("div");
    error.className = "modal__error";
    error.innerHTML = `
      <div class="modal__error-icon">⚠️</div>
      <h3 class="modal__error-title">Ошибка</h3>
      <p class="modal__error-message">${message}</p>
      ${
        onRetry
          ? '<button class="button modal__error-retry">Повторить</button>'
          : ""
      }
    `;

    this._content.replaceChildren(error);

    if (onRetry) {
      const retryButton = error.querySelector(".modal__error-retry");
      if (retryButton) {
        retryButton.addEventListener("click", () => {
          onRetry();
          this.showLoading("Повторная попытка...");
        });
      }
    }
  }

  // Открытие модалки
  open() {
    this.element.classList.add("modal_active");
    document.addEventListener("keydown", this.handleEscape.bind(this));
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
  }

  // Закрытие модалки
  close() {
    this.element.classList.remove("modal_active");
    this._content.innerHTML = "";
    document.removeEventListener("keydown", this.handleEscape.bind(this));
    document.body.style.overflow = "auto";
    document.body.classList.remove("modal-open");
    this.events.emit("modal:close");
  }

  // Обработка нажатия Escape для закрытия
  private handleEscape(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  // Обработка клика вне контента для закрытия
  private handleOutsideClick(evt: MouseEvent) {
    if (evt.target === this._overlay) {
      this.close();
    }
  }
}
