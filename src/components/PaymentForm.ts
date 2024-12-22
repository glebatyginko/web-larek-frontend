import { Form } from './Form';
import { IEvents } from './base/events';

export class PaymentForm extends Form {
	protected paymentButtons: NodeListOf<HTMLButtonElement>;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.paymentButtons = this.container.querySelectorAll(
			'button[name="card"], button[name="cash"]'
		);

		this.initPaymentButtonListeners();
	}

	protected getInputValues() {
		const valuesObject = super.getInputValues();

		const activePaymentButton = Array.from(this.paymentButtons).find((button) =>
			button.classList.contains('button_alt-active')
		);

		if (activePaymentButton) {
			valuesObject['payment'] = activePaymentButton.name;
		}

		return valuesObject;
	}

	protected initPaymentButtonListeners() {
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', (evt) => {
				this.handlePaymentButtonClick(evt);
				this.getInputValues();
			});
		});
	}

	protected handlePaymentButtonClick(evt: MouseEvent) {
		const target = evt.currentTarget as HTMLButtonElement;
		if (!target) return;

		this.paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);
		target.classList.add('button_alt-active');

		this.inputValues = this.getInputValues();
		this.updateFormValidity();
	}

	protected updateFormValidity() {
		let allInputsValid = true;
		let errorMessage = '';

		Array.from(this.inputs).forEach((input) => {
			if (input.name === 'address' && input.value.trim().length === 0) {
				errorMessage = 'Адрес должен быть заполнен';
				allInputsValid = false;
			}
		});

		const paymentSelected = Array.from(this.paymentButtons).some((button) =>
			button.classList.contains('button_alt-active')
		);

		if (!paymentSelected) {
			errorMessage = 'Пожалуйста, выберите способ оплаты';
			allInputsValid = false;
		}

		this.error = errorMessage;
		this.valid = allInputsValid && paymentSelected;

		if (this.submitButton) {
			this.submitButton.disabled = !this.valid;
		}
	}
}
