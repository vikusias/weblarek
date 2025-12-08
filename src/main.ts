import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ProductApi } from "./components/ProductApi";
import { App } from "./components/App";
import { API_URL } from "./utils/constants";

// Инициализация
const events = new EventEmitter();
const api = new Api(API_URL);
const productApi = new ProductApi(api);

// Создание приложения
try {
  new App(events, productApi);
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
