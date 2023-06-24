import { createContext, useReducer } from 'react';
import { reducer } from './reducer';
import { ContextType, DataType, ProviderType } from './types';

export { useAuthContext } from './hook'; //exportando direto dessde arquivo o hook criado useAppContext do hook


const initialState: DataType = { //criando um initialState, lembrando que as informacoes sao do tipo DATATYPE, que sao a tipagem do ESTADO.
    token: '',
    user: null
}

export const AppContext = createContext<ContextType>({
    state: initialState,
    dispatch: () => { }
})

export const Provider = ({ children }: ProviderType) => {

    const [state, dispatch] = useReducer(reducer, initialState); //manda como parametro o reducer criado e logo o initialState //no reducer é onde possui os action types

    const value = { state, dispatch };
    //jogar o value (state com las informacoes e dispatch, funcao para alterar as informacoes)

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}