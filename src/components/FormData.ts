import {
	TPayment,
	TPaymentFormInfo,
	TContactFormInfo,
	ICheckoutForm,
	IOrderData,
} from '../types/index';
import { IEvents } from './base/events';

export class FormData implements ICheckoutForm {
	payment: TPayment | null = null;
	email: string;
	phone: string;
	address: string;
	total: number | null = null;
	items: string[] = [];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	updateTotalAndItems(totalAmount: number | null, items: string[]): void {
		this.total = totalAmount;
		this.items = items;
		this.events.emit('form:totalAndItemsUpdated', { totalAmount, items });
	}

	updatePaymentAndAddressInfo(
		field: keyof TPaymentFormInfo,
		value: string | TPayment
	): void {
		if (field === 'payment' && typeof value === 'string') {
			this.payment = value as TPayment;
		} else if (field === 'address') {
			this.address = value as string;
		}
		this.events.emit('form:paymentAddressUpdated', { field, value });
	}

	updateContactInfo(field: keyof TContactFormInfo, value: string): void {
		if (field === 'email') {
			this.email = value;
		} else if (field === 'phone') {
			this.phone = value;
		}
		this.events.emit('form:contactUpdated', { field, value });
	}

	createOrderData(): IOrderData {
		if (this.total === 0 || this.total === null) {
			throw new Error('Order cannot be created: total cost is zero or null.');
		}

		const orderData: IOrderData = {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};

		this.events.emit('form:orderCreated', orderData);
		return orderData;
	}

	clearForm(): void {
		this.payment = null;
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = null;
		this.items = [];
		this.events.emit('form:cleared');
	}
}
