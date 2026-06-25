import styles from './Phase.module.css'
import navStyles from './Phase6.module.css'
import { Card, SectionTitle, RadioGroup, PrimaryBtn, GhostBtn } from '../components/ui.jsx'

export default function Phase6({ data, onChange, onNext, onBack }) {
  return (
    <div className={styles.phaseWrap}>

      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>Support Preferences & Future Readiness</h2>
        <p className={styles.phaseSub}>
          Last section — tailor your prescription to how you actually work best.
        </p>
      </div>

      <Card stagger={0}>
        <SectionTitle>📍 Recent Attempts & Future Vision</SectionTitle>
        <RadioGroup
          label="Have you tried to improve your wellbeing recently?"
          name="prev_attempts"
          options={[
            'Never tried',
            "Tried but it didn't stick",
            'A few things help',
            'Consistently working on it',
          ]}
          value={data.prev_attempts}
          onChange={onChange}
        />
        <RadioGroup
          label="Imagine your wellbeing six months from now, if things shifted in the right direction. How does it feel?"
          name="future_vision"
          options={[
            "Can't picture it",
            'Slightly better',
            'Noticeably better',
            'Significantly transformed',
            'Already on that path',
          ]}
          value={data.future_vision}
          onChange={onChange}
        />
      </Card>

      <Card stagger={1}>
        <SectionTitle>🎯 How You Work Best</SectionTitle>
        <RadioGroup
          label="When it comes to support and guidance, what works best for you?"
          name="support_pref"
          options={[
            'Practical steps & tools',
            'Emotional validation first',
            'Data and explanations',
            'Just tell me what to do',
            'Gentle nudges over time',
          ]}
          value={data.support_pref}
          onChange={onChange}
        />
        <RadioGroup
          label="How do you prefer to take in information and guidance?"
          name="info_mode"
          options={[
            'Reading / articles',
            'Videos or audio',
            'Conversation / coaching',
            'Short bite-sized tips',
            'Visual / infographics',
          ]}
          value={data.info_mode}
          onChange={onChange}
        />
        <RadioGroup
          label="How do you feel about planning right now?"
          name="planning_ready"
          options={[
            'Too overwhelmed to plan',
            'Open to gentle suggestions',
            'Ready for a 7-day plan',
            'Give me a full roadmap',
          ]}
          value={data.planning_ready}
          onChange={onChange}
        />
      </Card>

      <Card stagger={2}>
        <SectionTitle>🔮 Values & Connection</SectionTitle>
        <RadioGroup
          label="Do you have a set of values or beliefs that guides how you live?"
          name="values_present"
          options={['Not really', 'Somewhat', 'Yes, strongly']}
          value={data.values_present}
          onChange={onChange}
        />
        <RadioGroup
          label="How connected do you feel to something larger than yourself — community, nature, beliefs, or purpose?"
          name="transcendence"
          options={['Disconnected', 'Occasionally connected', 'Moderately', 'Deeply connected']}
          value={data.transcendence}
          onChange={onChange}
        />
        <RadioGroup
          label="In your ideal future, how does your relationship with money feel?"
          name="fin_future"
          options={[
            'Stable and stress-free',
            'Abundant',
            'Just enough',
            "I haven't thought about it",
          ]}
          value={data.fin_future}
          onChange={onChange}
        />
        <RadioGroup
          label="When you rest or take time out, how do you feel?"
          name="rest_feel"
          options={['Guilty', 'Restless', 'Disconnected', 'Okay', 'Genuinely restored']}
          value={data.rest_feel}
          onChange={onChange}
        />
      </Card>

      <div className={navStyles.navRow}>
        <GhostBtn onClick={onBack}>← Back</GhostBtn>
        <PrimaryBtn onClick={onNext}>🧠 Run My Assessment</PrimaryBtn>
      </div>
    </div>
  )
}
