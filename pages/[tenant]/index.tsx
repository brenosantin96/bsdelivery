import { Banner } from '@/components/banner';
import { ProductItem } from '@/components/productItem';
import { SearchInput } from '@/components/SearchInput';
import { useAppContext } from '../../contexts/app' //importanto o hook
import { useAuthContext } from '../../contexts/auth' //importanto o hook
import { useApi } from '@/libs/useApi';
import { Product } from '@/types/Product';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css'
import { Sidebar } from '@/components/Sidebar';
import { getCookie } from 'cookies-next';
import { User } from '@/types/User';
import NoItemsIcon from '../../public/assets/noitems.svg'



const Home = (data: Props) => {

  const { tenant, setTenant } = useAppContext();
  const { setUser, setToken } = useAuthContext();


  const [products, setProducts] = useState<Product[]>(data.products);


  //sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(
    () => {
      setTenant(data.tenant); //essa info veio do servidor
      setToken(data.token);
      if (data.user) setUser(data.user);

    }, []
  )

  //Search
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    let newFilteredProducts: Product[] = [];

    for (let product of data.products) {
      if (product.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        newFilteredProducts.push(product);
      }
    }

    setFilteredProducts(newFilteredProducts);

  }, [searchText])

  const handleSearch = (value: string) => setSearchText(value);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <div className={styles.headerTitle}>Seja Bem-Vindo 👋</div>
            <div className={styles.headerSubTitle}>O que deseja para hoje?</div>
          </div>
          <div className={styles.headerTopRight}>
            <div className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
            </div>
            <Sidebar tenant={data.tenant}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
        <div className={styles.headerBottom}>
          <SearchInput onSearch={handleSearch} />
        </div>
      </header>

      {searchText &&
        <>
          <div className={styles.searchText}>
            Procurando por: <strong>{searchText}</strong>
          </div>

          {filteredProducts.length > 0 &&
            <div className={styles.grid}>
              {filteredProducts.map((item, index) => (
                <ProductItem key={index} data={item} />
              ))}
            </div>
          }

          {filteredProducts.length === 0 &&
            <div className={styles.noProducts}>
                {<NoItemsIcon className={styles.svgNoItemsIcon} color="#E0E0E0" />}
              <div className={styles.noProductsText}>
                Ops! Não há itens com este nome.
              </div>
            </div>
          }

        </>
      }

      {!searchText &&
        <>
          <Banner />
          <div className={styles.grid}>
            {products.map((item, index) => (
              <ProductItem key={index} data={item} />
            ))}
          </div>
        </>
      }




    </div>
  )
}

export default Home;

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
  const token = getCookie('token', context);


  console.log("TOKEN: ", token);

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