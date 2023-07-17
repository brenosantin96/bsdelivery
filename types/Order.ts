import { Address } from "./Address";
import { CartItem } from "./CartItem";

export type Order = {
    id: number;
    status: 'preparing' | 'sent' | 'delivered';
    orderDate: string; //9999-MM-DD
    userid: string;
    shippingAddress: Address;
    shippingPrice: number;
    paymentTipe: 'money' | 'card';
    paymentChange?: number;
    cupom?: string;
    cupomDiscount? : number;
    products: CartItem[];
    subTotal: number;
    total: number;
}