import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { IProduct } from "../types";
import { categoryClassMap } from "../utils/constants";
import { Component } from "./base/Component";


export class Card extends Component<IProduct> {
  protected productId: string;
  // cardElement
  protected events: IEvents;
  protected titleName: HTMLElement;
  protected cardDescription?: HTMLElement; 
  protected cardCategory?: HTMLElement;
  protected cardImage?: HTMLImageElement;
  protected cardPrice?: HTMLElement;
  protected addButton?: HTMLButtonElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    // this.cardElement = cloneTemplate(template);
    this.titleName = this.container.querySelector('.card__title');
    this.cardDescription = this.container.querySelector('.card__text');
    this.cardCategory = this.container.querySelector('.card__category');
    this.cardImage = this.container.querySelector('.card__image');
    this.cardPrice = this.container.querySelector('.card__price');
    this.addButton = this.container.querySelector('.card__button');

    if (this.container.classList.contains('gallery__item')) {
      this.container.addEventListener('click', () => 
        this.events.emit('card:click', { id: this.productId })
      );
    }

    if (this.addButton) {
      this.addButton.addEventListener('click', () =>
        this.events.emit('card:addItem', { card: this })
      );
    }
  }

  get id() {
    return this.productId;
  }

  set id(id) {
		this.productId = id;
	}

  set title(name: string) {
    this.titleName.textContent = name;
    if (this.cardImage) {
      this.cardImage.alt = name; 
    }
  }

  set description(description: string) {
    if (this.cardDescription) {
      this.cardDescription.textContent = description;
    }
  }

  set image(image: string) {
    if (this.cardImage) {
      this.cardImage.src = image; 
    }
  }

  set category(category: string) {
    if (this.cardCategory) {
      this.cardCategory.textContent = category;
      this.cardCategory.className = 'card__category';
      const categoryClass = categoryClassMap[category];
      this.cardCategory.classList.add(categoryClass);
    }
  }

  set price(price: number | null) {
    if (price === null) {
      this.cardPrice.textContent = 'Бесценно';
      this.addButton?.setAttribute('disabled', 'true'); 
    } else {
      this.cardPrice.textContent = `${price} синапсов`;
      this.addButton?.removeAttribute('disabled');
    }
  }

  updateButtonState(isInBasket: boolean): void {
    if (isInBasket) {
      this.addButton.textContent = 'Удалить из корзины';
    } else {
      this.addButton.textContent = 'В корзину';
    }
  }

  // render(cardData: Partial<IProduct>) {
  //   Object.assign(this, cardData); 
  //   return this.container;  
  // }
}