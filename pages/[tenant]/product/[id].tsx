import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Quantity } from '@/components/Quantity';
import { useAppContext } from '../../../contexts/app' //importanto o hook
import { useApi } from '@/libs/useApi';
import { useFormatter } from '@/libs/useFormatter';
import { Product } from '@/types/Product';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../../../styles/Product-id.module.css'



const Product = (data: Props) => {

  const { tenant, setTenant } = useAppContext();

  const [qtCount, setQtCount] = useState(1);

  const formatter = useFormatter();

  useEffect(
    () => {
      setTenant(data.tenant) //essa info veio do servidor
    }, []
  )

  const handleAddToCart = () => {
    console.log("Adicionado a sacola");

  }

  const handleUpdateQt = (newCount: number) => {
    setQtCount(newCount)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.product.name} | {data.tenant.name}</title>
      </Head>

      <div className={styles.headerArea}>
        <Header color={data.tenant.mainColor} backHref={`/${data.tenant.slug}`} title={"Produto"} invert></Header>
      </div>

      <div className={styles.headerBg} style={{ backgroundColor: data.tenant.mainColor }}></div>

      <div className={styles.productImage}>
        <img src={data.product.image} alt="" />
      </div>

      <div className={styles.category}>{data.product.categoryName}</div>
      <div className={styles.title} style={{ borderBottomColor: data.tenant.mainColor }}>{data.product.name}</div>
      <div className={styles.line}></div>

      <div className={styles.description}>{data.product.description}</div>
      <div className={styles.qtText}>Quantidade</div>
      <div className={styles.area}>
        <div className={styles.areaLeft}>
          <Quantity
            color={data.tenant.mainColor}
            count={qtCount}
            onUpdateCount={handleUpdateQt}
            min={1}
          />
        </div>
        <div className={styles.areaRight} style={{ color: data.tenant.mainColor }} >{formatter.formatPrice(data.product.price)}</div>
      </div>

      <div className={styles.buttonArea}>
        <Button color={data.tenant.mainColor} label="Adiconar à sacola" onClick={handleAddToCart} fill></Button>
      </div>

    </div>
  )
}

export default Product;

type Props = {
  tenant: Tenant,
  product: Product;
}

//Vamos pegar informacao do servidor de quem é o TENANT, para só depois carregar a pagina
//A info vai vir do servidor.
export const getServerSideProps: GetServerSideProps = async (context) => {

  //o valor de context.query.tenant é extraído e atribuído à variável tenantSlug
  const { tenant: tenantSlug, id } = context.query;
  const api = useApi(tenantSlug as string); //vai pegar por ex todos produtos do tenant x, ja pega as informacoes do Tenant aquui

  //validar o tenant
  const tenant = await api.getTenant();

  if (!tenant) {
    return { redirect: { destination: '/', permanent: false } }
  }

  //Get products
  const product = await api.getOneProduct(id as string);

  return {
    props: {
      tenant,
      product
    }
  }
}