import { useAppContext } from '../../../contexts/app' //importanto o hook
import { useAuthContext } from '../../../contexts/auth' //importanto o hook
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../../styles/newAddress.module.css'
import { getCookie, setCookie } from 'cookies-next';
import { User } from '@/types/User';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { useFormatter } from '@/libs/useFormatter';
import { CartItem } from '@/types/CartItem';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import { Address } from '@/types/Address';
import { AddressItem } from '@/components/AddressItem';
import { InputField } from '@/components/InputField';




const NewAddress = (data: Props) => {

    const { tenant, setTenant, setShippingAddress, setShippingPrice } = useAppContext();
    const { setUser, setToken } = useAuthContext();
    const api = useApi(data.tenant.slug);

    const [errorFields, setErrorFields] = useState<string[]>([]);

    const [addressCep, setAddressCep] = useState<string>("");
    const [addressStreet, setAddressStreet] = useState<string>("");
    const [addressNumber, setAddressNumber] = useState<string>("");
    const [addressNeighborhood, setAddressNeighborhood] = useState<string>("");
    const [addressCity, setAddressCity] = useState<string>("");
    const [addressState, setAddressState] = useState<string>("");
    const [addressComplement, setAddressComplement] = useState<string>("");


    useEffect(
        () => {
            setTenant(data.tenant); //essa info veio do servidor
            setToken(data.token);
            if (data.user) setUser(data.user);
        }, []);

    const formatter = useFormatter();
    const router = useRouter();


    const verifyAddress = () => {
        let newErrorFields: string[] = [];
        let approved = true;

        if(addressCep.replaceAll(/[^0-9]/g, '').length !== 8) {
            newErrorFields.push('cep');
            approved = false;
        }

        if(addressStreet.length <= 2) {
            newErrorFields.push('street');
            approved = false;
        }

        if(addressNeighborhood.length <= 2) {
            newErrorFields.push('neighborhood');
            approved = false;
        }

        if(addressCity.length <= 2) {
            newErrorFields.push('city');
            approved = false;
        }

        if(addressState.length !== 2) {
            newErrorFields.push('state');
            approved = false;
        }


        setErrorFields(newErrorFields);
        return approved;
    }


    const handleNewAdress = async () => {
        if(verifyAddress()){
            let address: Address = {
                id: 0,
                cep: addressCep,
                street: addressStreet,
                number: addressNumber,
                neighborhood: addressNeighborhood,
                city: addressCity,
                state: addressState,
                complement: addressComplement
            };

            let newAddress = await api.addUserAddress(address);
            if(newAddress.id > 0) {
                router.push(`/${data.tenant.slug}/myaddresses`);
            } else {
                alert("Ocorreu um erro, tente novamente mais tarde.")
            }
            
        }
    }





    return (
        <div className={styles.container}>
            <Head>
                <title>{`Novo Endereço | ${data.tenant.name}`}</title>
            </Head>

            <Header backHref={`/${data.tenant.slug}/myaddresses`} color={data.tenant.mainColor} title="Novo Endereço" />

            <div className={styles.inputs}>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>CEP</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um CEP"} value={addressCep} onChange={(value) => setAddressCep(value)} warning={errorFields.includes('cep')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Rua</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite uma Rua"} value={addressStreet} onChange={(value) => setAddressStreet(value)} warning={errorFields.includes('street')} />
                    </div>
                    <div className={styles.column}>
                        <div className={styles.label}>Numero</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um numero"} value={addressNumber} onChange={(value) => setAddressNumber(value)} warning={errorFields.includes('number')}  />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Bairro</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um bairro"} value={addressNeighborhood} onChange={(value) => setAddressNeighborhood(value)} warning={errorFields.includes('neighborhood')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Cidade</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite sua cidade"} value={addressCity} onChange={(value) => setAddressCity(value)} warning={errorFields.includes('city')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Estado</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite o estado"} value={addressState} onChange={(value) => setAddressState(value)} warning={errorFields.includes('state')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Complemento</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um Complemento"} value={addressComplement} onChange={(value) => setAddressComplement(value)} warning={errorFields.includes('complement')} />
                    </div>
                </div>

            </div>


            <div className={styles.btnArea}>
                <Button color={data.tenant.mainColor} label="Adicionar" onClick={handleNewAdress} fill />
            </div>



        </div>
    )
}

export default NewAddress;

type Props = {
    tenant: Tenant;
    token: string;
    user: User | null;
    addresses: Address[];
}

//Vamos pegar informacao do servidor de quem é o TENANT, para só depois carregar a pagina
//A info vai vir do servidor.
export const getServerSideProps: GetServerSideProps = async (context) => {

    //o valor de context.query.tenant é extraído e atribuído à variável tenantSlug
    const { tenant: tenantSlug } = context.query;
    const api = useApi(tenantSlug as string); //vai pegar por ex todos produtos do tenant x, ja pega as informacoes do Tenant aquui

    //validar o tenant
    const tenant = await api.getTenant();

    if (!tenant) {
        return { redirect: { destination: '/', permanent: false } }
    }

    //Get logged user
    //let token = context.req.cookies.token;
    let token = getCookie('token', context);
    if (!token) token = null; //se nao ter essa opcao, da erro de retornar um objeto undefined.


    const user = await api.authorizeToken(token as string);
    if (!user) {
        return { redirect: { destination: `/${tenant.slug}/login`, permanent: false } } //if no user logged redirect to login
    }

    //getAdressesFromLoggedUser
    const addresses = await api.getUserAddresses(user.email);

    return {
        props: {
            tenant,
            user,
            token,
            addresses
        }
    }
}