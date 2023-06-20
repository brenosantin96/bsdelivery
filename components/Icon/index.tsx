import MailSent from './mailsent.svg';

type Props = {
    icon: string;
    color: string;
    width: number;
    height: number;
};

export const Icon = ({ icon, color, width, height }: Props) => {

    const getIconComponent = (icon: string) => {
        switch (icon) {
            case 'mailsent':
                return MailSent;
            // Adicione outros casos aqui para outros ícones, se necessário
            default:
                return null;
        }
    };

    const IconComponent = getIconComponent(icon);

    return <IconComponent color={color} width={width} height={height} />;
};




/* import MailSent from './mailsent.svg'

type Props = {
    icon: string;
    color: string;
    width: number;
    height: number
}

export const Icon = ({ icon, color, width, height }: Props) => {
    return (
        <div style={{ width, height }}>
            {icon === 'mailsent' && <MailSent color={color} />}
        </div>
    )
}
 */