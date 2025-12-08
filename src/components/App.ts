import { IEvents } from "./base/Events";
import { Catalog } from "./Models/Catalog";
import { Basket } from "./Models/Basket";
import { Customer } from "./Models/Customer";
import { ProductApi } from "./ProductApi";
import { ModalView } from "./View/ModalView";
import { CardCatalogView } from "./View/CardCatalogView";
import { CardPreviewView } from "./View/CardPreviewView";
import { CardBasketView } from "./View/CardBasketView";
import { BasketView } from "./View/BasketView";
import { OrderFormView } from "./View/OrderFormView";
import { ContactsFormView } from "./View/ContactsFormView";
import { OrderSuccessView } from "./View/OrderSuccessView";
import { HeaderView } from "./View/HeaderView";
import { GalleryView } from "./View/GalleryView";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { IProduct, IOrderApiRequest, TPayment, TCategoryNames } from "../types";
import { CDN_URL } from "../utils/constants";

export class App {
  private catalog: Catalog;
  private basket: Basket;
  private customer: Customer;
  private modal!: ModalView;
  private header!: HeaderView;
  private gallery!: GalleryView;

  // Валидаторы форм для контроля перехода между шагами
  private formValidators: {
    order: boolean;
    contacts: boolean;
  };

  constructor(private events: IEvents, private api: ProductApi) {
    // Инициализация моделей
    this.catalog = new Catalog(events);
    this.basket = new Basket(events);
    this.customer = new Customer();
    this.formValidators = {
      order: false,
      contacts: false,
    };

    this.initViews();
    this.setupEventListeners(); // Настройка реактивности
    this.loadProducts(); // Начальная загрузка данных
  }

  private initViews() {
    // Создание основных представлений
    this.modal = new ModalView(
      ensureElement<HTMLElement>("#modal-container"),
      this.events
    );

    this.header = new HeaderView(
      ensureElement<HTMLElement>(".header"),
      this.events
    );

    this.gallery = new GalleryView(ensureElement<HTMLElement>(".gallery"));
  }

  private setupEventListeners() {
    // Загрузка каталога
    this.events.on("catalog:changed", () => {
      this.renderCatalog();
    });

    // Выбор товара для просмотра
    this.events.on("product:select", (data: { id: string }) => {
      const product = this.catalog.getItem(data.id);
      if (product) {
        this.catalog.setCurrentItem(product); // Установка текущего товара
      }
    });

    // Показ товара
    this.events.on("product:selected", (data: { item: IProduct }) => {
      this.showProductModal(data.item);
    });

    // Добавление в корзину
    this.events.on("product:add", (data: { id: string }) => {
      const product = this.catalog.getItem(data.id);
      if (product) {
        this.basket.addItem(product);
      }
    });

    // Удаление из корзины
    this.events.on("product:remove", (data: { id: string }) => {
      this.basket.deleteItem(data.id);
    });

    // Изменение корзины
    this.events.on("basket:changed", () => {
      this.updateHeader();
    });

    // Открытие корзины
    this.events.on("basket:open", () => {
      this.showBasketModal();
    });

    // Оформление заказа
    this.events.on("order:start", () => {
      if (this.basket.getTotalItems() > 0) {
        this.showOrderModal();
      }
    });

    // Изменение способа оплаты
    this.events.on("order.payment:change", (data: { payment: TPayment }) => {
      this.customer.setPayment(data.payment);
      this.validateOrderForm();
    });

    // Изменение адреса
    this.events.on("order.address:change", (data: { address: string }) => {
      this.customer.setAddress(data.address);
      this.validateOrderForm();
    });

    // Подтверждение заказа
    this.events.on(
      "order:submit",
      (data: { payment: TPayment; address: string }) => {
        this.customer.setPayment(data.payment);
        this.customer.setAddress(data.address);

        if (this.formValidators.order) {
          this.showContactsModal();
        }
      }
    );

    // Изменение email
    this.events.on("contacts.email:change", (data: { email: string }) => {
      this.customer.setEmail(data.email);
      this.validateContactsForm();
    });

    // Изменение телефона
    this.events.on("contacts.phone:change", (data: { phone: string }) => {
      this.customer.setPhone(data.phone);
      this.validateContactsForm();
    });

    // Завершение заказа
    this.events.on(
      "contacts:submit",
      (data: { email: string; phone: string }) => {
        this.customer.setEmail(data.email);
        this.customer.setPhone(data.phone);

        if (this.formValidators.contacts) {
          this.processOrder();
        }
      }
    );

    // Успешное оформление
    this.events.on("order:success", () => {
      this.modal.close();
    });

    // Закрытие модального окна
    this.events.on("modal:close", () => {
      this.catalog.clearCurrentItem();
    });

    // Обработка ошибок
    this.events.on("error", (error: { message: string }) => {
      console.error("Ошибка в приложении:", error.message);
    });
  }

  private async loadProducts() {
    try {
      const result = await this.api.getProducts();
      this.catalog.setItems(result.items);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      this.events.emit("error", { message: "Не удалось загрузить товары" });
    }
  }

  private renderCatalog() {
    const items = this.catalog.getItems();
    const cards = items.map((item) => {
      const card = new CardCatalogView(
        cloneTemplate<HTMLElement>("#card-catalog"),
        {
          onClick: () => {
            this.events.emit("product:select", { id: item.id });
          },
        }
      );

      return card.render({
        ...item,
        id: item.id,
        image: CDN_URL + item.image,
        title: item.title,
        price: item.price,
        category: item.category as TCategoryNames,
      });
    });

    this.gallery.items = cards;
  }

  private showProductModal(product: IProduct) {
    const preview = new CardPreviewView(
      cloneTemplate<HTMLElement>("#card-preview"),
      {
        onClick: () => {
          if (this.basket.hasItem(product.id)) {
            this.events.emit("product:remove", { id: product.id });
          } else if (product.price !== null) {
            this.events.emit("product:add", { id: product.id });
          }
          this.modal.close();
        },
      }
    );

    const isInBasket = this.basket.hasItem(product.id);

    preview.render({
      ...product,
      image: CDN_URL + product.image,
      buttonText: isInBasket
        ? "Убрать из корзины"
        : product.price === null
        ? "Недоступно"
        : "В корзину",
      canBuy: product.price !== null,
      description: product.description,
      category: product.category as TCategoryNames,
    });

    this.modal.open();
    this.modal.content = preview.element;
  }

  private showBasketModal() {
    const basketView = new BasketView(
      cloneTemplate<HTMLElement>("#basket"),
      this.events
    );

    const items = this.basket.getItems().map((item, index) => {
      const card = new CardBasketView(
        cloneTemplate<HTMLElement>("#card-basket"),
        {
          onClick: () => {
            this.events.emit("product:remove", { id: item.id });
          },
        }
      );

      return card.render({
        ...item,
        index: index + 1,
        title: item.title,
        price: item.price,
      });
    });

    basketView.render({
      items,
      total: this.basket.getTotalPrice(),
      canCheckout: this.basket.getTotalItems() > 0,
    });

    this.modal.open();
    this.modal.content = basketView.element;
  }

  private showOrderModal() {
    const orderView = new OrderFormView(
      cloneTemplate<HTMLElement>("#order"),
      this.events
    );

    const customerData = this.customer.getData();
    const errors = this.customer.checkValidity();
    const orderErrors = [];

    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);

    this.formValidators.order = orderErrors.length === 0;

    orderView.render({
      payment: customerData.payment,
      address: customerData.address,
      valid: this.formValidators.order,
      errors: orderErrors,
    });

    this.modal.open();
    this.modal.content = orderView.element;
  }

  private showContactsModal() {
    const contactsView = new ContactsFormView(
      cloneTemplate<HTMLElement>("#contacts"),
      this.events
    );

    const customerData = this.customer.getData();
    const errors = this.customer.checkValidity();
    const contactErrors = [];

    if (errors.email) contactErrors.push(errors.email);
    if (errors.phone) contactErrors.push(errors.phone);

    this.formValidators.contacts = contactErrors.length === 0;

    contactsView.render({
      email: customerData.email,
      phone: customerData.phone,
      valid: this.formValidators.contacts,
      errors: contactErrors,
    });

    this.modal.open();
    this.modal.content = contactsView.element;
  }

  private validateOrderForm() {
    const errors = this.customer.checkValidity();
    const orderErrors = [];

    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);

    this.formValidators.order = orderErrors.length === 0;
  }

  private validateContactsForm() {
    const errors = this.customer.checkValidity();
    const contactErrors = [];

    if (errors.email) contactErrors.push(errors.email);
    if (errors.phone) contactErrors.push(errors.phone);

    this.formValidators.contacts = contactErrors.length === 0;
  }

  private async processOrder() {
    try {
      const orderData: IOrderApiRequest = {
        ...this.customer.getData(),
        total: this.basket.getTotalPrice(),
        items: this.basket.getItems().map((item) => item.id),
      };

      // Используем результат запроса
      const result = await this.api.order(orderData);
      console.log("Заказ оформлен успешно, ID:", result.id);

      // Показываем успешное оформление
      const successView = new OrderSuccessView(
        cloneTemplate<HTMLElement>("#success"),
        this.events
      );

      successView.render({
        total: this.basket.getTotalPrice(),
      });

      this.modal.content = successView.element;

      // Очищаем данные
      this.basket.clear();
      this.customer.clear();
      this.formValidators.order = false;
      this.formValidators.contacts = false;
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      this.events.emit("error", { message: "Не удалось оформить заказ" });
    }
  }

  private updateHeader() {
    const count = this.basket.getTotalItems();
    this.header.count = count; // Обновление счетчика в хедере
  }
}
