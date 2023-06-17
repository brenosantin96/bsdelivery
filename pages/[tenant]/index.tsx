import { Banner } from '@/components/banner';
import { ProductItem } from '@/components/productItem';
import { SearchInput } from '@/components/SearchInput';
import { useAppContext } from '@/contexts/AppContext';
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import styles from '../../styles/Home.module.css'



const Home = (data: Props) => {

  const { tenant, setTenant } = useAppContext();

  useEffect(
    () => {
      setTenant(data.tenant)
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
          <SearchInput onSearch={handleSearch}/>
        </div>
      </header>

      <Banner />

      <div className={styles.grid}>
        <ProductItem
          data={{ id: 1, image: '/tmp/burgercard1.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
        />
        <ProductItem
          data={{ id: 2, image: '/tmp/burgercard2.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
        />
        <ProductItem
          data={{ id: 3, image: '/tmp/burgercard1.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
        />
        <ProductItem
          data={{ id: 4, image: '/tmp/burgercard2.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
        />
      </div>



    </div>
  )
}

export default Home;

type Props = {
  tenant: Tenant
}

//Vamos pegar informacao do servidor de quem é o TENANT, para só depois carregar a pagina
//A info vai vir do servidor.
export const getServerSideProps: GetServerSideProps = async (context) => {

  //o valor de context.query.tenant é extraído e atribuído à variável tenantSlug
  const { tenant: tenantSlug } = context.query;
  const api = useApi();

  //validar o tenant
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