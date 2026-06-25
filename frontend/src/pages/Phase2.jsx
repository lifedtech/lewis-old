import styles from './Phase.module.css'
import { Card, SectionTitle, Caption, SliderField, Divider } from '../components/ui.jsx'
import NavButtons from './NavButtons.jsx'

const WHO5 = [
  'I have felt cheerful and in good spirits.',
  'I have felt calm and relaxed.',
  'I have felt active and vigorous.',
  'I woke up feeling fresh and rested.',
  'My daily life has been filled with things that interest me.',
]

const PSS10 = [
  'You were upset because of something that happened unexpectedly?',
  'You felt unable to control important things in your life?',
  'You felt nervous and stressed?',
  'You felt confident about your ability to handle personal problems?',
  'Things were going your way?',
  'You could not cope with all the things you had to do?',
  'You were able to control irritations in your life?',
  'You felt that you were on top of things?',
  'You were angered because of things outside your control?',
  'Difficulties were piling up so high you could not overcome them?',
]

const UCLA3 = [
  'How often do you feel that you lack companionship?',
  'How often do you feel left out?',
  'How often do you feel isolated from others?',
]

const SQI4 = [
  'Overall sleep quality last week',
  'Difficulty falling or staying asleep',
  'Waking up feeling unrefreshed',
  'Sleep disrupting daily functioning',
]

export default function Phase2({ data, onChange, onNext, onBack }) {
  const get = (key, def) => data[key] ?? def

  return (
    <div className={styles.phaseWrap}>

      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>Emotional & Mental Wellbeing</h2>
        <p className={styles.phaseSub}>
          These questions use validated scales. Answer honestly — there are no right answers.
        </p>
      </div>

      {/* WHO-5 */}
      <Card stagger={0}>
        <SectionTitle>🌤 Emotional Wellbeing (WHO-5)</SectionTitle>
        <Caption>Over the last two weeks — how often? · 0 = At no time · 5 = All of the time</Caption>
        {WHO5.map((q, i) => (
          <SliderField
            key={i}
            label={`${i + 1}. ${q}`}
            name={`w${i}`}
            min={0} max={5}
            value={get(`w${i}`, 3)}
            onChange={onChange}
            leftLabel="At no time"
            rightLabel="All of the time"
          />
        ))}
      </Card>

      {/* PSS-10 */}
      <Card stagger={1}>
        <SectionTitle>🧠 Stress Load (PSS-10)</SectionTitle>
        <Caption>In the last month — how often? · 0 = Never · 4 = Very often</Caption>
        {PSS10.map((q, i) => (
          <SliderField
            key={i}
            label={`${i + 1}. ${q}`}
            name={`p${i}`}
            min={0} max={4}
            value={get(`p${i}`, 2)}
            onChange={onChange}
            leftLabel="Never"
            rightLabel="Very often"
          />
        ))}
      </Card>

      {/* UCLA-3 */}
      <Card stagger={2}>
        <SectionTitle>🤝 Connection & Loneliness (UCLA-3)</SectionTitle>
        <Caption>1 = Hardly ever · 3 = Often</Caption>
        {UCLA3.map((q, i) => (
          <SliderField
            key={i}
            label={q}
            name={`u${i}`}
            min={1} max={3}
            value={get(`u${i}`, 2)}
            onChange={onChange}
            leftLabel="Hardly ever"
            rightLabel="Often"
          />
        ))}
      </Card>

      {/* SQI-4 */}
      <Card stagger={3}>
        <SectionTitle>😴 Sleep Quality (SQI-4)</SectionTitle>
        <Caption>0 = Good · 3 = Terrible</Caption>
        {SQI4.map((q, i) => (
          <SliderField
            key={i}
            label={`${i + 1}. ${q}`}
            name={`s${i}`}
            min={0} max={3}
            value={get(`s${i}`, 1)}
            onChange={onChange}
            leftLabel="Good"
            rightLabel="Terrible"
          />
        ))}
      </Card>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
