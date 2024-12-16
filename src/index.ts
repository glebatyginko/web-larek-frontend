import { EventEmitter } from './components/base/events';
import { ProductCardsData } from './components/ProductCardsData';
import { BasketData } from './components/BasketData';
import './scss/styles.scss';
import { IApi } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { orderData } from './utils/tempConstans';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from './utils/utils';
import { IProduct } from './types';

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
	.setOrderInfo(orderData)
	.then((response) => {
		console.log('Order Info:', response);
	})
	.catch((error) => {
		console.error('Error:', error);
	});

api
	.getProducts()
	.then((response) => {
    productCardsData.setProducts(response.items);
  })
  .catch((error) => console.error('Failed to fetch products:', error));
 
  events.on('products:updated', () => {
    const productsArray = productCardsData.products.map((product) => {
      const productInstant = new Card(cloneTemplate(cardTemplate), events);
      return productInstant.render(product);
    });

    cardsContainer.render({ catalog: productsArray });
  });
 
  
