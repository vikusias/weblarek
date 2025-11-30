import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog.ts";
import { Basket } from "./components/Models/Basket.ts";
import { Customer } from "./components/Models/Customer.ts";

import { ProductApi } from "./components/Api/ProductApi.ts";
import { Api } from "./components/base/Api.ts";

import { API_URL, eventNames } from "./utils/constants.ts";
import {
  cloneTemplate,
  ensureElement,
  isErrorApiResponse,
} from "./utils/utils.ts";

import { HeaderView } from "./components/views/HeaderView.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { GalleryView } from "./components/views/GalleryView.ts";

import { CardCatalogView } from "./components/views/Card/CardCatalogView.ts";
import { ModalView } from "./components/views/ModalView.ts";
import { CardPreviewView } from "./components/views/Card/CardPreviewView.ts";
import { BasketView } from "./components/views/BasketView.ts";
import { CardBasketView } from "./components/views/Card/CardBasketView.ts";

import { OrderFormView } from "./components/views/Form/OrderFormView.ts";
import { ContactsFormView } from "./components/views/Form/ContactsFormView.ts";
import { OrderSuccessView } from "./components/views/OrderSuccessView.ts";

import { IBuyer, IOrderApiResponse, IProduct } from "./types";

// Инициализация API и событий
const productApi = new ProductApi(new Api(API_URL));
const eventEmitter = new EventEmitter();

// Создание моделей
const catalogModel = new Catalog(eventEmitter);
const basketModel = new Basket(eventEmitter);
const customerModel = new Customer(eventEmitter);

const headerElem = ensureElement<HTMLElement>(".header");
const galleryElem = ensureElement<HTMLElement>(".gallery");
const modalElem = ensureElement<HTMLTemplateElement>("#modal-container");

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const headerView = new HeaderView(headerElem, eventEmitter);
const galleryView = new GalleryView(galleryElem);
const modalView = new ModalView(modalElem);
const basketView = new BasketView(cloneTemplate(basketTemplate), eventEmitter);
const orderFormView = new OrderFormView(
  cloneTemplate<HTMLFormElement>(orderFormTemplate),
  eventEmitter
);
const contactsFormView = new ContactsFormView(
  cloneTemplate<HTMLFormElement>(contactsFormTemplate),
  eventEmitter
);
const orderSuccessView = new OrderSuccessView(
  cloneTemplate<HTMLElement>(successTemplate),
  eventEmitter
);

eventEmitter.on(eventNames.CATALOG_SET_ITEMS, () => {
  const catalogCards: HTMLElement[] = catalogModel
    .getItems()
    .map(renderCardCatalogView);

  galleryView.render({
    items: catalogCards,
  });
});

eventEmitter.on<IProduct>(eventNames.CARD_CATALOG_SELECTED, (item) => {
  catalogModel.setCurrentItem(item);
});

eventEmitter.on(eventNames.CATALOG_SET_CURRENT_ITEM, () => {
  const currentItem: IProduct | null = catalogModel.getCurrentItem();

  if (!currentItem) {
    return;
  }

  modalView.render({
    content: renderCardPreviewView(currentItem),
  });
});

eventEmitter.on(eventNames.BASKET_OPEN, () => {
  modalView.render({
    content: renderBasketView(),
  });
});

eventEmitter.on<IProduct>(eventNames.CARD_BASKET_DELETE_ITEM, (item) => {
  basketModel.deleteItem(item);
});

eventEmitter.on(eventNames.BASKET_CHECKOUT, () => {
  modalView.render({
    content: renderOrderFormView(),
  });
});

eventEmitter.on(eventNames.BASKET_CLEAR, () => {
  renderHeaderView();
});

[eventNames.BASKET_ADD_ITEM, eventNames.BASKET_DELETE_ITEM].forEach(
  (eventName) => {
    eventEmitter.on(eventName, () => {
      renderHeaderView();
      renderBasketView();
    });
  }
);

eventEmitter.on<Pick<IBuyer, "payment">>(
  eventNames.ORDER_FORM_SET_PAYMENT,
  ({ payment }) => {
    customerModel.setPayment(payment);
  }
);

eventEmitter.on<Pick<IBuyer, "address">>(
  eventNames.ORDER_FORM_SET_ADDRESS,
  ({ address }) => {
    customerModel.setAddress(address);
  }
);

[eventNames.CUSTOMER_SET_PAYMENT, eventNames.CUSTOMER_SET_ADDRESS].forEach(
  (eventName) => {
    eventEmitter.on(eventName, () => renderOrderFormView());
  }
);

eventEmitter.on(eventNames.ORDER_FORM_SUBMIT, () => {
  modalView.render({
    content: renderContactsFormView(),
  });
});

eventEmitter.on<Pick<IBuyer, "email">>(
  eventNames.CONTACTS_FORM_SET_EMAIL,
  ({ email }) => {
    customerModel.setEmail(email);
  }
);

eventEmitter.on<Pick<IBuyer, "phone">>(
  eventNames.CONTACTS_FORM_SET_PHONE,
  ({ phone }) => {
    customerModel.setPhone(phone);
  }
);

[eventNames.CUSTOMER_SET_EMAIL, eventNames.CUSTOMER_SET_PHONE].forEach(
  (eventName) => {
    eventEmitter.on(eventName, () => renderContactsFormView());
  }
);

eventEmitter.on(eventNames.ORDER_SUCCESS_CLICK_CLOSE, () => {
  modalView.close();
});

eventEmitter.on(eventNames.CONTACTS_FORM_SUBMIT, async () => {
  try {
    const response = await productApi.order({
      ...customerModel.getData(),
      total: basketModel.getTotalPrice(),
      items: basketModel.getItems().map(({ id }) => id),
    });

    basketModel.clear();
    customerModel.clear();

    modalView.render({
      content: renderOrderSuccessView(response),
    });
  } catch (e: unknown) {
    if (isErrorApiResponse(e)) {
      console.error(e.error);
    } else {
      console.error(e);
    }
  }
});

try {
  const products = await productApi.getProducts();
  catalogModel.setItems(products.items);
} catch (e: unknown) {
  if (isErrorApiResponse(e)) {
    console.error(e.error);
  } else {
    console.error(e);
  }
}

function renderHeaderView(): HTMLElement {
  return headerView.render({
    count: basketModel.getTotalItems(),
  });
}

function renderBasketView(): HTMLElement {
  const basketItems = basketModel.getItems().map(renderCardBasketView);

  return basketView.render({
    items: basketItems,
    total: basketModel.getTotalPrice(),
  });
}

function renderCardBasketView(item: IProduct, index: number): HTMLElement {
  const cardBasketView = new CardBasketView(cloneTemplate(cardBasketTemplate), {
    onClick: () => {
      eventEmitter.emit(eventNames.CARD_BASKET_DELETE_ITEM, item);
    },
  });

  return cardBasketView.render({ ...item, index: index + 1 });
}

function renderCardPreviewView(item: IProduct): HTMLElement {
  const cardPreviewView = new CardPreviewView(
    cloneTemplate<HTMLTemplateElement>(cardPreviewTemplate),
    {
      onClick: () => {
        if (!basketModel.hasItem(item.id)) {
          basketModel.addItem(item);
        } else {
          basketModel.deleteItem(item);
        }

        modalView.close();
      },
    }
  );

  return cardPreviewView.render({
    ...item,
    canBuy: canBuyProduct(item),
    buttonText: getBuyProductButtonText(item),
  });
}

function renderCardCatalogView(item: IProduct): HTMLElement {
  const cardCatalogView = new CardCatalogView(
    cloneTemplate<HTMLTemplateElement>(cardCatalogTemplate),
    {
      onClick: () => {
        eventEmitter.emit(eventNames.CARD_CATALOG_SELECTED, item);
      },
    }
  );

  return cardCatalogView.render(item);
}

function renderOrderFormView(): HTMLElement {
  const { payment, address } = customerModel.getData();
  const { payment: paymentError, address: addressError } =
    customerModel.checkValidity();
  const error: string = paymentError || addressError || "";

  return orderFormView.render({
    payment,
    address,
    error,
  });
}

function renderContactsFormView(): HTMLElement {
  const { email, phone } = customerModel.getData();
  const { email: emailError, phone: phoneError } =
    customerModel.checkValidity();
  const error: string = emailError || phoneError || "";

  return contactsFormView.render({
    email,
    phone,
    error,
  });
}

function renderOrderSuccessView({ total }: IOrderApiResponse) {
  return orderSuccessView.render({
    total,
  });
}

function getBuyProductButtonText({ id, price }: IProduct): string {
  if (price) {
    return basketModel.hasItem(id) ? "Удалить из корзины" : "В корзину";
  }

  return "Недоступно";
}

function canBuyProduct({ price }: IProduct): boolean {
  return !!price;
}
