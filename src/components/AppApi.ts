import {
	IProduct,
	IOrderData,
	IApi,
	IOrderResponse
} from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<IProduct[]> {
		return this._baseApi
			.get<IProduct[]>('/product')
			.then((products: IProduct[]) => products);
	}

	setOrderInfo(data: IOrderData): Promise<IOrderResponse> {
		return this._baseApi
			.post<IOrderResponse>('/order', data, 'POST')
			.then((res: IOrderResponse) => res)
			.catch((error) => {
				console.error('Failed to set order info:', error);
				throw new Error('Could not complete the order. Please try again.');
			});
	}
}
