import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ProductApi } from "./components/ProductApi";
import { App } from "./components/App";
import { API_URL } from "./utils/constants";

import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Customer } from "./components/Models/Customer";

const events = new EventEmitter();
const api = new Api(API_URL);
const productApi = new ProductApi(api);

// Создание моделей данных
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);

// Создание и инициализация приложения
try {
  // Создаем объект App без присвоения переменной
  new App(events, productApi, catalog, basket, customer);
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
