import {
	IProduct,
	IOrderData,
	IApi,
	IOrderResponse
} from '../types';
import { ApiListResponse } from './base/api';
export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<ApiListResponse<IProduct>> {
		return this._baseApi
				.get<ApiListResponse<IProduct>>('/product') 
				.then((res: ApiListResponse<IProduct>) => res)
				.catch((error) => {
						console.error('Failed to fetch products:', error);
						throw new Error('Could not fetch products. Please try again.');
				});
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