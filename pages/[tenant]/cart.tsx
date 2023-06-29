import { useAppContext } from '../../contexts/app' //importanto o hook
import { useAuthContext } from '../../contexts/auth' //importanto o hook
import { useApi } from '@/libs/useApi';
import { Product } from '@/types/Product';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../styles/cart.module.css'
import { getCookie } from 'cookies-next';
import { User } from '@/types/User';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { useFormatter } from '@/libs/useFormatter';



const Cart = (data: Props) => {

  const { tenant, setTenant } = useAppContext();
  const { setUser, setToken } = useAuthContext();

  const [shippingInput, setShippingInput] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [subtotal, setSubTotal] = useState(0);

  const handleShippingCalc = () => {
    console.log("CU")
  }

  const handleFinish = () => {
    console.log("Terminando")
  }


  useEffect(
    () => {
      setTenant(data.tenant); //essa info veio do servidor
      setToken(data.token);
      if (data.user) setUser(data.user);
    }, []);

  const formatter = useFormatter();


  return (
    <div className={styles.container}>
      <Head>
        <title>{`SACOLA | ${data.tenant.name}`}</title>
      </Head>

      <Header backHref={`/${data.tenant.slug}`} color={data.tenant.mainColor} title="Sacola" />
      <div className={styles.productsQuantity}>X Itens</div>

      <div className={styles.productsList}></div>

      <div className={styles.shippingArea}>
        <div className={styles.shippingTitle}>Calcular frete e prazo</div>
        <div className={styles.shippingForm}>
          <InputField color={data.tenant.mainColor} placeholder="Digite seu CEP" value={shippingInput} onChange={newValue => setShippingInput(newValue)} />
          <Button color={data.tenant.mainColor} label="OK" onClick={handleShippingCalc} />
        </div>
        <div className={styles.shippingInfo}>
          <div className={styles.shippingAdress}>Rua bla bla bla</div>
          <div className={styles.shippingTime}>
            <div className={styles.shippingTimeText}>Receba em ate 20 minutos</div>
            <div className={styles.shippingTimePrice} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice)}</div>
          </div>
        </div>
      </div>

      <div className={styles.resumeArea}>
        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formatter.formatPrice(subtotal)}</div>
        </div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.formatPrice(shippingPrice) : '--'}</div>
        </div>

        <div className={styles.resumeLine}></div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div className={styles.resumeRightBig} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice + subtotal)}</div>
        </div>

        <div className={styles.resumeButton}>
          <Button color={data.tenant.mainColor} label="Continuar" onClick={handleFinish} fill></Button>
        </div>


      </div>

    </div>
  )
}

export default Cart;

type Props = {
  tenant: Tenant;
  products: Product[];
  token: string;
  user: User | null;
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

  //Get products
  const products = await api.getAllProducts();


  return {
    props: {
      tenant,
      products,
      user,
      token
    }
  }
}