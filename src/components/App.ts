import { IEvents } from "./base/Events";
import { ModalView } from "./View/ModalView";
import { BasketView } from "./View/BasketView";
import { OrderFormView } from "./View/OrderFormView";
import { ContactsFormView } from "./View/ContactsFormView";
import { OrderSuccessView } from "./View/OrderSuccessView";
import { HeaderView } from "./View/HeaderView";
import { GalleryView } from "./View/GalleryView";
import { IProduct, IOrderApiRequest, TPayment, TCategoryNames } from "../types";
import { CDN_URL } from "../utils/constants";

// Интерфейсы для инверсии зависимостей
interface IProductApi {
  getProducts(): Promise<{ items: IProduct[] }>;
  order(data: IOrderApiRequest): Promise<{ id: string }>;
}

// Интерфейсы для представлений
interface ICardCatalogView {
  render(data: {
    title: string;
    price: number | null;
    category: TCategoryNames;
    image: string;
  }): HTMLElement;
}

interface ICardPreviewView {
  render(data: {
    title: string;
    price: number | null;
    category: TCategoryNames;
    image: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
  }): HTMLElement;
}

interface ICardBasketView {
  render(data: {
    title: string;
    price: number | null;
    index: number;
  }): HTMLElement;
}

// Фабричные интерфейсы для создания представлений
interface ICardCatalogViewFactory {
  create(onClick: () => void): ICardCatalogView;
}

interface ICardPreviewViewFactory {
  create(onClick: () => void): ICardPreviewView;
}

interface ICardBasketViewFactory {
  create(onClick: () => void): ICardBasketView;
}

interface IAppViews {
  modal: ModalView;
  header: HeaderView;
  gallery: GalleryView;
  basketView: BasketView;
  orderFormView: OrderFormView;
  contactsFormView: ContactsFormView;
  orderSuccessView: OrderSuccessView;
}

export class App {
  constructor(
    private events: IEvents,
    private api: IProductApi,
    private catalog: {
      getItems(): IProduct[];
      getItem(id: string): IProduct | undefined;
      setItems(items: IProduct[]): void;
    },
    private basket: {
      getItems(): IProduct[];
      getTotalPrice(): number;
      getTotalItems(): number;
      hasItem(id: string): boolean;
      addItem(item: IProduct): void;
      removeItem(id: string): void;
      clear(): void;
    },
    private customer: {
      getData(): {
        payment: TPayment;
        address: string;
        phone: string;
        email: string;
      };
      setPayment(payment: TPayment): void;
      setAddress(address: string): void;
      setPhone(phone: string): void;
      setEmail(email: string): void;
      clear(): void;
      checkValidity(): { [key: string]: string };
    },
    private views: IAppViews,
    private cardCatalogViewFactory: ICardCatalogViewFactory,
    private cardPreviewViewFactory: ICardPreviewViewFactory,
    private cardBasketViewFactory: ICardBasketViewFactory
  ) {
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
      this.updateBasketModal();
    });

    this.events.on("basket:open", () => {
      this.views.modal.open();
      this.views.modal.content = this.views.basketView.render({});
    });

    this.events.on("order:start", () => {
      if (this.basket.getTotalItems() > 0) {
        this.showOrderModal();
      }
    });

    this.events.on<{ payment: TPayment }>("order.payment:change", (data) => {
      this.customer.setPayment(data.payment);
      this.events.emit("order:form:changed");
    });

    this.events.on<{ address: string }>("order.address:change", (data) => {
      this.customer.setAddress(data.address);
      this.events.emit("order:form:changed");
    });

    this.events.on("order:form:changed", () => {
      this.updateOrderForm();
    });

    this.events.on("order:submit", () => {
      const errors = this.customer.checkValidity();
      const orderErrors = [errors.payment, errors.address].filter(Boolean);

      if (orderErrors.length === 0) {
        this.showContactsModal();
      } else {
        this.updateOrderForm();
      }
    });

    this.events.on<{ email: string }>("contacts.email:change", (data) => {
      this.customer.setEmail(data.email);
      this.events.emit("contacts:form:changed");
    });

    this.events.on<{ phone: string }>("contacts.phone:change", (data) => {
      this.customer.setPhone(data.phone);
      this.events.emit("contacts:form:changed");
    });

    this.events.on("contacts:form:changed", () => {
      this.updateContactsForm();
    });

    this.events.on("contacts:submit", () => {
      const errors = this.customer.checkValidity();
      const contactErrors = [errors.email, errors.phone].filter(Boolean);

      if (contactErrors.length === 0) {
        this.processOrder();
      } else {
        this.updateContactsForm();
      }
    });

    this.events.on("order:success", () => {
      this.views.modal.close();
    });

    this.events.on("modal:close", () => {
      // Модальное окно закрыто
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
      const card = this.cardCatalogViewFactory.create(() => {
        this.events.emit("product:select", { id: item.id });
      });

      return card.render({
        title: item.title,
        price: item.price,
        category: item.category as TCategoryNames,
        image: CDN_URL + item.image,
      });
    });

    this.views.gallery.items = cards;
  }

  private showProductModal(product: IProduct): void {
    const preview = this.cardPreviewViewFactory.create(() => {
      if (this.basket.hasItem(product.id)) {
        this.events.emit("product:remove", { id: product.id });
      } else {
        this.events.emit("product:add", { id: product.id });
      }
      this.views.modal.close();
    });

    const isInBasket = this.basket.hasItem(product.id);

    const previewElement = preview.render({
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

    this.views.modal.open();
    this.views.modal.content = previewElement;
  }

  private updateBasketModal(): void {
    const items = this.basket.getItems();

    const basketItems = items.map((item, index) => {
      const card = this.cardBasketViewFactory.create(() => {
        this.events.emit("product:remove", { id: item.id });
      });

      return card.render({
        title: item.title,
        price: item.price,
        index: index + 1,
      });
    });

    this.views.basketView.render({
      items: basketItems,
      total: this.basket.getTotalPrice(),
      canCheckout: items.length > 0,
    });
  }

  private showOrderModal(): void {
    this.updateOrderForm();
    const orderElement = this.views.orderFormView.render({});
    this.views.modal.open();
    this.views.modal.content = orderElement;
  }

  private updateOrderForm(): void {
    const customerData = this.customer.getData();
    const errors = this.customer.checkValidity();

    this.views.orderFormView.render({
      payment: customerData.payment,
      address: customerData.address,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(
        (error): error is string => Boolean(error)
      ),
    });
  }

  private showContactsModal(): void {
    this.updateContactsForm();
    const contactsElement = this.views.contactsFormView.render({});
    this.views.modal.open();
    this.views.modal.content = contactsElement;
  }

  private updateContactsForm(): void {
    const customerData = this.customer.getData();
    const errors = this.customer.checkValidity();

    this.views.contactsFormView.render({
      email: customerData.email,
      phone: customerData.phone,
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter((error): error is string =>
        Boolean(error)
      ),
    });
  }

  private updateHeader(): void {
    this.views.header.render({
      count: this.basket.getTotalItems(),
    });
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

      const successElement = this.views.orderSuccessView.render({
        total: this.basket.getTotalPrice(),
      });

      this.views.modal.content = successElement;

      this.basket.clear();
      this.customer.clear();
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      this.events.emit("error", { message: "Не удалось оформить заказ" });
    }
  }
}
