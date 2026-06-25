import styles from './Phase.module.css'
import {
  Card, SectionTitle, Caption, RadioGroup,
  SelectField, MultiSelect, Divider,
} from '../components/ui.jsx'
import NavButtons from './NavButtons.jsx'

export default function Phase1({ data, onChange, onNext, onBack }) {
  return (
    <div className={styles.phaseWrap}>

      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>Context & Life Stability</h2>
        <p className={styles.phaseSub}>
          Outline your world before diving into the assessment.
        </p>
      </div>

      <Card stagger={0}>
        <SectionTitle>🌍 Life Context</SectionTitle>
        <SelectField
          label="How would you describe where life feels right now?"
          name="life_stability"
          options={[
            'Turbulent — a lot is shifting',
            'Pressured — holding it together',
            'Steady — manageable but not easy',
            'Good — mostly positive',
            'Thriving — genuinely well',
          ]}
          value={data.life_stability ?? 'Steady — manageable but not easy'}
          onChange={onChange}
        />
        <SelectField
          label="What's pressing on you most right now?"
          name="top_pressure"
          options={[
            'Work & career demands',
            'Money & finances',
            "Health (mine or someone else's)",
            'Relationships & family',
            'Feeling lost or purposeless',
            'Nothing specific — just life',
          ]}
          value={data.top_pressure ?? 'Work & career demands'}
          onChange={onChange}
        />
        <RadioGroup
          label="Which of these describes you right now?"
          name="life_role"
          options={['Student', 'Professional', 'Caregiver', 'Parent', 'Between things', 'Multiple']}
          value={data.life_role}
          onChange={onChange}
        />
      </Card>

      <Card stagger={1}>
        <SectionTitle>🏃 Body & Sleep</SectionTitle>
        <RadioGroup
          label="How active has your body been lately?"
          name="body_activity"
          options={['Very sedentary', 'Light movement', 'Moderately active', 'Very active']}
          value={data.body_activity}
          onChange={onChange}
        />
        <RadioGroup
          label="How has your sleep been?"
          name="sleep_quality"
          options={['Really poor', 'Disrupted', 'Okay', 'Good', 'Excellent']}
          value={data.sleep_quality}
          onChange={onChange}
        />
        <Divider />
        <MultiSelect
          label="Any of these feel relevant to your body right now? (select all that apply)"
          name="body_flags"
          options={[
            'Low energy / fatigue',
            'Tension headaches',
            'Poor appetite or overeating',
            'Gut issues',
            'Frequent illness',
            'None of these',
          ]}
          value={data.body_flags ?? []}
          onChange={onChange}
        />
      </Card>

      <Card stagger={2}>
        <SectionTitle>🤝 Social World</SectionTitle>
        <RadioGroup
          label="How does your social world feel right now?"
          name="social_world"
          options={[
            'Very isolated',
            'A bit disconnected',
            'Okay — some people around',
            'Well connected',
            'Richly supported',
          ]}
          value={data.social_world}
          onChange={onChange}
        />
      </Card>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
