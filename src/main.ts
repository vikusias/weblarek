import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ProductApi } from "./components/ProductApi";
import { App } from "./components/App";
import { API_URL } from "./utils/constants";

import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Customer } from "./components/Models/Customer";

import { ModalView } from "./components/View/ModalView";
import { HeaderView } from "./components/View/HeaderView";
import { GalleryView } from "./components/View/GalleryView";
import { BasketView } from "./components/View/BasketView";
import { OrderFormView } from "./components/View/OrderFormView";
import { ContactsFormView } from "./components/View/ContactsFormView";
import { OrderSuccessView } from "./components/View/OrderSuccessView";

import { CardCatalogView } from "./components/View/CardCatalogView";
import { CardPreviewView } from "./components/View/CardPreviewView";
import { CardBasketView } from "./components/View/CardBasketView";

import { cloneTemplate, ensureElement } from "./utils/utils";

// Создание EventEmitter
const events = new EventEmitter();

// Создание API
const api = new Api(API_URL);
const productApi = new ProductApi(api);

// Создание моделей данных
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer();

// Создание представлений
const views = {
  modal: new ModalView(ensureElement<HTMLElement>("#modal-container"), events),
  header: new HeaderView(ensureElement<HTMLElement>(".header"), events),
  gallery: new GalleryView(ensureElement<HTMLElement>(".gallery")),
  basketView: new BasketView(cloneTemplate<HTMLElement>("#basket"), events),
  orderFormView: new OrderFormView(
    cloneTemplate<HTMLElement>("#order"),
    events
  ),
  contactsFormView: new ContactsFormView(
    cloneTemplate<HTMLElement>("#contacts"),
    events
  ),
  orderSuccessView: new OrderSuccessView(
    cloneTemplate<HTMLElement>("#success"),
    events
  ),
};

// Создание фабрик для карточек
const cardCatalogViewFactory = {
  create: (onClick: () => void) =>
    new CardCatalogView(cloneTemplate<HTMLElement>("#card-catalog"), {
      onClick,
    }),
};

const cardPreviewViewFactory = {
  create: (onClick: () => void) =>
    new CardPreviewView(cloneTemplate<HTMLElement>("#card-preview"), {
      onClick,
    }),
};

const cardBasketViewFactory = {
  create: (onClick: () => void) =>
    new CardBasketView(cloneTemplate<HTMLElement>("#card-basket"), { onClick }),
};

// Создание и инициализация приложения
try {
  new App(
    events,
    productApi,
    catalog,
    basket,
    customer,
    views,
    cardCatalogViewFactory,
    cardPreviewViewFactory,
    cardBasketViewFactory
  );

  console.log("Приложение Web-Ларёк запущено!");
} catch (error) {
  console.error("Ошибка при запуске приложения:", error);
}

// Глобальная обработка ошибок
window.addEventListener("error", (event) => {
  console.error("Глобальная ошибка:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Необработанный промис:", event.reason);
});
