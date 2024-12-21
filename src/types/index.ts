export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderData {
	payment: TPayment | string;
	email: string;
	phone: string;
	address: string;
	total: number | null;
	items: string[];
}

export interface IProductsData {
	products: IProduct[];
	preview: IProduct;
	total: number;
	setProducts(products: IProduct[]): void;
	selectProduct(item: IProduct): void;
}

export interface IBasket {
	items: IProduct[];
	totalAmount: number | null;
	addItem(product: IProduct): void;
	removeItem(product: IProduct): void;
	getItemCount(): number;
	updateTotalAmount(): void;
	clearBasket(): void;
}

export interface ICheckoutForm {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number | null;
	items: string[];
	updatePaymentAndAddressInfo(
		field: keyof TPaymentFormInfo,
		value: string | TPayment
	): void;
	updateContactInfo(field: keyof TContactFormInfo, value: string): void;
	createOrderData(): object;
	clearForm(): void;
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export type TPayment = 'cash' | 'card';

export type TMainProductCardInfo = Pick<
	IProduct,
	'id' | 'image' | 'title' | 'category' | 'price'
>;

export type TBasketInfo = Pick<IProduct, 'title' | 'price'>;

export type TPaymentFormInfo = Pick<IOrderData, 'payment' | 'address'>;

export type TContactFormInfo = Pick<IOrderData, 'email' | 'phone'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
