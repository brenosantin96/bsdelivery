export const useFormatter = () => ({
        formatPrice: (price: number) => {
            return price.toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL'
            })
        },

        formatQuantity: (qt: number, minDigits: number) => {

            if(qt.toString().length >= minDigits) return qt.toString(); //se o tamanho do numero ja for maior que o tamanho do numero de digitos, retorna o proprio numero sem fazer nada
            
            const remain = minDigits - qt.toString().length//para calcular a sobra: qtde minima que preciso menos meu QT //se quero 3 numeros e ja tenho dois, o remain vai ser 1
            return `${'0'.repeat(remain)}${qt}`;


        }
    }
)