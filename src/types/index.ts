export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null; 
}

export interface ICustomer {
  paymentMethod: TPayment;
  deliveryAddress: string; 
  email: string; 
  phone: string;
}

export interface IProductsData {
  products: TMainProductCardInfo[];
  preview: IProduct;
  selectProduct(item: IProduct): void;
}

export interface IBasket {
  items: TBasketInfo[]; 
  totalAmount: number | null; 
  addItem(product: IProduct): void; 
  removeItem(product: IProduct): void; 
  getItemCount(): number; 
  getTotalAmount(): number; 
  clearBasket(): void; 
}

export interface ICheckoutForm {
  paymentMethod: TPayment | null; 
  deliveryAddress: string; 
  email: string; 
  phone: string; 
  items: TBasketInfo[]; 
  totalAmount: number | null; 
  paymentAndAddressInfoValid(data: TPaymentFormInfo): boolean;
  contactInfoValid(data: TContactFormInfo): boolean;
  updatePaymentAndAddressInfo(
    field: keyof TPaymentFormInfo, 
    value: string | TPayment
  ): void;
  updateContactInfo(
    field: keyof TContactFormInfo, 
    value: string
  ): void;
  createOrderData(): object;
}


export type TPayment = 'cash' | 'card';

export type TMainProductCardInfo = Pick<IProduct, 'id' | 'image' | 'title' | 'category' | 'price'>;

export type TBasketInfo = Pick<IProduct, 'title' | 'price'>;

export type TPaymentFormInfo = Pick<ICustomer, 'paymentMethod' | 'deliveryAddress'>;

export type TContactFormInfo = Pick<ICustomer, 'email' | 'phone'>;
