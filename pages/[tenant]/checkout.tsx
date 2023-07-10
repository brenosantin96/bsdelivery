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
import { Address } from '@/types/Address';




const Checkout = (data: Props) => {

  const { tenant, setTenant, shippingAddress, shippingPrice } = useAppContext();
  const { setUser, setToken } = useAuthContext();


  useEffect(
    () => {
      setTenant(data.tenant); //essa info veio do servidor
      setToken(data.token);
      if (data.user) setUser(data.user);
    }, []);

  const formatter = useFormatter();
  const router = useRouter();
  const api = useApi(data.tenant.slug);

  //Product Control
  const [cart, setCart] = useState<CartItem[]>(data.cart);



  //Shipping



  const handleChangeAdress = () => {
    router.push(`/${data.tenant.slug}/myaddresses`)

    /*setShippingAdress({ id: 1, cep: "38701-601", street: "Rua das Flores", number: "321", neighborhood: "Nova Floresta", city: "Patos de Minas", state: 'MG' })
    setShippingPrice(9.5);
    console.log("indo para tela de endeereco...");
    */
  }

  //Payments
  const [paymentType, setPaymentType] = useState<'money' | 'card'>('money')
  const [paymentChange, setPaymentChange] = useState(0);

  //Cupom
  const [cupom, setCupom] = useState('');
  const [discount, setDiscount] = useState(0);
  const [cupomInput, setCupomInput] = useState("");

  const handleSetCupom = () => {
    if (cupomInput) {
      setCupom(cupomInput)
      setDiscount(15.20);
    }
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


  const handleFinish = async () => {
    if (shippingAddress) {
      const order = await api.setOrder(
        shippingAddress,
        paymentType,
        paymentChange,
        cupom,
        data.cart
      );

    }

  }



  return (
    <div className={styles.container}>
      <Head>
        <title>{`Checkout | ${data.tenant.name}`}</title>
      </Head>

      <Header backHref={`/${data.tenant.slug}/cart`} color={data.tenant.mainColor} title="Checkout" />


      <div className={styles.infoGroup}>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Endereço</div>
          <div className={styles.infoBody}>
            <ButtonWithIcon
              color={data.tenant.mainColor}
              leftIcon={"location"}
              rightIcon={"rightArrow"}
              value={shippingAddress ? `${shippingAddress.street} ${shippingAddress.number} - ${shippingAddress.city}` : 'Escolha um endereço'}
              onClick={handleChangeAdress}
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
                  onClick={() => setPaymentType('money')}
                  fill={paymentType === 'money'}
                />
              </div>
              <div className={styles.paymentBtn}>
                <ButtonWithIcon
                  color={data.tenant.mainColor}
                  leftIcon={"card"}
                  value="Cartão"
                  onClick={() => setPaymentType('card')}
                  fill={paymentType === 'card'}
                />
              </div>
            </div>
          </div>
        </div>


        {paymentType === 'money' &&
          <div className={styles.infoArea}>
            <div className={styles.infoTitle}>Troco</div>
            <div className={styles.infoBody}>
              <InputField color={data.tenant.mainColor}
                placeholder="Quanto você tem em dinheiro?"
                value={paymentChange ? paymentChange.toString() : ""}
                onChange={newValue => setPaymentChange(parseInt(newValue))}
              />
            </div>
          </div>
        }

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Cupom de desconto</div>
          <div className={styles.infoBody}>
            {cupom &&
              <ButtonWithIcon
                color={data.tenant.mainColor}
                leftIcon={"cupom"}
                rightIcon={"checked"}
                value={cupom.toUpperCase()}
              />
            }
            {!cupom &&
              <div className={styles.cupomInput}>
                <InputField color={data.tenant.mainColor}
                  placeholder="Tem um cupom ?"
                  value={cupomInput}
                  onChange={(newValue) => setCupomInput(newValue)}
                />
                <Button color={data.tenant.mainColor}
                  label="OK"
                  onClick={handleSetCupom}
                />
              </div>

            }


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
            onChange={() => { }}
            noEdit
          />


        )}
      </div>


      <div className={styles.resumeArea}>
        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formatter.formatPrice(subTotal)}</div>
        </div>

        {discount > 0 &&
          <div className={styles.resumeItem}>
            <div className={styles.resumeLeft}>Desconto</div>
            <div className={styles.resumeRight}>-{formatter.formatPrice(discount)}</div>
          </div>
        }

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.formatPrice(shippingPrice) : '--'}</div>
        </div>

        <div className={styles.resumeLine}></div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div className={styles.resumeRightBig} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice + subTotal - discount)}</div>
        </div>

        <div className={styles.resumeButton}>
          <Button color={data.tenant.mainColor} label="Finalizar Pedido" onClick={handleFinish} fill disabled={!shippingAddress}></Button>
        </div>
        {/* se tiver shipping adress, nao fica disabled. se nao tiver, fica disabled. */}


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