import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ModalView extends Component<{ content: HTMLElement }> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  private _isOpen: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Используем this.container для поиска элементов
    this.closeButton = this.container.querySelector(".modal__close")!;
    this.contentElement = this.container.querySelector(".modal__content")!;

    this.closeButton.addEventListener("click", () => this.close());

    this.container.addEventListener("click", (e: MouseEvent) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  set content(value: HTMLElement) {
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(value);
  }

  open(): void {
    this._isOpen = true;
    this.container.classList.add("modal_active");
    document.body.classList.add("modal-open");
  }

  close(): void {
    this._isOpen = false;
    this.container.classList.remove("modal_active");
    document.body.classList.remove("modal-open");
    this.events.emit("modal:close");
  }
}

