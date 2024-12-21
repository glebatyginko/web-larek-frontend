import { IEvents } from "./base/events";

export class OrderSuccess {
  protected closeButton: HTMLButtonElement;
  protected orderSuccessTitle: HTMLElement;
  protected orderSuccessDescription: HTMLElement;
  protected events: IEvents;

  constructor(protected container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;
    this.closeButton = this.container.querySelector('.order-success__close');
    this.orderSuccessTitle = this.container.querySelector('.order-success__title');
    this.orderSuccessDescription = this.container.querySelector('.order-success__description');

    this.closeButton.addEventListener('click', () => {
      this.events.emit('order:closeSuccess');
    });
  }

  updateOrderSuccess(totalAmount: number): void {
    this.orderSuccessDescription.textContent = `Списано ${totalAmount} синапсов`;
  }

  getContainer(): HTMLElement {
		return this.container;
	}
}
