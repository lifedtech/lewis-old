import styles from './NavButtons.module.css'
import { PrimaryBtn, GhostBtn } from '../components/ui.jsx'

export default function NavButtons({ onBack, onNext, nextLabel = 'Next →' }) {
  return (
    <div className={styles.row}>
      <GhostBtn onClick={onBack}>← Back</GhostBtn>
      <PrimaryBtn onClick={onNext}>{nextLabel}</PrimaryBtn>
    </div>
  )
}
