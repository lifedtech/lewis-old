import { Card, SectionTitle, Caption, SliderField } from '../components/ui.jsx'
import NavButtons from './NavButtons.jsx'

const GSE = [
  'I can always manage to solve difficult problems if I try hard enough.',
  'If someone opposes me, I can find the means and ways to get what I want.',
  'It is easy for me to stick to my aims and accomplish my goals.',
  'I am confident I could deal efficiently with unexpected events.',
  'Thanks to my resourcefulness, I know how to handle unforeseen situations.',
  'I can solve most problems if I invest the necessary effort.',
  'I can remain calm when facing difficulties because I trust my coping abilities.',
  'When confronted with a problem, I can usually find several solutions.',
  'If I am in trouble, I can usually think of a solution.',
  'I can usually handle whatever comes my way.',
]

const CFPB = [
  'Because of my money situation, I feel I\'ll never have the things I want in life.',
  'I am just getting by financially.',
  'I am concerned that the money I have won\'t last.',
  'I have money left over at the end of the month.',
  'My finances control my life.',
]

const FLOURISHING = [
  'I lead a purposeful and meaningful life.',
  'My social relationships are supportive and rewarding.',
  'I am engaged and interested in my daily activities.',
  'I actively contribute to the happiness and wellbeing of others.',
  'I am competent and capable in activities important to me.',
  'I am a good person and live a good life.',
  'I am optimistic about my future.',
  'People respect me.',
]

export default function Phase3({ data, onChange, onNext, onBack }) {
  const get = (key, def) => data[key] ?? def

  return (
    <div>
      <Card>
        <SectionTitle>⚡ Accomplishment & Agency (Self-Efficacy Scale)</SectionTitle>
        <Caption>0 = Not at all true · 4 = Exactly true</Caption>
        {GSE.map((q, i) => (
          <SliderField
            key={i}
            label={`${i + 1}. ${q}`}
            name={`gse${i}`}
            min={0} max={4}
            value={get(`gse${i}`, 2)}
            onChange={onChange}
            leftLabel="Not true at all"
            rightLabel="Exactly true"
          />
        ))}
      </Card>

      <Card>
        <SectionTitle>💰 Financial Wellness (CFPB Scale)</SectionTitle>
        <Caption>Money affects wellbeing for almost everyone — answer as honestly as feels comfortable. &nbsp; 0 = Strongly disagree · 4 = Strongly agree</Caption>
        {CFPB.map((q, i) => (
          <SliderField
            key={i}
            label={`${i + 1}. ${q}`}
            name={`cfpb${i}`}
            min={0} max={4}
            value={get(`cfpb${i}`, 2)}
            onChange={onChange}
            leftLabel="Strongly disagree"
            rightLabel="Strongly agree"
          />
        ))}
      </Card>

      <Card>
        <SectionTitle>🌱 Purpose & Flourishing (Diener Scale)</SectionTitle>
        <Caption>0 = Strongly disagree · 4 = Strongly agree</Caption>
        {FLOURISHING.map((q, i) => (
          <SliderField
            key={i}
            label={`${i + 1}. ${q}`}
            name={`fl${i}`}
            min={0} max={4}
            value={get(`fl${i}`, 2)}
            onChange={onChange}
            leftLabel="Strongly disagree"
            rightLabel="Strongly agree"
          />
        ))}
      </Card>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
