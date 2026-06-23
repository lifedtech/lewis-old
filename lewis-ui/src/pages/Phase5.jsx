import { Card, SectionTitle, RadioGroup } from '../components/ui.jsx'
import NavButtons from './NavButtons.jsx'

export default function Phase5({ data, onChange, onNext, onBack }) {
  return (
    <div>
      <Card>
        <SectionTitle>🏡 Physical Environment</SectionTitle>
        <RadioGroup
          label="How does your physical environment feel right now?"
          name="phys_env"
          options={['Chaotic / stressful', 'Cramped or uncomfortable', 'Neutral', 'Comfortable', 'Calm and restorative']}
          value={data.phys_env}
          onChange={onChange}
        />
        <RadioGroup
          label="Do you have regular access to nature or green spaces?"
          name="nature_access"
          options={['Rarely or never', 'Occasionally', 'Regularly', 'Daily']}
          value={data.nature_access}
          onChange={onChange}
        />
      </Card>

      <Card>
        <SectionTitle>💰 Financial & Environmental Context</SectionTitle>
        <RadioGroup
          label="How does thinking about your finances feel right now?"
          name="fin_feel"
          options={['Deeply anxious', 'Worried', 'Neutral', 'Mostly okay', 'Secure']}
          value={data.fin_feel}
          onChange={onChange}
        />
        <RadioGroup
          label="Do you feel in control of your financial situation?"
          name="fin_control"
          options={['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely']}
          value={data.fin_control}
          onChange={onChange}
        />
        <RadioGroup
          label="How are finances organised in your household?"
          name="fin_org"
          options={['Shared / joint', 'Mainly my responsibility', 'Partner manages', 'Independent', 'Complicated']}
          value={data.fin_org}
          onChange={onChange}
        />
        <RadioGroup
          label="How steady is your income, month to month?"
          name="income_stability"
          options={['Very unstable', 'Irregular', 'Mostly steady', 'Stable', 'Very stable']}
          value={data.income_stability}
          onChange={onChange}
        />
      </Card>

      <Card>
        <SectionTitle>🌐 World Context</SectionTitle>
        <RadioGroup
          label="Are there things going on in the world around you — not just your personal life — affecting how you feel?"
          name="world_impact"
          options={['Yes, significantly', 'Yes, somewhat', 'Not really', 'No']}
          value={data.world_impact}
          onChange={onChange}
        />
      </Card>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
