import { Address } from "@/types/Address";
import { Tenant } from "@/types/Tenant";
import React, { Dispatch } from "react";

export type DataType = {
    tenant: Tenant | null;
    shippingAddress: Address | null;
    shippingPrice : number;

}

export type ActionType = {
    type: Actions,
    payload?: any;
}

export type ContextType = {
    state: DataType; //no contexto o state vai ser as informacoes do state
    dispatch: Dispatch<ActionType>; //colocar actions e payload, no caso quem tem essa informacao é o ActionType
}

export type ProviderType = {
    children : React.ReactNode;
}


export enum Actions {
    SET_TENANT,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_PRICE
}

