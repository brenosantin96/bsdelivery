//hook para usar o contexto
import { User } from "@/types/User";
import { useContext } from "react"
import { AppContext } from "."
import { Actions } from "./types";

export const useAuthContext = () => {
    const { state, dispatch } = useContext(AppContext); //utilizando o contexto, estamos trazendo o state e dispatch do index

    return {
        ...state,
        setToken: (token: string) => {
            dispatch({
                type: Actions.SET_TOKEN,
                payload: { token } //payload é um objeto, reotnrando um objeto com o novo token
            });
        },
        setUser: (user: User | null) => {
            dispatch({
                type: Actions.SET_USER,
                payload: { user } //payload é um objeto, reotnrando um objeto com o novo token
            });
        },
    }
}