/** 

 * Базовый компонент 

 */

export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  get element(): HTMLElement {
    return this.container;
  }

  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  protected setText(element: HTMLElement, text: string | number) {
    if (element) {
      element.textContent = String(text);
    }
  }

  protected setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
      if (state) element.setAttribute("disabled", "disabled");
      else element.removeAttribute("disabled");
    }
  }

  protected setHidden(element: HTMLElement) {
    element.style.display = "none";
  }

  protected setVisible(element: HTMLElement) {
    element.style.removeProperty("display");
  }

  protected isLocked(element: HTMLElement): boolean {
    return element.hasAttribute("disabled");
  }

  protected addClass(element: HTMLElement, className: string) {
    element.classList.add(className);
  }

  protected removeClass(element: HTMLElement, className: string) {
    element.classList.remove(className);
  }

  protected toggleClass(
    element: HTMLElement,
    className: string,
    state: boolean
  ) {
    if (state) {
      this.addClass(element, className);
    } else {
      this.removeClass(element, className);
    }
  }

  // Шаблонный метод рендеринга - присваивает данные и возвращает элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {}); // Копирование данных в свойства компонента
    return this.element;
  }
}
