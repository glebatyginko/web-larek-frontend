export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface ICustomer {
  paymentMethod: 'card' | 'cash';
  deliveryAddress: string; 
  email: string; 
  phone: string;
}

export interface IProductsData {
  products: IProduct[];
  preview: string | null;
}

type TMainProductCardInfo = Pick<IProduct, 'id' | 'image' | 'title' | 'category' | 'price'>;
type TBasketInfo = Pick<IProduct, 'title' | 'price'>;
type TPaymentFormInfo = Pick<ICustomer, 'paymentMethod' | 'deliveryAddress'>;
type TContactFormInfo = Pick<ICustomer, 'email' | 'phone'>;
