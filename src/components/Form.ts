import { IEvents } from './base/events';
import { Component } from './base/Component';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	errorsContainer: HTMLElement;
}

export abstract class Form extends Component<IForm> {
	protected events: IEvents;
	protected inputs: NodeListOf<HTMLInputElement>;
	protected submitButton: HTMLButtonElement;
	protected formName: string;

	protected valid: boolean;
	protected inputValues: Record<string, string>;
	protected errorsContainer: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.inputs = this.container.querySelectorAll('input[name]');
		this.submitButton = this.container.querySelector('[type="submit"]');
		this.errorsContainer = this.container.querySelector('.form__errors');
		this.formName = this.container.getAttribute('name');

		this.valid = false;
		this.initEventListeners();
	}

	protected initEventListeners() {
		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.inputValues);
		});

		this.inputs.forEach((input) => {
			input.addEventListener('input', () => {
				this.inputValues = this.getInputValues();
				this.updateFormValidity();
			});
		});
	}

	protected abstract updateFormValidity(): void;

	protected getInputValues() {
		const valuesObject: Record<string, string> = {};

		this.inputs.forEach((input) => {
			valuesObject[input.name] = input.value;
		});

		return valuesObject;
	}

	set error(message: string) {
		this.errorsContainer.textContent = message || '';
	}

	set isValid(isValid: boolean) {
		this.valid = isValid;
		if (isValid) {
			this.submitButton.removeAttribute('disabled');
		} else {
			this.submitButton.setAttribute('disabled', 'true');
		}
	}

	getContainer(): HTMLElement {
		return this.container;
	}
}
