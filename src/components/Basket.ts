import { IEvents } from './base/events';

export class Basket {
	protected container: HTMLElement;
	protected events: IEvents;
	protected listElement: HTMLUListElement;
	protected totalPriceElement: HTMLElement;
	protected checkoutButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;

		this.listElement = this.container.querySelector('.basket__list');
		this.totalPriceElement = this.container.querySelector('.basket__price');
		this.checkoutButton = this.container.querySelector('.basket__button');

		this.checkoutButton.addEventListener(
			'click',
			this.handleCheckout.bind(this)
		);
	}

	renderBasket(items: HTMLElement[], totalAmount: number) {
		this.listElement.innerHTML = '';
		items.forEach((item) => {
			this.listElement.appendChild(item);
		});

		this.updateTotalPrice(totalAmount);
    return this.container; 
	}

	updateTotalPrice(totalAmount: number) {
		this.totalPriceElement.textContent = totalAmount
			? `${totalAmount.toLocaleString('ru-RU')} синапсов`
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
		this.events.emit('basket:checkout');
	}
}
