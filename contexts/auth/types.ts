import { User } from "@/types/User";
import React, { Dispatch } from "react";

export type DataType = { //aqui nao vamos guardar info de tenant no state, vamos guardar o token de login
    token: string;
    user : User | null; 
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
    SET_TOKEN,
    SET_USER
}

