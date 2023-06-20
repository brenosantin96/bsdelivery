import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Icon } from '@/components/Icon';
import { InputField } from '@/components/InputField';
import { useAppContext } from '@/contexts/AppContext';
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/forgetSuccess.module.css'

const ForgetSuccess = (data: Props) => {

    const router = useRouter();

    const { tenant, setTenant } = useAppContext();

    useEffect(
        () => {
            setTenant(data.tenant)
        }, []
    )

    const handleSubmit = () => {
        router.push(`/${data.tenant.slug}/login`)
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Esqueci a senha | {data.tenant.name}</title>
            </Head>
            <Header color={data.tenant.mainColor} backHref={`/${data.tenant.slug}/forget`} />

            <div className={styles.iconArea}>
                <Icon icon='mailsent' color={data.tenant.mainColor} width={99} height={81} />
            </div>

            <div className={styles.title}>Esqueceu sua senha?</div>

            <div className={styles.subtitle}>Enviamos as instruções para recuperação de senha para o seu e-mail.</div>

            <div className={styles.formArea}>                
                <div className={styles.inputArea}>
                    <Button
                        color={data.tenant.mainColor}
                        label="Fazer Login"
                        onClick={handleSubmit}
                        fill={true}
                    />
                </div>
            </div>


        </div >
    )
}



export default ForgetSuccess;

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