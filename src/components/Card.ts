import { IEvents } from './base/events';
import { IProduct } from '../types';
import { categoryClassMap } from '../utils/constants';
import { Component } from './base/Component';
import { CDN_URL } from '../utils/constants';

export class Card extends Component<IProduct> {
	protected productId: string;
	protected events: IEvents;
	protected titleName: HTMLElement;
	protected cardDescription?: HTMLElement;
	protected cardCategory?: HTMLElement;
	protected cardImage?: HTMLImageElement;
	protected cardPrice?: HTMLElement;
	protected actionButton?: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.titleName = this.container.querySelector('.card__title');
		this.cardDescription = this.container.querySelector('.card__text');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardPrice = this.container.querySelector('.card__price');
		this.actionButton = this.container.querySelector('.card__button');

		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () => {
				const cardData = { id: this.productId };
				this.events.emit('card:click', { card: cardData });
			});
		}

		if (this.actionButton) {
			this.actionButton.addEventListener('click', () => {
				const cardData = { id: this.productId };
				this.events.emit('card:add', { card: cardData });
			});
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
			this.cardImage.src = `${CDN_URL}${image}`;
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
			this.actionButton?.setAttribute('disabled', 'true');
		} else {
			let formattedPrice: string;

			if (price >= 10000) {
				formattedPrice = price.toLocaleString('ru-RU');
			} else {
				formattedPrice = price.toString();
			}

			this.cardPrice.textContent = `${formattedPrice} синапсов`;
			this.actionButton?.removeAttribute('disabled');
		}
	}

	updateButtonState(isInBasket: boolean): void {
		if (isInBasket) {
			this.actionButton.textContent = 'Удалить из корзины';
		} else {
			this.actionButton.textContent = 'В корзину';
		}
	}
}
