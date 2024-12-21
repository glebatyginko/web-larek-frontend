import { IEvents } from './base/events';
import { ICheckoutForm } from '../types/index';
import { Component } from './base/Component';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	errorsContainer: HTMLElement;
}

export class Form extends Component<IForm> {
	protected container: HTMLFormElement;
	protected events: IEvents;
	protected inputs: NodeListOf<HTMLInputElement>;
	protected paymentButtons: NodeListOf<HTMLButtonElement>;
	protected _form: HTMLFormElement;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected errorsContainer: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.errorsContainer = this.container.querySelector('.form__errors');

		this.inputs = this.container.querySelectorAll('input[name]');
		this.paymentButtons = this.container.querySelectorAll(
			'button[name="card"], button[name="cash"]'
		);

		this._form = this.container;
		this.formName = this.container.getAttribute('name');
		this.submitButton = this.container.querySelector('[type="submit"]');

		this.initEventListeners();
	}

	set error(message: string) {
		this.errorsContainer.textContent = message || '';
	}

	set valid(isValid: boolean) {
		if (isValid) {
			this.submitButton.removeAttribute('disabled');
		} else {
			this.submitButton.setAttribute('disabled', 'true');
		}
	}

	protected initEventListeners() {
		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});

		this.inputs.forEach((input) => {
			input.addEventListener('input', () => {
				this.updateFormValidity();
			});
		});

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', (evt) => {
				this.handleButtonClick(evt);
				this.updateFormValidity();
			});
		});
	}

	protected updateFormValidity() {
		let allInputsValid = true;
		let errorMessage = '';

		Array.from(this.inputs).forEach((input) => {
			const value = input.value.trim();
			if (input.name === 'address' && value.length === 0) {
				errorMessage = 'Адрес должен быть заполнен';
				allInputsValid = false;
			} else if (input.name === 'email' && value.length === 0) {
				errorMessage = 'Email должен быть заполнен';
				allInputsValid = false;
			} else if (input.name === 'phone' && value.length === 0) {
				errorMessage = 'Телефон должен быть заполнен';
				allInputsValid = false;
			}
		});

		const paymentSelected =
			this.formName !== 'contacts' &&
			Array.from(this.paymentButtons).some((button) =>
				button.classList.contains('button_alt-active')
			);

		if (this.formName === 'order' && !paymentSelected) {
			errorMessage = 'Пожалуйста, выберите способ оплаты';
			allInputsValid = false;
		}

		if (!allInputsValid) {
			this.error = errorMessage;
		} else {
			this.error = '';
		}

		if (this.formName === 'order') {
			this.valid = allInputsValid && paymentSelected;
		} else {
			this.valid = allInputsValid;
		}
	}

	protected handleButtonClick(evt: MouseEvent) {
		const target = evt.currentTarget as HTMLButtonElement;

		if (!target) return;

		this.paymentButtons.forEach((button) => {
			button.classList.remove('button_alt-active');
		});

		target.classList.add('button_alt-active');

		this.events.emit(`${this.formName}:buttonClick`, {
			field: target.name,
			value: target.name,
		});
	}

	protected getInputValues() {
		const valuesObject: Record<string, string> = {};

		this.inputs.forEach((input) => {
			valuesObject[input.name] = input.value;
		});

		const activePaymentButton = Array.from(this.paymentButtons).find((button) =>
			button.classList.contains('button_alt-active')
		);
		if (activePaymentButton) {
			valuesObject['payment'] = activePaymentButton.name;
		}

		return valuesObject;
	}

	getContainer(): HTMLElement {
		return this.container;
	}

	reset() {
		this._form.reset();
		this.error = '';
		this.paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);
		this.valid = false;
	}
}