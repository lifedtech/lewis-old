import styles from './Phase.module.css'
import {
  Card, SectionTitle, Caption,
  SliderField, RadioGroup, Divider,
} from '../components/ui.jsx'
import NavButtons from './NavButtons.jsx'

const BURNOUT = [
  'My workload regularly exceeds what I can comfortably manage.',
  'I feel emotionally drained at the end of most days.',
  'I have little time or energy for recovery between demands.',
]

const NUTRITION = [
  'My diet is balanced and I eat regular meals.',
  'I stay hydrated consistently throughout the day.',
  'Poor nutrition or hydration is affecting my energy and focus.',
]

const PHYSICAL = [
  'I sit or remain still for most of my working day.',
  'Lack of movement is affecting my mood or energy.',
  'I rarely engage in intentional physical activity.',
]

export default function Phase4({ data, onChange, onNext, onBack }) {
  const get = (key, def) => data[key] ?? def

  return (
    <div className={styles.phaseWrap}>

      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>Body, Burnout & Nourishment</h2>
        <p className={styles.phaseSub}>
          Your biological and workload baselines — these drive more than most people realise.
        </p>
      </div>

      <Card stagger={0}>
        <SectionTitle>🔥 Burnout & Workload</SectionTitle>
        <Caption>0 = Optimal · 4 = Severely depleted</Caption>
        {BURNOUT.map((q, i) => (
          <SliderField key={i} label={`${i + 1}. ${q}`} name={`bw${i}`}
            min={0} max={4} value={get(`bw${i}`, 2)}
            onChange={onChange} leftLabel="Optimal" rightLabel="Severe deficit" />
        ))}
      </Card>

      <Card stagger={1}>
        <SectionTitle>🥗 Nutrition & Hydration</SectionTitle>
        <Caption>0 = Optimal · 4 = Severely depleted</Caption>
        {NUTRITION.map((q, i) => (
          <SliderField key={i} label={`${i + 1}. ${q}`} name={`nh${i}`}
            min={0} max={4} value={get(`nh${i}`, 2)}
            onChange={onChange} leftLabel="Optimal" rightLabel="Severe deficit" />
        ))}
      </Card>

      <Card stagger={2}>
        <SectionTitle>🏃 Physical Activity</SectionTitle>
        <Caption>0 = Optimal · 4 = Severely sedentary</Caption>
        {PHYSICAL.map((q, i) => (
          <SliderField key={i} label={`${i + 1}. ${q}`} name={`pa${i}`}
            min={0} max={4} value={get(`pa${i}`, 2)}
            onChange={onChange} leftLabel="Optimal" rightLabel="Severe deficit" />
        ))}
      </Card>

      <Card stagger={3}>
        <SectionTitle>🧩 Intellectual & Cultural Belonging</SectionTitle>
        <RadioGroup
          label="When did you last do something that genuinely stretched your mind?"
          name="intel_stretch"
          options={['Today', 'This week', 'Last month', "Can't remember"]}
          value={data.intel_stretch}
          onChange={onChange}
        />
        <RadioGroup
          label="How much do you feel you belong to a community or culture that feels like home?"
          name="belonging"
          options={['Not at all', 'A little', 'Somewhat', 'Very much']}
          value={data.belonging}
          onChange={onChange}
        />
        <Divider />
        <SliderField
          label="There are traditions or shared ways of living I feel part of."
          name="traditions"
          min={0} max={4} value={get('traditions', 2)}
          onChange={onChange}
          leftLabel="Strongly disagree" rightLabel="Strongly agree"
        />
        <SliderField
          label="In the communities I'm part of, I can be myself."
          name="authenticity"
          min={0} max={4} value={get('authenticity', 2)}
          onChange={onChange}
          leftLabel="Strongly disagree" rightLabel="Strongly agree"
        />
      </Card>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
