import { Banner } from '@/components/banner';
import { ProductItem } from '@/components/productItem';
import { SearchInput } from '@/components/SearchInput';
import { getTenantResponse, useApi } from '@/libs/useApi';
import { GetServerSideProps } from 'next';
import styles from '../../styles/Home.module.css'



const Home = (data: Props) => {


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
              <div className={styles.menuButtonLine} style={{ backgroundColor: data.tenant.mainColor }}></div>
              <div className={styles.menuButtonLine} style={{ backgroundColor: data.tenant.mainColor }}></div>
              <div className={styles.menuButtonLine} style={{ backgroundColor: data.tenant.mainColor }}></div>
            </div>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <SearchInput mainColor={data.tenant.mainColor}
            onSearch={handleSearch}

          />
        </div>
      </header>

      <Banner />

      <div className={styles.grid}>
        <ProductItem
          data={{ id: 1, image: '/tmp/burgercard1.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
          mainColor={data.tenant.mainColor}
          secondColor={data.tenant.secondColor}
        />
        <ProductItem
          data={{ id: 2, image: '/tmp/burgercard2.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
          mainColor={data.tenant.mainColor}
          secondColor={data.tenant.secondColor}
        />
        <ProductItem
          data={{ id: 3, image: '/tmp/burgercard1.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
          mainColor={data.tenant.mainColor}
          secondColor={data.tenant.secondColor}
        />
        <ProductItem
          data={{ id: 4, image: '/tmp/burgercard2.png', categoryName: 'Tradicional', name: 'Texas Burger', price: 'R$25,50' }}
          mainColor={data.tenant.mainColor}
          secondColor={data.tenant.secondColor}
        />
      </div>



    </div>
  )
}

export default Home;

type Props = {
  tenant: getTenantResponse
}

//Vamos pegar informacao do servidor de quem é o TENANT, para só depois carregar a pagina
//A info vai vir do servidor.
export const getServerSideProps: GetServerSideProps = async (context) => {

  const { tenant: tenantSlug } = context.query;
  const api = useApi();

  //validar o tenant
  //o valor de context.query.tenant é extraído e atribuído à variável tenantSlug
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