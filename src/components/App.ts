import { IEvents } from "./base/Events";
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
import { ICatalog } from "./Models/Catalog";
import { IBasket } from "./Models/Basket";
import { ICustomer } from "./Models/Customer";

export class App {
  private modal: ModalView;
  private header: HeaderView;
  private gallery: GalleryView;
  private basketView: BasketView;
  private orderFormView: OrderFormView;
  private contactsFormView: ContactsFormView;
  private orderSuccessView: OrderSuccessView;

  private currentModalType:
    | "order"
    | "contacts"
    | "basket"
    | "product"
    | "success"
    | null = null;

  constructor(
    private events: IEvents,
    private api: ProductApi,
    private catalog: ICatalog,
    private basket: IBasket,
    private customer: ICustomer
  ) {
    // Инициализация представлений
    this.modal = new ModalView(
      ensureElement<HTMLElement>("#modal-container"),
      this.events
    );

    this.header = new HeaderView(
      ensureElement<HTMLElement>(".header"),
      this.events
    );

    this.gallery = new GalleryView(ensureElement<HTMLElement>(".gallery"));

    this.basketView = new BasketView(
      cloneTemplate<HTMLElement>("#basket"),
      this.events
    );

    this.orderFormView = new OrderFormView(
      cloneTemplate<HTMLElement>("#order"),
      this.events
    );

    this.contactsFormView = new ContactsFormView(
      cloneTemplate<HTMLElement>("#contacts"),
      this.events
    );

    this.orderSuccessView = new OrderSuccessView(
      cloneTemplate<HTMLElement>("#success"),
      this.events
    );

    this.setupEventListeners();
    this.loadProducts();
  }

  private setupEventListeners(): void {
    this.events.on("catalog:changed", () => {
      this.renderCatalog();
    });

    this.events.on<{ id: string }>("product:select", (data) => {
      const product = this.catalog.getItem(data.id);
      if (product) {
        this.showProductModal(product);
      }
    });

    this.events.on<{ id: string }>("product:add", (data) => {
      const product = this.catalog.getItem(data.id);
      if (product) {
        this.basket.addItem(product);
      }
    });

    this.events.on<{ id: string }>("product:remove", (data) => {
      this.basket.removeItem(data.id);
    });

    this.events.on("basket:changed", () => {
      this.updateHeader();
      if (this.currentModalType === "basket") {
        this.updateBasketModal();
      }
    });

    this.events.on("basket:open", () => {
      this.showBasketModal();
    });

    this.events.on("order:start", () => {
      if (this.basket.getTotalItems() > 0) {
        this.showOrderModal();
      }
    });

    this.events.on("customer:changed", () => {
      this.updateForms();
    });

    this.events.on<{ payment: TPayment }>("order.payment:change", (data) => {
      this.customer.setPayment(data.payment);
    });

    this.events.on<{ address: string }>("order.address:change", (data) => {
      this.customer.setAddress(data.address);
    });

    this.events.on("order:submit", () => {
      const errors = this.customer.checkValidity();

      if (!errors.payment && !errors.address) {
        this.showContactsModal();
      } else {
        this.showOrderModal();
      }
    });

    this.events.on<{ email: string }>("contacts.email:change", (data) => {
      this.customer.setEmail(data.email);
    });

    this.events.on<{ phone: string }>("contacts.phone:change", (data) => {
      this.customer.setPhone(data.phone);
    });

    this.events.on("contacts:submit", () => {
      const errors = this.customer.checkValidity();

      if (!errors.email && !errors.phone) {
        this.processOrder();
      } else {
        this.showContactsModal();
      }
    });

    // Добавлен обработчик для успешного заказа
    this.events.on("order:success", () => {
      this.modal.close();
    });

    this.events.on("modal:close", () => {
      this.currentModalType = null;
    });

    this.events.on<{ message: string }>("error", (error) => {
      console.error("Ошибка:", error.message);
    });
  }

  private async loadProducts(): Promise<void> {
    try {
      const result = await this.api.getProducts();
      this.catalog.setItems(result.items);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      this.events.emit("error", { message: "Не удалось загрузить товары" });
    }
  }

  private renderCatalog(): void {
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
        title: item.title,
        price: item.price,
        category: item.category as TCategoryNames,
        image: CDN_URL + item.image,
      });
    });

    this.gallery.items = cards;
  }

  private showProductModal(product: IProduct): void {
    // Если уже открыто модальное окно с этим товаром, не открываем заново
    if (this.currentModalType === "product" && this.modal.isOpen) {
      return;
    }

    const preview = new CardPreviewView(
      cloneTemplate<HTMLElement>("#card-preview"),
      {
        onClick: () => {
          if (this.basket.hasItem(product.id)) {
            this.events.emit("product:remove", { id: product.id });
          } else {
            this.events.emit("product:add", { id: product.id });
          }
          this.modal.close();
        },
      }
    );

    const isInBasket = this.basket.hasItem(product.id);

    preview.render({
      title: product.title,
      price: product.price,
      category: product.category as TCategoryNames,
      image: CDN_URL + product.image,
      description: product.description,
      buttonText: isInBasket
        ? "Удалить из корзины"
        : product.price === null
        ? "Недоступно"
        : "В корзину",
      buttonDisabled: product.price === null,
    });

    this.modal.open();
    this.modal.content = preview.getDOMElement();
    this.currentModalType = "product";
  }

  private showBasketModal(): void {
    this.updateBasketModal();
    this.modal.open();
    this.modal.content = this.basketView.getDOMElement();
    this.currentModalType = "basket";
  }

  private updateBasketModal(): void {
    const items = this.basket.getItems();

    // Используем getDOMElement() для доступа к DOM
    if (
      items.length === 0 &&
      this.basketView.getDOMElement().querySelector(".basket__empty")
    ) {
      return;
    }

    const basketItems = items.map((item, index) => {
      const card = new CardBasketView(
        cloneTemplate<HTMLElement>("#card-basket"),
        {
          onClick: () => {
            this.events.emit("product:remove", { id: item.id });
          },
        }
      );

      return card.render({
        title: item.title,
        price: item.price,
        index: index + 1,
      });
    });

    this.basketView.render({
      items: basketItems,
      total: this.basket.getTotalPrice(),
      canCheckout: items.length > 0,
    });
  }

  private showOrderModal(): void {
    const customerData = this.customer.getData();
    const errors = this.customer.checkValidity();

    this.orderFormView.render({
      payment: customerData.payment,
      address: customerData.address,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(
        (error): error is string => Boolean(error)
      ),
    });

    this.modal.open();
    this.modal.content = this.orderFormView.getDOMElement();
    this.currentModalType = "order";
  }

  private showContactsModal(): void {
    const customerData = this.customer.getData();
    const errors = this.customer.checkValidity();

    this.contactsFormView.render({
      email: customerData.email,
      phone: customerData.phone,
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter((error): error is string =>
        Boolean(error)
      ),
    });

    this.modal.open();
    this.modal.content = this.contactsFormView.getDOMElement();
    this.currentModalType = "contacts";
  }

  private updateForms(): void {
    if (this.modal.isOpen && this.currentModalType) {
      switch (this.currentModalType) {
        case "order":
          this.showOrderModal();
          break;
        case "contacts":
          this.showContactsModal();
          break;
        case "basket":
          this.updateBasketModal();
          break;
      }
    }
  }

  private async processOrder(): Promise<void> {
    try {
      const orderData: IOrderApiRequest = {
        ...this.customer.getData(),
        total: this.basket.getTotalPrice(),
        items: this.basket.getItems().map((item) => item.id),
      };

      const result = await this.api.order(orderData);
      console.log("Заказ оформлен успешно, ID:", result.id);

      this.orderSuccessView.render({
        total: this.basket.getTotalPrice(),
      });

      this.modal.content = this.orderSuccessView.getDOMElement();
      this.currentModalType = "success";

      this.basket.clear();
      this.customer.clear();
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      this.events.emit("error", { message: "Не удалось оформить заказ" });
    }
  }

  private updateHeader(): void {
    this.header.count = this.basket.getTotalItems();
  }
}
