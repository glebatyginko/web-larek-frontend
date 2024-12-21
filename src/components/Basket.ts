import { IEvents } from "./base/events";
import { IBasket } from "../types";
import { IProduct } from "../types";
import { cloneTemplate } from "../utils/utils";
import { Card } from "./Card";

export class Basket {
  protected basketData: IBasket; 
  protected container: HTMLElement;
  protected events: IEvents;
  protected listElement: HTMLUListElement;
  protected totalPriceElement: HTMLElement;
  protected checkoutButton: HTMLButtonElement;
  protected cardTemplate: HTMLTemplateElement;

  constructor(container: HTMLElement, basketData: IBasket, events: IEvents) {
    this.container = container;
    this.basketData = basketData;
    this.events = events;

    this.listElement = this.container.querySelector('.basket__list');
    this.totalPriceElement = this.container.querySelector('.basket__price');
    this.checkoutButton = this.container.querySelector('.basket__button');
    this.cardTemplate = document.querySelector('#card-basket');

    this.checkoutButton.addEventListener('click', this.handleCheckout.bind(this));
    this.events.on('basket:updated', this.renderBasket.bind(this));
  }
  
  createBasketCard(item: IProduct, index: number) {
    const cardElement = cloneTemplate(this.cardTemplate);
    const card = new Card(cardElement, this.events);
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;

    const indexElement = cardElement.querySelector('.basket__item-index');
    indexElement.textContent = (index + 1).toString();

    const deleteButton = cardElement.querySelector('.basket__item-delete');
    deleteButton.addEventListener('click', () => {
      this.basketData.removeItem(item);
    });

    return cardElement;
  }

  renderBasket() {
    this.listElement.innerHTML = '';  
    this.basketData.items.forEach((item, index) => {
      const card = this.createBasketCard(item, index);
      this.listElement.appendChild(card);
    });
    this.updateTotalPrice();  
    return this.container;
  }

  updateTotalPrice() {
    const totalPrice = this.basketData.totalAmount;
    this.totalPriceElement.textContent = totalPrice
      ? `${totalPrice.toLocaleString('ru-RU')} синапсов`
      : '0 синапсов';
  }

  updateButtonState(isInBasket: boolean): void {
    if (isInBasket) {
        this.checkoutButton.removeAttribute('disabled'); 
    } else {
        this.checkoutButton.setAttribute('disabled', 'true'); 
    }
}

  handleCheckout() {
    this.events.emit('basket:checkout', { items: this.basketData.items });
  }
}