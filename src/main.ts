import "./scss/styles.scss";
import { ProductApi } from "./components/Api/ProductApi.ts";
import { Api } from "./components/base/Api.ts";
import { Basket } from "./components/Models/Basket.ts";
import { Catalog } from "./components/Models/Catalog.ts";
import { Customer } from "./components/Models/Customer.ts";
import { API_URL } from "./utils/constants.ts";
import { apiProducts } from "./utils/data.ts";
import { isErrorApiResponse } from "./utils/utils.ts";

const productApi = new ProductApi(new Api(API_URL));
const basketModel = new Basket();
const catalogModel = new Catalog();
const customerModel = new Customer();

catalogModel.setItems(apiProducts.items);
console.log("Сохранение текущего товара");
catalogModel.setCurrentItem(catalogModel.getItem(apiProducts.items[1].id));
console.log("Массив товаров из каталога: ", catalogModel.getItems());
console.log(
  "Товар из каталога по id: ",
  catalogModel.getItem(apiProducts.items[1].id)
);
console.log("Текущий товар: ", catalogModel.getCurrentItem());

console.log("-------------------");

console.log("Добавление товара в корзину");
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log("Массив товаров в корзине:", basketModel.getItems());
console.log("Стоимость всех товаров:", basketModel.getTotalPrice());
console.log("Количество товаров в корзине:", basketModel.getTotalItems());
console.log(
  "Проверка наличия товара в корзине (есть)",
  basketModel.hasItem(apiProducts.items[1].id)
);
console.log(
  "Проверка наличия товара в корзине (нет)",
  basketModel.hasItem(apiProducts.items[2].id)
);
basketModel.addItem(apiProducts.items[2]);
console.log("Удаление товара из корзины");
basketModel.deleteItem(apiProducts.items[0]);
console.log("Очистка корзины");
basketModel.clear();

console.log("-------------------");

console.log("Сохранение способа оплаты");
customerModel.setPayment("cash");
console.log("Сохранение адреса доставки");
customerModel.setAddress("350004, Краснодар, ул. Темрюкская, д. 65, кв.176");
console.log("Сохранение email");
customerModel.setEmail("Jaroslav88_54@yandex.ru");
console.log("Сохранение телефона");
customerModel.setPhone("+7 (925) 445-19-79");
console.log("Данные покупателя", customerModel.getData());
console.log("Очистка данных покупателя");
customerModel.clear();
console.log("Данные покупателя после очистки", customerModel.getData());
console.log("Проверка данных покупателя", customerModel.checkValidity());

console.log("-------------------");

console.log("Получение всех товаров");
try {
  const products = await productApi.getProducts();
  console.log("Сохраняет полученные товары в модель");
  catalogModel.setItems(products.items);
  console.log("Сохраненные товары", catalogModel.getItems());
} catch (e: unknown) {
  if (isErrorApiResponse(e)) {
    console.error(e.error);
  } else {
    console.log(e);
  }
}
