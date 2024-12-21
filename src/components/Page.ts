import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	counter: number;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _pageWrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._pageWrapper = this.container.querySelector('.page__wrapper');
		this._basket = this.container.querySelector('.header__basket');
		this._counter = this.container.querySelector('.header__basket-counter');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open', this);
		});
	}

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}

	setCounter(value: number): void {
		this._counter.textContent = String(value);
	}
}
