import { useAppContext } from '../../../contexts/app' //importanto o hook
import { useAuthContext } from '../../../contexts/auth' //importanto o hook
import { useApi } from '@/libs/useApi';
import { Product } from '@/types/Product';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../../styles/Order-id.module.css'
import { getCookie, setCookie } from 'cookies-next';
import { User } from '@/types/User';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { useFormatter } from '@/libs/useFormatter';
import { CartItem } from '@/types/CartItem';
import { useRouter } from 'next/router';
import { CartProductItem } from '@/components/CartProductItem';
import { CartCookie } from '@/types/CartCookie';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { Address } from '@/types/Address';
import { Order } from '@/types/Order';




const OrderID = (data: Props) => {

    const { tenant, setTenant } = useAppContext();
    const { setUser, setToken } = useAuthContext();


    useEffect(
        () => {
            setTenant(data.tenant); //essa info veio do servidor
            setToken(data.token);
            if (data.user) setUser(data.user);
        }, []);

    const formatter = useFormatter();
    const router = useRouter();





    return (
        <div className={styles.container}>
            <Head>
                <title>{`Pedido ${data.order.id} | ${data.tenant.name}`}</title>
            </Head>

            <Header backHref={`/${data.tenant.slug}/cart`} color={data.tenant.mainColor} title={`Pedido ${data.order.id}`} />


            <div className={styles.infoGroup}>

                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>Endereço</div>
                    <div className={styles.infoBody}>
                        <ButtonWithIcon
                            color={data.tenant.mainColor}
                            leftIcon={"location"}
                            rightIcon={"rightArrow"}
                            value={`${data.order.shippingAddress.street}, ${data.order.shippingAddress.number} - ${data.order.shippingAddress.city}`}
                            onClick={() => { }}
                            fill={false}

                        />
                    </div>
                </div>

                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>Tipo de pagamento</div>
                    <div className={styles.infoBody}>
                        <div className={styles.paymentTypes}>
                            <div className={styles.paymentBtn}>
                                <ButtonWithIcon
                                    color={data.tenant.mainColor}
                                    leftIcon={"money"}
                                    value="Dinheiro"
                                    onClick={() => { }}
                                    fill={data.order.paymentTipe === 'money'}
                                />
                            </div>
                            <div className={styles.paymentBtn}>
                                <ButtonWithIcon
                                    color={data.tenant.mainColor}
                                    leftIcon={"card"}
                                    value="Cartão"
                                    onClick={() => { }}
                                    fill={data.order.paymentTipe === 'card'}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {data.order.paymentTipe === 'money' &&
                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>Troco</div>
                        <div className={styles.infoBody}>
                            <InputField color={data.tenant.mainColor}
                                placeholder="Quanto você tem em dinheiro?"
                                value={data.order.paymentChange?.toString() ?? ""}
                                onChange={newValue => { }}
                            />
                        </div>
                    </div>
                }

                {data.order.cupom &&

                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>Cupom de desconto</div>
                        <div className={styles.infoBody}>
                            <ButtonWithIcon
                                color={data.tenant.mainColor}
                                leftIcon={"cupom"}
                                rightIcon={"checked"}
                                value={data.order.cupom.toUpperCase()}
                            />
                        </div>
                    </div>
                }

            </div>


            <div className={styles.productsQuantity}>{data.order.products.length}{data.order.products.length === 1 ? ' item no carrinho' : ' itens no carrinho'} </div>

            <div className={styles.productsList}>
                {data.order.products.map((cartItem, index) =>
                    <CartProductItem
                        key={index}
                        color={data.tenant.mainColor}
                        quantity={cartItem.qt}
                        product={cartItem.product}
                        onChange={() => { }}
                        noEdit
                    />


                )}
            </div>


            <div className={styles.resumeArea}>
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Subtotal</div>
                    <div className={styles.resumeRight}>{formatter.formatPrice(data.order.subTotal)}</div>
                </div>

                {data.order.cupomDiscount &&
                    <div className={styles.resumeItem}>
                        <div className={styles.resumeLeft}>Desconto</div>
                        <div className={styles.resumeRight}>-{formatter.formatPrice(data.order.cupomDiscount)}</div>
                    </div>
                }

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Frete</div>
                    <div className={styles.resumeRight}>{data.order.shippingPrice > 0 ? formatter.formatPrice(data.order.shippingPrice) : '--'}</div>
                </div>

                <div className={styles.resumeLine}></div>

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Total</div>
                    <div className={styles.resumeRightBig} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(data.order.total)}</div>
                </div>

            </div>

        </div>
    )
}

export default OrderID;

type Props = {
    tenant: Tenant;
    token: string;
    user: User | null;
    order: Order;
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
    let token = getCookie('token', context);
    if (!token) token = null; //se nao ter essa opcao, da erro de retornar um objeto undefined.
    const user = await api.authorizeToken(token as string);

    //Get Order
    const order = await api.getOrder(1)


    return {
        props: {
            tenant,
            user,
            token,
            order
        }
    }
}