import styles from './styles.module.scss'
import { formatDate } from '../../utils/formatDate'

export default function Header() {  
  const currentDate = formatDate(new Date())

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />
      <p>O melhor para você ouvir, sempre</p>
      <span>{currentDate}</span>
    </header>
  )
}
