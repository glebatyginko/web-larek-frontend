import { EventEmitter } from './components/base/events';
import { ProductCardsData } from './components/ProductCardsData';
import { BasketData } from './components/BasketData';
import './scss/styles.scss';
import { IApi } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from './utils/utils';
import { FormData } from './components/FormData';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Page } from './components/Page';
import { IProduct } from './types';
import { IOrderData } from './types';
import { TPaymentFormInfo } from './types';
import { TContactFormInfo } from './types';
import { OrderSuccess } from './components/OrderSuccess';

import { PaymentForm } from './components/PaymentForm';
import { ContactForm } from './components/ContactForm';
import { BasketItem } from './components/BasketItem';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const pageContainer: HTMLElement = document.querySelector('.page');

const cardBasketTemplate: HTMLTemplateElement =
	document.querySelector('#card-basket');
const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const orderFormTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsFormTemplate: HTMLTemplateElement =
	document.querySelector('#contacts');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const basketData = new BasketData(events);
const formData = new FormData(events);
const productCardsData = new ProductCardsData(events);

const page = new Page(pageContainer, events);
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const modal = new Modal(document.querySelector('#modal-container'), events);
const orderForm = new PaymentForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactForm(
	cloneTemplate(contactsFormTemplate),
	events
);
const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

const success = new OrderSuccess(cloneTemplate(successTemplate), events);

function renderBasketItems(
	basketData: BasketData,
	cardBasketTemplate: HTMLTemplateElement,
	events: EventEmitter
): HTMLElement[] {
	return basketData.items.map((item, index) => {
		const basketItemElement = cloneTemplate(cardBasketTemplate);
		const basketItem = new BasketItem(basketItemElement, events);

		basketItem.id = item.id;
		basketItem.title = item.title;
		basketItem.price = item.price;
		basketItem.index = index;

		return basketItemElement;
	});
}

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

api
	.getProducts()
	.then((response) => {
		productCardsData.setProducts(response.items);
	})
	.catch((error) => console.error('Failed to fetch products:', error));

events.on('products:updated', () => {
	const productsArray = productCardsData.products.map((product) => {
		const productInstant = new Card(cloneTemplate(cardCatalogTemplate), events);
		return productInstant.render(product);
	});

	cardsContainer.render({ catalog: productsArray });
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:click', (data: { card: { id: string } }) => {
	const { card } = data;
	const isInBasket = basketData.items.some((item) => item.id === card.id);
	if (isInBasket) {
		cardPreview.updateButtonState(true);
	} else {
		cardPreview.updateButtonState(false);
	}
	const selectedProduct = productCardsData.getProduct(card.id);
	modal.setContent(cardPreview.render(selectedProduct));
	modal.open();
});

events.on('cardActionButton:click', (data: { card: { id: string } }) => {
	const { card } = data;
	const selectedProduct = productCardsData.getProduct(card.id);
	if (!selectedProduct) {
		console.log('Продукт не найден');
		return;
	}

	const isInBasket = basketData.items.some((item) => item.id === card.id);

	if (isInBasket) {
		basketData.removeItem(selectedProduct);
		cardPreview.updateButtonState(false);
	} else {
		basketData.addItem(selectedProduct);
		cardPreview.updateButtonState(true);
	}
});

events.on('basket:open', (page: Page) => {
	page.locked = true;
	const basketItems = renderBasketItems(basketData, cardBasketTemplate, events);
	const basketElement = basket.renderBasket(
		basketItems,
		basketData.totalAmount
	);

	modal.setContent(basketElement);
	basket.updateButtonState(basketData.items.length > 0);
	modal.open();
});

events.on('basket:item-remove', (data: { card: { id: string } }) => {
	const { card } = data;
	const itemToRemove = basketData.items.find((item) => item.id === card.id);

	if (itemToRemove) {
		basketData.removeItem(itemToRemove);
	}

	const basketItems = renderBasketItems(basketData, cardBasketTemplate, events);
	const basketElement = basket.renderBasket(
		basketItems,
		basketData.totalAmount
	);

	modal.setContent(basketElement);
	basket.updateButtonState(basketData.items.length > 0);
});

events.on('basket:updated', (data: { items: IProduct[] }) => {
	const itemCount = data.items.length;

	if (itemCount > 0) {
		basket.updateButtonState(true);
	} else {
		basket.updateButtonState(false);
	}

	page.setCounter(itemCount);
});

events.on('basket:checkout', () => {
	const items = basketData.items.map((item) => item.id);
	const totalAmount = basketData.totalAmount;

	if (!items.length || totalAmount === null) {
		console.error('Basket is empty or invalid. Cannot proceed.');
		return;
	}

	formData.updateTotalAndItems(totalAmount, items);
	modal.setContent(orderForm.getContainer());
});

events.on('order:submit', (data: TPaymentFormInfo) => {
	formData.updatePaymentAndAddressInfo('payment', data.payment);
	formData.updatePaymentAndAddressInfo('address', data.address);
	modal.setContent(contactsForm.getContainer());
});

events.on('contacts:submit', (data: TContactFormInfo) => {
	formData.updateContactInfo('email', data.email);
	formData.updateContactInfo('phone', data.phone);
	events.emit('order:createData');
});

events.on('order:createData', () => {
	formData.createOrderData();
});

events.on('form:orderCreated', (data: IOrderData) => {
	api
		.setOrderInfo(data)
		.then((response) => {
			console.log('Order successfully placed:', response);
			basketData.clearBasket();
			formData.clearForm();
			const newItemCount = 0;
			page.setCounter(newItemCount);
			modal.setContent(success.getContainer());
			success.updateOrderSuccess(data.total);
		})
		.catch((error) => {
			console.error('Error placing order:', error);
		});
});

events.on('order:closeSuccess', () => {
	modal.close();
});
