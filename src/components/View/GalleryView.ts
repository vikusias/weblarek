import { Component } from "../base/Component";

// Интерфейс данных для галереи
interface IGalleryData {
  items: HTMLElement[]; // Массив элементов галереи
}
// Вью для галереи
export class GalleryView extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  // Установка элементов галереи
  set items(items: HTMLElement[]) {
    this.element.replaceChildren(...items);
  }
}
