// Преобразует строку из PascalCase в kebab-case 
export function pascalToKebab(value: string): string {
  // Исправлена регулярка: символ '0–9' заменен на '0-9' 
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Проверяет, является ли переданный аргумент селектором 
export function isSelector(x: any): x is string {
  return typeof x === "string" && x.length > 1;
}

// Проверяет, является ли значение пустым (null или undefined)
export function isEmpty(value: any): boolean {
  return value === null || value === undefined;
}

// Общий тип для коллекции селекторов
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

// Получает массив элементов по селектору или коллекции элементов
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

// Получает один элемент по селектору или возвращает переданный элемент
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
    return elements[0]; // или pop(), если нужен последний, обычно - первый
  }
  if (selectorElement instanceof HTMLElement) {
    return selectorElement as T;
  }
  throw new Error("Неизвестный тип элемента");
}

// Создает копию шаблона по селектору или HTMLTemplateElement
export function cloneTemplate<T extends HTMLElement>(
  query: string | HTMLTemplateElement
): T {
  const template =
    typeof query === "string"
      ? ensureElement<HTMLTemplateElement>(query)
      : query;
  if (!template.content.firstElementChild) {
    throw new Error("Шаблон пуст");
  }
  return template.content.firstElementChild.cloneNode(true) as T;
}

// Генерирует имя и класс по BEM-методологии
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

// Получает имена свойств прототипа объекта, с возможностью фильтрации
export function getObjectProperties(
  obj: object,
  filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
  return Object.entries(
    Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))
  )
    .filter(([name, prop]: [string, PropertyDescriptor]) =>
      filter ? filter(name, prop) : name !== "constructor"
    )
    .map(([name]) => name);
}

// Устанавливает dataset-атрибуты элемента из объекта
export function setElementData<T extends Record<string, unknown> | object>(
  el: HTMLElement,
  data: T
) {
  for (const key in data) {
    el.dataset[key] = String(data[key]);
  }
}

// Получает из dataset-атрибутов объекта, применяя схемы преобразования
export function getElementData<T extends Record<string, unknown>>(
  el: HTMLElement,
  scheme: Record<string, Function>
): T {
  const data: Partial<T> = {};
  for (const key in el.dataset) {
    if (scheme[key]) {
      data[key as keyof T] = scheme[key](el.dataset[key]) as T[keyof T];
    }
  }
  return data as T;
}

// Проверка, является ли объект простым (обычным) объектом
export function isPlainObject(obj: unknown): obj is object {
  if (obj === null || typeof obj !== "object") return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
}

// Проверка, является ли значение булевым
export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}

// Создает DOM-элемент с заданными свойствами и дочерними элементами
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
        // Установка dataset отдельно
        setElementData(element, value);
      } else {
        // Назначение свойств элемента
        (element as any)[key] = isBoolean(value) ? value : String(value);
      }
    }
  }

  if (children) {
    for (const child of Array.isArray(children) ? children : [children]) {
      element.append(child);
    }
  }

  return element;
}
