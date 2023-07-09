//hook para usar o contexto

import { Address } from "@/types/Address";
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
        },

        setShippingAddress: (shippingAddress : Address) => {
            dispatch({
                type: Actions.SET_SHIPPING_ADDRESS,
                payload: {shippingAddress}
            })
        },

        setShippingPrice: (shippingPrice : number) => {
            dispatch({
                type: Actions.SET_SHIPPING_PRICE,
                payload: {shippingPrice}
            })
        },
    }
}