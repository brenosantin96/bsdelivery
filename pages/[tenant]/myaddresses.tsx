import { useAppContext } from '../../contexts/app' //importanto o hook
import { useAuthContext } from '../../contexts/auth' //importanto o hook
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../styles/myadresses.module.css'
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




const MyAdresses = (data: Props) => {

    const { tenant, setTenant, setShippingAddress, setShippingPrice } = useAppContext();
    const { setUser, setToken } = useAuthContext();
    const api = useApi(data.tenant.slug);


    useEffect(
        () => {
            setTenant(data.tenant); //essa info veio do servidor
            setToken(data.token);
            if (data.user) setUser(data.user);
        }, []);

    const formatter = useFormatter();
    const router = useRouter();


    //tem que utilizar o context porque teem que passar props de uma pagina a outra, nao envolve compnente pai nem componente filho.
    const handleAddressSelect = async (address: Address) => {
        const price = await api.getShippingPrice(address);
        if (price) {
            // Salvar no contexto endereco e frete 
            setShippingAddress(address);
            setShippingPrice(price);
            router.push(`/${data.tenant.slug}/checkout`)
        }
    }

    const handleNewAdress = () => {
        router.push(`/${data.tenant.slug}/address/new `)

    }

    const handleAddressEdit = (id: number) => {
        router.push(`/${data.tenant.slug}/address/${id}`)
        console.log("Editando o endereco com ID: ", id)
    }

    const handleAddressDelete = async (id: number) => {
        await api.deleteUserAddress(id);
        router.reload();
    }

    //MenuEvents
    const [menuOpened, setMenuOpened] = useState(0);

    const handleMenuEvent = (event: MouseEvent) => {
        const tagName = (event.target as Element).tagName;

        if (!['path', 'svg'].includes(tagName)) {
            setMenuOpened(0); //fechar o menu se clicar em algum lugar que nao seja path ou svg, (porque os dots é um svg)
        }
    }

    useEffect(() => {

        window.removeEventListener('click', handleMenuEvent);
        window.addEventListener('click', handleMenuEvent);
        return () => window.removeEventListener('click', handleMenuEvent);
    }, [menuOpened])


    return (
        <div className={styles.container}>
            <Head>
                <title>{`Meus Endereços | ${data.tenant.name}`}</title>
            </Head>

            <Header backHref={`/${data.tenant.slug}/checkout`} color={data.tenant.mainColor} title="Meus Endereços" />

            <div className={styles.list}>
                {data.addresses.map((item, index) => (
                    <AddressItem
                        key={index}
                        color={data.tenant.mainColor}
                        address={item}
                        onSelect={handleAddressSelect}
                        onEdit={handleAddressEdit}
                        onDelete={handleAddressDelete}
                        menuOpened={menuOpened}
                        setMenuOpened={setMenuOpened}

                    />
                ))}
            </div>

            <div className={styles.btnArea}>
                <Button color={data.tenant.mainColor} label="Novo endereço" onClick={handleNewAdress} fill />
            </div>



        </div>
    )
}

export default MyAdresses;

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