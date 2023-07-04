import { useAppContext } from '../../contexts/app' //importanto o hook
import { useAuthContext } from '../../contexts/auth' //importanto o hook
import { useApi } from '@/libs/useApi';
import { Product } from '@/types/Product';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../styles/checkout.module.css'
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




const Checkout = (data: Props) => {

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

  //Product Control
  const [cart, setCart] = useState<CartItem[]>(data.cart);

  const handleCartChange = (newCount: number, id: number) => {
    const tmpCart: CartItem[] = [...cart];
    const cartIndex = tmpCart.findIndex(item => item.product.id === id) //see index 

    if (newCount > 0) {
      tmpCart[cartIndex].qt = newCount;
    } else {
      delete tmpCart[cartIndex]; //deleta o item do array deixando um nulo no array
    }

    let newCart: CartItem[] = tmpCart.filter(item => item); //itens que sao nulos ou indefinidos nao entram aqui.
    setCart(newCart);

    //update cookies
    let cartCookie: CartCookie[] = [];
    for (let i in newCart) {
      cartCookie.push({
        id: newCart[i].product.id,
        qt: newCart[i].qt
      })
    }

    setCookie('cart', JSON.stringify(cartCookie));

  }


  //Shipping
  const [shippingInput, setShippingInput] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingTime, setShippingTime] = useState(0);
  const [shippingAdress, setShippingAdress] = useState("");


  const handleShippingCalc = () => {
    setShippingAdress("Rua blablaba")
    setShippingPrice(9.50);
    setShippingTime(20);
  }


  //Resume
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    let sub = 0;
    for (let i in cart) {
      sub += cart[i].product.price * cart[i].qt;
    }
    setSubTotal(sub);
  }, [cart])


  const handleFinish = () => {
    router.push(`/${data.tenant.slug}/checkout`);
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>{`Checkout | ${data.tenant.name}`}</title>
      </Head>

      <Header backHref={`/${data.tenant.slug}`} color={data.tenant.mainColor} title="Checkout" />


      <div className={styles.infoGroup}>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Endereço</div>
          <div className={styles.infoBody}>
            <ButtonWithIcon
              color={data.tenant.mainColor}
              leftIcon={"location"}
              rightIcon={"rightarrow"}
              value={"Rua blablabla, 132"}
              onClick={() => { }}
              fill={false}

            />
          </div>
        </div>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Tipo de pagamento</div>
          <div className={styles.infoBody}>
            ...
          </div>
        </div>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Troco</div>
          <div className={styles.infoBody}>
            ...
          </div>
        </div>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Cupom de desconto</div>
          <div className={styles.infoBody}>
            ...
          </div>
        </div>

      </div>
























      <div className={styles.productsQuantity}>{cart.length}{cart.length === 1 ? ' item no carrinho' : ' itens no carrinho'} </div>

      <div className={styles.productsList}>
        {cart.map((cartItem, index) =>
          <CartProductItem
            key={index}
            color={data.tenant.mainColor}
            quantity={cartItem.qt}
            product={cartItem.product}
            onChange={handleCartChange}
          />


        )}
      </div>

      <div className={styles.shippingArea}>
        <div className={styles.shippingTitle}>Calcular frete e prazo</div>
        <div className={styles.shippingForm}>
          <InputField color={data.tenant.mainColor} placeholder="Digite seu CEP" value={shippingInput} onChange={newValue => setShippingInput(newValue)} />
          <Button color={data.tenant.mainColor} label="OK" onClick={handleShippingCalc} />
        </div>

        {shippingTime > 0 &&
          <div className={styles.shippingInfo}>
            <div className={styles.shippingAdress}>{shippingAdress}</div>
            <div className={styles.shippingTime}>
              <div className={styles.shippingTimeText}>Receba em ate {shippingTime} minutos</div>
              <div className={styles.shippingTimePrice} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice)}</div>
            </div>
          </div>
        }


      </div>

      <div className={styles.resumeArea}>
        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formatter.formatPrice(subTotal)}</div>
        </div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.formatPrice(shippingPrice) : '--'}</div>
        </div>

        <div className={styles.resumeLine}></div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div className={styles.resumeRightBig} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice + subTotal)}</div>
        </div>

        <div className={styles.resumeButton}>
          <Button color={data.tenant.mainColor} label="Continuar" onClick={handleFinish} fill></Button>
        </div>


      </div>

    </div>
  )
}

export default Checkout;

type Props = {
  tenant: Tenant;
  token: string;
  user: User | null;
  cart: CartItem[];
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

  //get Cart Products
  const cartCookie = getCookie('cart', context);
  console.log("CART: ", cartCookie);

  const cart = await api.getCartProducts(cartCookie as string);

  return {
    props: {
      tenant,
      user,
      token,
      cart
    }
  }
}