import { CartItem } from "@/types/CartItem";
import { Product } from "@/types/Product";
import { Tenant } from "@/types/Tenant";
import { User } from "@/types/User";
import { Address } from "@/types/Address";
import { Order } from "@/types/Order";

const TEMPORARYoneProduct: Product = {
    id: 1,
    image: '/tmp/burgerpng.png',
    categoryName: 'Tradicional',
    name: 'Texas Burger',
    price: 25.50,
    description: '2 blends de carne de 150g, Queijo Cheddar, Bacon caramelizado, Salada, Molho da casa, Pão brioche artesanal'
}

const TEMPORARYorder: Order = {
    id: 123,
    status: 'preparing',
    orderDate: '2023-07-17',
    userid: '123',
    shippingAddress: {
        id: 2,
        street: 'Rua das flores',
        number: '200',
        cep: '58433001',
        city: 'São Paulo',
        neighborhood: 'Jardins',
        state: 'SP'
    },
    shippingPrice: 9.14,
    paymentTipe: 'card',
    cupom: 'ABC',
    cupomDiscount: 14.3,
    products: [
        { product: { ...TEMPORARYoneProduct, id: 1 }, qt: 1 },
        { product: { ...TEMPORARYoneProduct, id: 2 }, qt: 2 },
        { product: { ...TEMPORARYoneProduct, id: 3 }, qt: 1 },
    ],
    subTotal: 204,
    total: 198.84
}



//funcao que retorna um objeto.
//hook que se instancia em index const api = useApi();
//se pode pegar todas funcoes do hook, ex: api.getTenant()  
export const useApi = (tenantSlug: string) => ({

    getTenant: async () => {

        switch (tenantSlug) {
            case 'bsburger':
                return {
                    slug: 'bsburger',
                    name: 'BSBurger',
                    mainColor: '#FF9400',
                    secondColor: '#FFF8F2'
                }

                break;

            case 'bspizza':
                return {
                    slug: 'bspizza',
                    name: 'BSPizza',
                    mainColor: '#0000FF',
                    secondColor: '#FF0000'
                }
                break;

            default:
                return false
                break;
        }



    },

    getAllProducts: async () => {
        let products = [];

        for (let q = 0; q < 10; q++) {
            products.push({
                ...TEMPORARYoneProduct,
                id: q + 1
            });
        }

        return products;
    },

    getOneProduct: async (id: number) => {
        return { ...TEMPORARYoneProduct, id };
    },

    authorizeToken: async (token: string): Promise<User | false> => {
        if (!token) return false;

        return {
            name: 'Breno',
            email: 'breno@gmail.com'
        }
    },

    getCartProducts: async (cartCookie: string) => {
        let cart: CartItem[] = [];
        if (!cartCookie) return cart;

        const cartJson = JSON.parse(cartCookie);

        for (let i in cartJson) {
            if (cartJson[i].id && cartJson[i].qt) {
                const product = {
                    ...TEMPORARYoneProduct,
                    id: cartJson[i].id
                };
                cart.push({
                    qt: cartJson[i].qt,
                    product
                })
            }
        }

        return cart;
    },

    addUserAddress: async (address: Address) => {
        console.log(address)
        return { ...address, id: 9 };
    },

    editUserAddress: async (NewAddressData: Address) => {
        return true;
    },

    deleteUserAddress: async (addressid: number) => {
        return true;
    },

    getUserAddresses: async (email: string) => {
        const addresses: Address[] = [];

        for (let i = 0; i < 4; i++) {
            addresses.push({
                id: i + 1,
                street: 'Rua das Flores',
                number: `${i + 1}00`,
                cep: '38701-601',
                city: 'Patos de Minas',
                neighborhood: "Alvorada",
                state: 'MG'
            })
        }

        return addresses;
    },

    getUserAddress: async (addressid: number) => {
        let address: Address = {
            id: addressid,
            street: 'Rua das Flores',
            number: `${addressid}00`,
            cep: '38701-601',
            city: 'Patos de Minas',
            neighborhood: "Alvorada",
            state: 'MG'
        };

        return address;
    },

    getShippingPrice: async (address: Address) => {
        return 9.16;
    },

    setOrder: async (shippingAddress: Address, paymentType: 'money' | 'card', paymentChange: number, cupom: string, cart: CartItem[]) => {
        return TEMPORARYorder;
    },

    getOrder: async (id: number) => {
        return TEMPORARYorder;
    }

})