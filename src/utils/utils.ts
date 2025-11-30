import { IErrorApiResponse } from "../types";

// Преобразование строки из PascalCase в kebab-case
export function pascalToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Проверка, является ли значение селектором (строкой)
export function isSelector(x: any): x is string {
  return typeof x === "string" && x.length > 1;
}

// Проверка, является ли значение пустым
export function isEmpty(value: any): boolean {
  return value === null || value === undefined;
}

// Тип для коллекции селекторов
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

// Получение массива элементов по селектору
export function ensureAllElements<T extends HTMLElement>(
  selectorElement: SelectorCollection<T>,
  context: HTMLElement = document as unknown as HTMLElement
): T[] {
  if (isSelector(selectorElement)) {
    return Array.from(context.querySelectorAll(selectorElement)) as T[];
  }
  if (selectorElement instanceof NodeList) {
    return Array.from(selectorElement) as T[];
  }
  if (Array.isArray(selectorElement)) {
    return selectorElement;
  }
  throw new Error(`Unknown selector element`);
}

// Тип для элемента или селектора
export type SelectorElement<T> = T | string;

// Получение одного элемента по селектору
export function ensureElement<T extends HTMLElement>(
  selectorElement: SelectorElement<T>,
  context?: HTMLElement
): T {
  if (isSelector(selectorElement)) {
    const elements = ensureAllElements<T>(selectorElement, context);
    if (elements.length > 1) {
      console.warn(
        `selector ${selectorElement} возвращает более одного элемента`
      );
    }
    if (elements.length === 0) {
      throw new Error(
        `selector ${selectorElement} не вернул ни одного элемента`
      );
    }
    return elements[0];
  }
  if (selectorElement instanceof HTMLElement) {
    return selectorElement as T;
  }
  throw new Error("Неизвестный тип селектора");
}

// Клонирование шаблона
export function cloneTemplate<T extends HTMLElement>(
  query: string | HTMLTemplateElement
): T {
  const template = ensureElement(query) as HTMLTemplateElement;
  if (!template.content.firstElementChild) {
    throw new Error(`Шаблон ${query} не содержит содержимого`);
  }
  return template.content.firstElementChild.cloneNode(true) as T;
}

// Создание имени и класса по BEM-методу
export function bem(
  block: string,
  element?: string,
  modifier?: string
): { name: string; class: string } {
  let name = block;
  if (element) name += `__${element}`;
  if (modifier) name += `_${modifier}`;
  return {
    name,
    class: `.${name}`,
  };
}

// Получение свойств объекта, включая свойства прототипа
export function getObjectProperties(
  obj: object,
  filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
  return Object.entries(
    Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))
  )
    .filter(([name, prop]) =>
      filter ? filter(name, prop) : name !== "constructor"
    )
    .map(([name]) => name);
}

// Установка dataset атрибутов элемента
export function setElementData<T extends Record<string, unknown> | object>(
  el: HTMLElement,
  data: T
): void {
  for (const key in data) {
    el.dataset[key] = String(data[key]);
  }
}

// Получение данных из dataset с преобразованием
export function getElementData<T extends Record<string, unknown>>(
  el: HTMLElement,
  scheme: Record<string, Function>
): T {
  const data: Partial<T> = {};
  for (const key in el.dataset) {
    data[key as keyof T] = scheme[key](el.dataset[key]);
  }
  return data as T;
}

// Проверка, является ли объект простым объектом
export function isPlainObject(obj: unknown): obj is object {
  const prototype = Object.getPrototypeOf(obj);
  return prototype === Object.getPrototypeOf({}) || prototype === null;
}

// Проверка, является ли значение булевым
export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}

// Создание DOM-элемента с свойствами и потомками
export function createElement<T extends HTMLElement>(
  tagName: keyof HTMLElementTagNameMap,
  props?: Partial<Record<keyof T, string | boolean | object>>,
  children?: HTMLElement | HTMLElement[]
): T {
  const element = document.createElement(tagName) as T;

  if (props) {
    for (const key in props) {
      const value = props[key];
      if (isPlainObject(value) && key === "dataset") {
        setElementData(element, value);
      } else {
        // @ts-expect-error
        element[key] = isBoolean(value) ? value : String(value);
      }
    }
  }

  if (children) {
    const childrenArray = Array.isArray(children) ? children : [children];
    for (const child of childrenArray) {
      element.append(child);
    }
  }

  return element;
}

// Проверка, является ли ответ API ошибкой
export function isErrorApiResponse(e: unknown): e is IErrorApiResponse {
  return typeof e === "object" && e !== null && "error" in e;
}
