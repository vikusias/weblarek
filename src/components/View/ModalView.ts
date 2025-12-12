import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ModalView extends Component<{ content: HTMLElement }> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

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

  set content(value: HTMLElement) {
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }
}
