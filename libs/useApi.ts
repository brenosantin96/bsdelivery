import { Tenant } from "@/types/Tenant";


//funcao que retorna um objeto.
export const useApi =  () => ({

    getTenant:  (tenantSlug: string): boolean | Tenant => {

        switch (tenantSlug) {
            case 'bsburger':
                return {
                    slug: 'bsburger',
                    name: 'BSBurger',
                    mainColor: '#FF0000',
                    secondColor: '#00FF00'
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



    }

})