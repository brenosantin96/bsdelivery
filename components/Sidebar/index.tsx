import { useAuthContext } from '@/contexts/auth';
import { Tenant } from '@/types/Tenant';
import { useRouter } from 'next/router';
import { Button } from '../Button';
import { SidebarMenuItem } from '../SidebarMenuItem';
import styles from './styles.module.css';

type Props = {
    tenant: Tenant;
    open: boolean;
    onClose: () => void;
}


export const Sidebar = ({ tenant, open, onClose }: Props) => {

    const { user, setUser, token, setToken } = useAuthContext();

    const router = useRouter();




    return (
        <div className={styles.container}
            style={{ width: open ? '100vw' : '0' }}
        >
            <div className={styles.area}>
                <div className={styles.header}>
                    <div className={styles.loginArea} style={{ borderBottomColor: tenant.mainColor }}>
                        {user &&
                            <div className={styles.userInfo}>
                                <strong>{user.name}</strong>
                                Ultimo pedido a x semanas.
                            </div>
                        }
                        {!user &&
                            <Button color={tenant.mainColor}
                                label={`Fazer login`}
                                onClick={() => router.push(`/${tenant.slug}/login`)}
                                fill
                            />
                        }
                    </div>
                    <div className={styles.closeBtn} style={{ borderBottomColor: tenant.mainColor }} onClick={onClose}>x</div>
                </div>
                <div className={styles.line}></div>

                <div className={styles.menu}>
                    <SidebarMenuItem color={'#6A7D8B'} icon={"menu"} label={"Cardápio"} onClick={onClose} disabled={false} />
                    <SidebarMenuItem color={'#6A7D8B'} icon={"cart"} label={"Sacola"} onClick={() => router.push(`/${tenant.slug}/cart`)} disabled={false} />
                    <SidebarMenuItem color={'#6A7D8B'} icon={"fav"} label={"Favoritos"} onClick={() => { }} disabled={true} />
                    <SidebarMenuItem color={'#6A7D8B'} icon={"order"} label={"Meus pedidos"} onClick={() => router.push(`/${tenant.slug}/orders`)} disabled={false} />
                    <SidebarMenuItem color={'#6A7D8B'} icon={"config"} label={"Configurações"} onClick={() => { }} disabled={true} />
                </div>
                <div className={styles.menuBottom}>
                    {user &&
                        <SidebarMenuItem color={'#6A7D8B'} icon={"logout"} label={"Sair"} onClick={() => {
                            setToken('');
                            onClose();

                        }} disabled={false} />
                    }
                </div>

            </div>
        </div>
    )
}