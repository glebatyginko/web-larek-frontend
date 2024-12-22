import { Form } from './Form';
import { IEvents } from './base/events';

export class ContactForm extends Form {
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
	}

	protected updateFormValidity() {
		let allInputsValid = true;
		let errorMessage = '';

		Array.from(this.inputs).forEach((input) => {
			if (input.name === 'email' && input.value.trim().length === 0) {
				errorMessage = 'Email должен быть заполнен';
				allInputsValid = false;
			} else if (input.name === 'phone' && input.value.trim().length === 0) {
				errorMessage = 'Телефон должен быть заполнен';
				allInputsValid = false;
			}
		});

		this.error = errorMessage;
		this.valid = allInputsValid;

		if (this.submitButton) {
			this.submitButton.disabled = !this.valid;
		}
	}
}
