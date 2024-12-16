import { IProduct, IProductsData } from '../types/index';
import { IEvents } from './base/events';

export class ProductCardsData implements IProductsData {
	protected _products: IProduct[];
	protected _preview: IProduct | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	get products(): IProduct[] {
		return this._products;
	}

	set products(products: IProduct[]) {
		this._products = products;
	}

	get preview(): IProduct | null {
		return this._preview;
	}

	set preview(product: IProduct | null) {
		if (!product) {
			this._preview = null;
			this.events.emit('card:selected', null);
			return;
		}
		this._preview = product;
		this.events.emit('card:selected', product);  
	}

	selectProduct(item: IProduct): void {
		this.preview = item;
	}
}
