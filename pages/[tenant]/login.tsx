import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { useAppContext } from '@/contexts/AppContext';
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../../styles/login.module.css'

const Login = (data: Props) => {

    const { tenant, setTenant } = useAppContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(
        () => {
            setTenant(data.tenant)
        }, []
    )

    return (
        <div className={styles.container}>
            <Head>
                <title>Login | {data.tenant.name}</title>
            </Head>
            <Header color={data.tenant.mainColor} backHref={`/${data.tenant.slug}`} title="Testando" />

            <InputField
                color={data.tenant.mainColor}
                placeholder="Digite seu e-mail"
                value={email}
                onChange={setEmail}
            />
            <InputField
                color={data.tenant.mainColor}
                placeholder="Digite sua senha"
                value={password}
                onChange={setPassword}
                password
            />

        </div>
    )
}



export default Login;

type Props = {
    tenant: Tenant
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenant: tenantSlug } = context.query;
    const api = useApi();

    const tenant = api.getTenant(tenantSlug as string);

    if (!tenant) {
        return { redirect: { destination: '/', permanent: false } }
    }

    return {
        props: {
            tenant
        }
    }
}