/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  // Метод для получения DOM-элемента (не данных!)
  getDOMElement(): HTMLElement {
    return this.container;
  }

  protected setImage(
    element: HTMLImageElement,
    src: string,
    alt?: string
  ): void {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  protected setText(element: HTMLElement, text: string | number): void {
    if (element) {
      element.textContent = String(text);
    }
  }

  protected setDisabled(element: HTMLElement, state: boolean): void {
    if (element) {
      if (state) {
        element.setAttribute("disabled", "disabled");
      } else {
        element.removeAttribute("disabled");
      }
    }
  }

  protected toggleClass(
    element: HTMLElement,
    className: string,
    state?: boolean
  ): void {
    if (state === undefined) {
      element.classList.toggle(className);
    } else {
      element.classList.toggle(className, state);
    }
  }

  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}
