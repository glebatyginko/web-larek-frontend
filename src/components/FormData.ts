import {
	TPayment,
	TPaymentFormInfo,
	TContactFormInfo,
	ICheckoutForm,
	IOrderData,
} from '../types/index';
import { IEvents } from './base/events';
import { isEmpty } from '../utils/utils';

export class FormData implements ICheckoutForm {
	payment: TPayment | null = null;
  email: string;
  phone: string;
	address: string;
	total: number | null = null;
	items: string[] = [];
	protected events: IEvents;

	constructor(events: IEvents, items: string[], totalAmount: number | null) {
		this.events = events;
		this.items = items;
		this.total = totalAmount;
	}

	paymentAndAddressInfoValid(data: TPaymentFormInfo): boolean {
		const { payment, address } = data;
		const isValid =
			!isEmpty(payment) && address.trim().length > 0;
		if (!isValid) {
			this.events.emit('form:stepOneInvalid', data);
		}
		return isValid;
	}

	contactInfoValid(data: TContactFormInfo): boolean {
		const { email, phone } = data;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+?\d{10,15}$/;
		const isValid =
			emailRegex.test(email) &&
			phoneRegex.test(phone) &&
			!isEmpty(email) &&
			!isEmpty(phone);
		if (!isValid) {
			this.events.emit('form:stepTwoInvalid', data);
		}
		return isValid;
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
		const isStepOneValid = this.paymentAndAddressInfoValid({
			payment: this.payment,
			address: this.address,
		});
		const isStepTwoValid = this.contactInfoValid({
			email: this.email,
			phone: this.phone,
		});

		if (!isStepOneValid || !isStepTwoValid) {
			throw new Error('Order creation failed due to invalid data.');
		}

    if (this.total === 0) {
      throw new Error('Order cannot be created: total cost is zero.');
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
		this.clearForm();
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
