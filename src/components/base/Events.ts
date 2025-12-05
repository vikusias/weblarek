// Тип для имени события, может быть строкой или регулярным выражением для шаблонов
type EventName = string | RegExp;

// Тип для подписчика — функция обратного вызова
type Subscriber = Function;

// Структура данных для хранения событий и данных, связанных с ними
type EmitterEvent = {
  eventName: string; // Имя события
  data: unknown; // Передаваемые данные
};

// Интерфейс для событийного брокера
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void; // Подписка на событие
  emit<T extends object>(event: string, data?: T): void; // Генерация события
  trigger<T extends object>(
    event: string,
    context?: Partial<T>
  ): (data: T) => void; // Создает функцию-триггер для события
}

export class EventEmitter implements IEvents {
  // Карта событий: ключ — имя события, значение — множество подписчиков
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {
    // Инициализация карты
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  /**
   * Подписка на событие
   */
  on<T extends object>(eventName: EventName, callback: (event: T) => void) {
    if (!this._events.has(eventName)) {
      // Если события еще нет — создаем новую запись
      this._events.set(eventName, new Set<Subscriber>());
    }
    // Добавляем подписчика
    this._events.get(eventName)?.add(callback);
  }

  /**
   * Отписка от события
   */
  off(eventName: EventName, callback: Subscriber) {
    if (this._events.has(eventName)) {
      // Удаляем конкретного подписчика
      this._events.get(eventName)!.delete(callback);
      // Если подписчиков не осталось — удаляем событие
      if (this._events.get(eventName)?.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  /**
   * Генерация события с данными
   */
  emit<T extends object>(eventName: string, data?: T) {
    // Проходим по всем событиям и вызываем подходящие подписки
    this._events.forEach((subscribers, name) => {
      // Обработка универсальной подписки на все события '*'
      if (name === "*")
        subscribers.forEach((callback) =>
          callback({
            eventName,
            data,
          })
        );
      // Обработка событий по шаблону или точному совпадению
      if (
        (name instanceof RegExp && name.test(eventName)) ||
        name === eventName
      ) {
        subscribers.forEach((callback) => callback(data));
      }
    });
  }

  /**
   * Подписка на все события
   */
  onAll(callback: (event: EmitterEvent) => void) {
    this.on("*", callback);
  }

  /**
   * Очистка всех обработчиков
   */
  offAll() {
    this._events = new Map<string, Set<Subscriber>>();
  }

  /**
   * Создает функцию-триггер, которая вызывает emit при вызове
   */
  trigger<T extends object>(eventName: string, context?: Partial<T>) {
    return (event: object = {}) => {
      this.emit(eventName, {
        // Объединение данных события и контекста
        ...(event || {}),
        ...(context || {}),
      });
    };
  }
}
