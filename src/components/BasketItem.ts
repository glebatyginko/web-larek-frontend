import { IEvents } from './base/events';
import { IProduct } from '../types';
import { Component } from './base/Component';

export class BasketItem extends Component<IProduct> {
	protected productId: string;
	protected events: IEvents;
	protected titleName: HTMLElement;
	protected cardPrice: HTMLElement;
	protected deleteButton: HTMLButtonElement;
	protected indexElement: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.titleName = this.container.querySelector('.card__title');
		this.cardPrice = this.container.querySelector('.card__price');
		this.deleteButton = this.container.querySelector('.basket__item-delete');
		this.indexElement = this.container.querySelector('.basket__item-index');

		this.deleteButton.addEventListener('click', () => {
			const cardData = { id: this.productId };
			this.events.emit('basket:item-remove', { card: cardData });
		});
	}

	get id() {
		return this.productId;
	}

	set id(id: string) {
		this.productId = id;
	}

	set title(name: string) {
		this.titleName.textContent = name;
	}

	set price(price: number | null) {
		let formattedPrice: string;

		if (price >= 10000) {
			formattedPrice = price.toLocaleString('ru-RU');
		} else {
			formattedPrice = price.toString();
		}

		this.cardPrice.textContent = `${formattedPrice} синапсов`;
	}

	set index(index: number) {
		this.indexElement.textContent = (index + 1).toString();
	}
}
