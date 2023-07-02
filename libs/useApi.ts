import { CartItem } from "@/types/CartItem";
import { Product } from "@/types/Product";
import { Tenant } from "@/types/Tenant";
import { User } from "@/types/User";

const TEMPORARYoneProduct: Product = {
    id: 1,
    image: '/tmp/burgerpng.png',
    categoryName: 'Tradicional',
    name: 'Texas Burger',
    price: 25.50,
    description: '2 blends de carne de 150g, Queijo Cheddar, Bacon caramelizado, Salada, Molho da casa, Pão brioche artesanal'
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
    }

})