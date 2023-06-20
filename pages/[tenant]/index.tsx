import { Banner } from '@/components/banner';
import { ProductItem } from '@/components/productItem';
import { SearchInput } from '@/components/SearchInput';
import { useAppContext } from '@/contexts/AppContext';
import { useApi } from '@/libs/useApi';
import { Product } from '@/types/Product';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css'



const Home = (data: Props) => {

  const { tenant, setTenant } = useAppContext();

  const [products, setProducts] = useState<Product[]>(data.products);

  useEffect(
    () => {
      setTenant(data.tenant) //essa info veio do servidor
    }, []
  )

  const handleSearch = (searchValue: string) => {
    console.log(`Voce está buscando por: ${searchValue}`);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <div className={styles.headerTitle}>Seja Bem-Vindo 👋</div>
            <div className={styles.headerSubTitle}>O que deseja para hoje?</div>
          </div>
          <div className={styles.headerTopRight}>
            <div className={styles.menuButton}>
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
            </div>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <SearchInput onSearch={handleSearch} />
        </div>
      </header>

      <Banner />

      <div className={styles.grid}>
        {products.map((item, index) => (
          <ProductItem key={index} data={item} />
        ))}
      </div>



    </div>
  )
}

export default Home;

type Props = {
  tenant: Tenant,
  products: Product[];
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

  //Get products
  const products = await api.getAllProducts();


  return {
    props: {
      tenant,
      products
    }
  }
}