//hook para usar o contexto

import { Tenant } from "@/types/Tenant";
import { useContext } from "react"
import { AppContext } from "."
import { Actions } from "./types";

export const useAppContext = () => {
    const { state, dispatch } = useContext(AppContext); //utilizando o contexto, estamos trazendo o state e dispatch do index

    return {
        ...state,
        setTenant: (tenant: Tenant) => {
            dispatch({
                type: Actions.SET_TENANT,
                payload: { tenant }
            })
        }
    }
}