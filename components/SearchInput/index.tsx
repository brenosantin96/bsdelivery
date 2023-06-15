import { useState } from 'react'
import styles from './styles.module.css'
import SearchIcon from './searchIcon.svg';


type PropsSearchInput = {
    mainColor: string;
    onSearch: (searchValue: string) => void;
}

export const SearchInput = ({ mainColor, onSearch }: PropsSearchInput) => {

    const [focused, setFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch(searchValue);
        }
    }

    return (
        <div className={styles.container} style={{ borderColor: focused ? mainColor : '#FFFFFF' }}>
            <div className={styles.button} onClick={() => onSearch(searchValue)}>
                <SearchIcon className={styles.svgSearchIcon} color={mainColor} />
            </div>
            <input
                className={styles.input}
                type="text"
                placeholder='Digite o nome do produto'
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyUp={handleKeyUp}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
}