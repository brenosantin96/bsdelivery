import { useState } from 'react'
import styles from './styles.module.css'
import EyeOn from './EyeOn.svg';
import EyeOff from './EyeOff.svg';
import { useAppContext } from '@/contexts/AppContext';
import Link from 'next/link';

type Props = {
    color: string;
    placeholder: string;
    value: string;
    onChange: (newValue: string) => void;
    password?: boolean
}

export const InputField = ({ color, placeholder, value, onChange, password }: Props) => {

    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className={styles.container} style={{borderColor: focused ? color : '#F9F9FB', backgroundColor: focused ? '#FFF' : '#F9F9FB'}}>
            <input
                type={password ? (showPassword ? 'text' : 'password') : 'text'}
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)} //por fora enviar por ex um setEmail na props, que roda o onchange.
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />

            {password &&
                <div className={styles.showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword && <EyeOn color={'#CCC'} className={styles.svgIcon} />}
                    {!showPassword && <EyeOff color={'#CCC'} className={styles.svgIcon} />}
                </div>
            }
        </div>

    )
}

/*
tecnica de fazer INPUT junto com alguma coisa junto
colocar um flex na div pai, 

colocar o INPUT dentro de uma div 

colocar as propriedades no INPUT: 
flex: 1;
border: 0;
outline: 0;
background: transparent;


o icone ou qualquer coisa que tiver na div junto com o input, especificar um width e height
para alterar borda da div, tem que revisar se esta focado
const [focused, setFocused] = useState(false); onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}

*/