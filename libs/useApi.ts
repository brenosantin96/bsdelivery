export type getTenantResponse = {
    name: string,
    mainColor: string,
    secondColor: string
}


//funcao que retorna um objeto.
export const useApi =  () => ({

    getTenant:  (tenantSlug: string): boolean | getTenantResponse => {

        switch (tenantSlug) {
            case 'bsburger':
                return {
                    name: 'BSBurger',
                    mainColor: '#FF0000',
                    secondColor: '#00FF00'
                }

                break;

            case 'bspizza':
                return {
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