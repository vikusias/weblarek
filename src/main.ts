import "./scss/styles.scss";

import { AppApi } from "./components/model/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { ItemData } from "./components/model/ItemData";
import { EventEmitter } from "./components/base/events";
import { UserData } from "./components/model/UserData";
import { BasketData } from "./components/model/BasketData";
import { Page } from "./components/view/Page";
import { ItemElement, ItemPreview, BasketItem } from "./components/view/Item";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { IItem, IUser } from "./types";
import { FormContacts, FormOrder } from "./components/view/Form";
import { Success } from "./components/view/Success";

// Инициализация API
const appApi = new AppApi(CDN_URL, API_URL);

// Получение шаблонов DOM
const itemTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasket = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contacts = ensureElement<HTMLTemplateElement>("#contacts");

// Создаем экземпляр EventEmitter
const events = new EventEmitter();

// Отладка: логируем все события
events.onAll(({ eventName, data }) => {
  console.log(`[Event] ${eventName}`, data);
});

// Создаем модели данных
const itemData = new ItemData(events);
const userData = new UserData(events);
const basketData = new BasketData(events);

// Создаем основные компоненты интерфейса
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const formContacts = new FormContacts(cloneTemplate(contacts), events);
const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => modal.close(),
});

// Обновление списка товаров
events.on("item:setAllItems", () => {
  // Отрисовка карточек товаров
  page.itemList = itemData.getAllItems().map((item: IItem) => {
    const itemElement = new ItemElement(cloneTemplate(itemTemplate), events, {
      onClick: () => events.emit("card:select", item),
    });
    return itemElement.render({
      price: item.price,
      title: item.title,
      category: item.category,
      image: item.image,
      id: item.id,
    });
  });
});

// Обработка выбора карточки
events.on("card:select", (item: IItem) => {
  itemData.setPreview(item);
});

// Обработка изменения предпросмотра
events.on("preview:changed", (item: IItem) => {
  const itemPreview = new ItemPreview(
    cloneTemplate(cardPreviewTemplate),
    events,
    {
      onClick: () => {
        if (basketData.getBasketItems(item)) {
          events.emit("item:delete", item);
        } else {
          events.emit("item:add", item);
        }
      },
    }
  );
  // Показываем предпросмотр в модальном окне
  modal.render({
    content: itemPreview.render({
      id: item.id,
      image: item.image,
      title: item.title,
      category: item.category,
      description: item.description,
      price: item.price,
      itemButton: basketData.getBasketItems(item) ? true : false,
    }),
  });
});

// Добавление в корзину
events.on("item:add", () => {
  basketData.addItem(itemData.preview!);
  modal.close();
});

// Удаление из корзины
events.on("item:delete", (item: IItem) => {
  basketData.deleteItem(item.id);
  modal.close();
});

// Открытие корзины
events.on("basket:open", () => {
  modal.render({ content: basket.render({}) });
});

// Обновление корзины
events.on("basket:changed", () => {
  page.counter = basketData.getAllItems().length;
  basket.fullPrice = basketData.getFullPrice();

  // Обновляем список товаров в корзине
  basket.items = basketData.getAllItems().map((item, index) => {
    const itemBasket = new BasketItem(cloneTemplate(cardBasket), events, {
      onClick: () => {
        basketData.deleteItem(item.id);
      },
    });
    return itemBasket.render({
      id: item.id,
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });
});

// Продолжение оформления заказа
events.on("basket:continue", () => {
  userData.clearOrder();
  modal.render({
    content: formOrder.render({
      isValid: false,
      errors: [],
      payment: "",
      address: "",
    }),
  });
});

// Обработка изменения данных заказа
events.on(
  /^(order|contacts)\..*:change/,
  (data: { field: keyof IUser; value: string }) => {
    userData.setOrderField(data.field, data.value);
  }
);

// Валидация формы
events.on("formErrors:change", (errors: Partial<IUser>) => {
  const { payment, address, email, phone } = errors;
  // Валидация и отображение ошибок
  formOrder.isValid = !payment && !address;
  formContacts.isValid = !email && !phone;
  // Формируем строки ошибок
  formOrder.errors = Object.values({ address, payment })
    .filter(Boolean)
    .join("; ");
  formContacts.errors = Object.values({ email, phone })
    .filter(Boolean)
    .join("; ");
});

// Обновление данных по заказу
events.on("order:change", () => {
  userData.order.payment = userData.order.payment; // возможно, лишнее, оставить для ясности
  // Или можно убрать, если это не нужно
});

// Отправка формы контактов
events.on("contacts:submit", async () => {
  try {
    const res = await appApi.postItem({
      total: basketData.getFullPrice(),
      items: basketData.getBasketIdItems(),
      address: userData.order.address,
      phone: userData.order.phone,
      payment: userData.order.payment,
      email: userData.order.email,
    });
    // Успешное оформление заказа
    success.total = res.total;
    basketData.deleteAllItems(); // исправлено на правильное имя метода
    userData.clearOrder();
    modal.render({ content: success.render({}) });
  } catch (err) {
    console.error("Ошибка при отправке заказа:", err);
  }
});

// Управление всплывающими окнами
events.on("popup:open", () => {
  page.locked = true;
});
events.on("popup:close", () => {
  page.locked = false;
});

// Загрузка товаров при старте
(async () => {
  try {
    const items = await appApi.getAllItem();
    // Обработка товаров
    console.log("Загружено товаров:", items);
  } catch (err) {
    console.error("Ошибка при загрузке товаров:", err);
  }
})();
