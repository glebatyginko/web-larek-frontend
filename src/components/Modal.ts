import { IEvents } from "./base/events";

export class Modal {
  protected container: HTMLElement;
  protected content: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;
    this.content = this.container.querySelector('.modal__content');
    const modalCloseButton = this.container.querySelector('.modal__close');
    
    modalCloseButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  setContent(content: HTMLElement): void {
    const modalContent = this.container.querySelector('.modal__content');
    modalContent.innerHTML = '';
    modalContent.appendChild(content as HTMLElement);
  }
}