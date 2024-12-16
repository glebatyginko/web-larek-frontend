import { EventEmitter } from './components/base/events';
import { ProductCardsData } from './components/ProductCardsData';
import { BasketData } from './components/BasketData';
import './scss/styles.scss';
import { IApi, IOrderData } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { testProduct, testProductItems ,orderData } from './utils/tempConstans';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const productCardsData = new ProductCardsData(events);
const basketData = new BasketData(events);

const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');

const cardsContainer = new CardsContainer(document.querySelector('.gallery'));

events.onAll((event) => {
  console.log(event.eventName, event.data);
})

api
	.getProducts()
	.then((products) => {
		console.log('Products:', products);
	})
	.catch((error) => {
		console.error('Error:', error);
	});


api
	.setOrderInfo(orderData)
	.then((response) => {
		console.log('Order Info:', response);
	})
	.catch((error) => {
		console.error('Error:', error);
	});

const card = new Card(cloneTemplate(cardTemplate), events);
const card1 = new Card(cloneTemplate(cardTemplate), events);
const card2 = new Card(cloneTemplate(cardTemplate), events);
const card3 = new Card(cloneTemplate(cardTemplate), events);
const cardsArray = [];
cardsArray.push(card.render(testProductItems[0]));
cardsArray.push(card1.render(testProductItems[1]));
cardsArray.push(card2.render(testProductItems[2]));
cardsArray.push(card3.render(testProductItems[3]));

cardsContainer.render({catalog: cardsArray})
  
  
  
