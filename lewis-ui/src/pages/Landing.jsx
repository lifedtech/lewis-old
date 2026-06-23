import styles from './Landing.module.css'
import { Card, RadioGroup, SelectField, SliderField, PrimaryBtn } from '../components/ui.jsx'

export default function Landing({ data, onChange, onNext }) {
  return (
    <div className={styles.wrap}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>🌿</div>
        <h1>How are you actually doing?</h1>
        <p>
          A warm, honest check-in across 9 dimensions of your wellbeing.
          Takes about 5–8 minutes. No clinical labels. No judgment.
        </p>
      </div>

      {/* Logistics */}
      <Card>
        <SliderField
          label="How many minutes do you have right now?"
          name="time_avail"
          min={1} max={15}
          value={data.time_avail ?? 5}
          onChange={onChange}
          leftLabel="1 min"
          rightLabel="15 min"
        />
        <SelectField
          label="Where are you completing this?"
          name="env"
          options={['Anywhere', 'Desk', 'Outside']}
          value={data.env ?? 'Anywhere'}
          onChange={onChange}
        />
      </Card>

      <Card>
        <RadioGroup
          label="How would you describe arriving here today?"
          name="arrival"
          options={['😤 Overwhelmed', '😔 Low & flat', '😰 Anxious & tense', '😐 Going through motions', '🙂 Okay, curious', '✨ Actually pretty good']}
          value={data.arrival}
          onChange={onChange}
        />
      </Card>

      <div className={styles.footer}>
        <PrimaryBtn onClick={onNext} disabled={!data.arrival} full>
          Begin Assessment →
        </PrimaryBtn>
        {!data.arrival && <p className={styles.hint}>Select how you're arriving to continue</p>}
      </div>
    </div>
  )
}
