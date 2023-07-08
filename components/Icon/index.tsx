import MailSent from './mailsent.svg';
import Card from './card.svg'
import Checked from './checked.svg'
import Cupom from './cupom.svg'
import Location from './location.svg'
import Money from './money.svg'
import RightArrow from './rightarrow.svg'
import Dots from './dots.svg'
import Edit from './edit1.svg'
import Delete from './delete1.svg'

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
            case 'card':
                return Card;
            case 'checked':
                return Checked;
            case 'cupom':
                return Cupom;
            case 'location':
                return Location;
            case 'money':
                return Money;
            case 'rightArrow':
                return RightArrow;
            case 'dots':
                return Dots;
            case 'edit':
                return Edit;
            case 'delete':
                return Delete;
            // Adicione outros casos aqui para outros ícones, se necessário
            default:
                return "";
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