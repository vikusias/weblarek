// Абстрактный класс для компонентов
export abstract class Component<T> {
  // Конструктор контейнер HTMLElement
  protected constructor(protected readonly container: HTMLElement) {}

  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }
  // Установка текста внутри элемента для обновления
  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
      element.textContent = String(value);
    }
  }

  // Метод для управления состоянием элемента включить/отключить (например: кнопку)
  setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
      if (state) element.setAttribute("disabled", "disabled");
      else element.removeAttribute("disabled");
    }
  }

  // Метод скрытия элемента
  protected setHidden(element: HTMLElement) {
    element.style.display = "none";
  }

  // Метод отображения элемента
  protected setVisible(element: HTMLElement) {
    element.style.removeProperty("display");
  }

  // Метод для обновления изображения
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  // Метод рендеринга компонента; также обновляет его состояние данными
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}
