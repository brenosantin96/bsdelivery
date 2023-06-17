import { Tenant } from "@/types/Tenant"
import { createContext, ReactNode, useContext, useState } from "react";

type appContextType = {
    tenant: Tenant | null;
    setTenant: (newTenant: Tenant) => void; //funcao para fazer troca de tenant
}

const defaultValues: appContextType = {
    tenant: null,
    setTenant: () => null //executando uma funcao anonima que retorna null
}

//quando se cria contexto, para facilitar sempre fazer 3 pontos. 1-criar o contexto, 2 criar um hook para instanciar rapido 3 -ccriar  o provider
const appContext = createContext<appContextType>(defaultValues); // criado o contexto, agora criar o provider

//hook
export const useAppContext = () => {
    return useContext(appContext)
}

type Props = {
    children: ReactNode;
}

//provider
export const AppContextProvider = ({ children }: Props) => {

    const [tenant, setTenant] = useState<Tenant | null>(null);



    return (
        <appContext.Provider value={{ tenant, setTenant }}>
            {children}
        </appContext.Provider>
    )
}