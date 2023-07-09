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




const EditAddress = (data: Props) => {

    const { tenant, setTenant, setShippingAddress, setShippingPrice } = useAppContext();
    const { setUser, setToken } = useAuthContext();
    const api = useApi(data.tenant.slug);

    const [errorFields, setErrorFields] = useState<string[]>([]);

    const [address, setAddress] = useState<Address>(data.address);

    //SITUACAO ONDE ESTAMOS TROCANDO VALORES DE UM ITEM ESPECIFICO DENTRO DE UM STATE
    const changeAddressField = (field: keyof Address, value: typeof address[keyof Address]) => {
        setAddress({ ...address, [field]: value })
    }


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

        if (address.cep.replaceAll(/[^0-9]/g, '').length !== 8) {
            newErrorFields.push('cep');
            approved = false;
        }

        if (address.street.length <= 2) {
            newErrorFields.push('street');
            approved = false;
        }

        if (address.neighborhood.length <= 2) {
            newErrorFields.push('neighborhood');
            approved = false;
        }

        if (address.city.length <= 2) {
            newErrorFields.push('city');
            approved = false;
        }

        if (address.state.length !== 2) {
            newErrorFields.push('state');
            approved = false;
        }


        setErrorFields(newErrorFields);
        return approved;
    }


    const handleSaveAdress = async () => {
        if (verifyAddress()) {
            const success = await api.editUserAddress(address);
            if (success) {
                router.push(`/${data.tenant.slug}/myaddresses`);
            } else alert("Algum erro aconteceu")
        }
    }





    return (
        <div className={styles.container}>
            <Head>
                <title>{`Editar Endereço | ${data.tenant.name}`}</title>
            </Head>

            <Header backHref={`/${data.tenant.slug}/myaddresses`} color={data.tenant.mainColor} title="Editar Endereço" />

            <div className={styles.inputs}>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>CEP</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um CEP"} value={address.cep} onChange={(value) => changeAddressField('cep', value)} warning={errorFields.includes('cep')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Rua</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite uma Rua"} value={address.street} onChange={(value) => changeAddressField('street', value)} warning={errorFields.includes('street')} />
                    </div>
                    <div className={styles.column}>
                        <div className={styles.label}>Numero</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um numero"} value={address.number} onChange={(value) => changeAddressField('number', value)} warning={errorFields.includes('number')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Bairro</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um bairro"} value={address.neighborhood} onChange={(value) => changeAddressField('neighborhood', value)} warning={errorFields.includes('neighborhood')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Cidade</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite sua cidade"} value={address.city} onChange={(value) => changeAddressField('city', value)} warning={errorFields.includes('city')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Estado</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite o estado"} value={address.state} onChange={(value) => changeAddressField('state', value)} warning={errorFields.includes('state')} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Complemento</div>
                        <InputField color={data.tenant.mainColor} placeholder={"Digite um Complemento"} value={address.complement ?? ""} onChange={(value) => changeAddressField('complement', value)} warning={errorFields.includes('complement')} />
                    </div>
                </div>

            </div>


            <div className={styles.btnArea}>
                <Button color={data.tenant.mainColor} label="Salvar" onClick={handleSaveAdress} fill />
            </div>



        </div>
    )
}

export default EditAddress;

type Props = {
    tenant: Tenant;
    token: string;
    user: User | null;
    address: Address;
}

//Vamos pegar informacao do servidor de quem é o TENANT, para só depois carregar a pagina
//A info vai vir do servidor.
export const getServerSideProps: GetServerSideProps = async (context) => {

    //o valor de context.query.tenant é extraído e atribuído à variável tenantSlug
    const { tenant: tenantSlug, addressid } = context.query;
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

    //get Adress
    const address = await api.getUserAddress(parseInt(addressid as string));
    if (!address) {
        return { redirect: { destination: `/${tenant.slug}/myaddresses`, permanent: false } }
    }

    return {
        props: {
            tenant,
            user,
            token,
            address
        }
    }
}