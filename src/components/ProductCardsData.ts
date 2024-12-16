import { IProduct, IProductsData } from '../types/index';
import { ApiListResponse } from './base/api'; 
import { IEvents } from './base/events';

export class ProductCardsData implements IProductsData {
	protected _products: IProduct[] = [];
	protected _preview: IProduct | null;
	protected _total: number;
	protected events: IEvents;

	constructor(events: IEvents) {
    this.events = events;
    this._products = [];
    this._total = 0;
    this._preview = null;
  }

	get products(): IProduct[] {
		return this._products;
	}

	setProducts(products: IProduct[]) {
    this._products = products;
    this._total = products.length;
    this.events.emit("products:updated", products); 
  }

	get total(): number {
    return this._total;
  }

  get preview(): IProduct | null {
    return this._preview;
  }

  set preview(product: IProduct | null) {
    if (!product) {
      this._preview = null;
      this.events.emit("card:selected", null);
      return;
    }
    this._preview = product;
    this.events.emit("card:selected", product);
  }

  selectProduct(item: IProduct) {
    this.preview = item;
  }
}