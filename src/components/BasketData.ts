import { IBasket, IProduct } from '../types/index';
import { IEvents } from './base/events';

export class BasketData implements IBasket {
	protected _items: IProduct[] = [];
	protected _totalAmount: number | null = null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	get items(): IProduct[] {
		return this._items;
	}

	addItem(product: IProduct): void {
		if (product.price === null) {
			console.log('Бесценный товар не может быть добавлен в корзину.');
			return;
		}
		this._items.push(product);
		this.updateTotalAmount();
		this.events.emit('basket:updated', {
			items: this._items,
			totalAmount: this._totalAmount,
		});
	}

	removeItem(product: IProduct): void {
		this._items = this._items.filter((item) => item.id !== product.id);
		this.updateTotalAmount();
		this.events.emit('basket:updated', {
			items: this._items,
			totalAmount: this._totalAmount,
		});
	}

	updateTotalAmount(): void {
		this._totalAmount =
			this._items.reduce((sum, item) => sum + item.price, 0) || null;
	}

	get totalAmount(): number | null {
		return this._totalAmount;
	}

	getItemCount(): number {
		return this._items.length;
	}

	clearBasket(): void {
		this._items = [];
		this._totalAmount = null;
	}
}
