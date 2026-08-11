import os

screens_dir = r"e:\lifed-LEWIS\frontend\src\screens"

# This dictionary maps screen names to their configuration.
# Types: 
#   'single_select' (requires options, store_key)
#   'multi_select' (requires options, store_key)
#   'likert' (requires items, scale, store_key)
#   'slider' (requires min_label, max_label, store_key)
#   'text' (requires store_key)
#   'custom' (will use placeholder with customized text)

config = {
    "Stage1_1Identity": {
        "title": "Identity & Life Roles",
        "subtitle": "Which of these describes you right now?",
        "type": "multi_select",
        "store_key": "identityRoles",
        "options": ["Student", "Professional", "Entrepreneur / self-employed", "Primary caregiver", "Homemaker", "Retired", "Between jobs", "In transition", "Taking time out", "Living with a health condition", "Wearing many hats"]
    },
    "Stage1_2Stability": {
        "title": "Life Stability Spectrum",
        "subtitle": "How would you describe where life feels right now?",
        "type": "slider",
        "store_key": "lifeStability",
        "min_label": "Very turbulent",
        "max_label": "Very steady"
    },
    "Stage1_3Pressures": {
        "title": "Active Life Pressures",
        "subtitle": "What's pressing on you most right now? Select all that apply.",
        "type": "multi_select",
        "store_key": "activePressures",
        "options": ["Workload", "Financial pressure", "Relationship strain", "Health concerns", "Caring responsibilities", "Housing issues", "Time scarcity", "World events", "Nothing specific"]
    },
    "Stage1_4Body": {
        "title": "Body & Movement Context",
        "subtitle": "How has your body been lately?",
        "type": "custom", 
        "custom_content": """
        <div className="form-group">
            <label>How active has your body been lately?</label>
            <select className="input-field" onChange={(e) => setProfileField('bodyMovement', e.target.value)} defaultValue="">
                <option value="" disabled>Select...</option>
                <option value="very_active">Very active</option>
                <option value="moderate">Moderately active</option>
                <option value="sedentary">Mostly sedentary</option>
            </select>
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>How has your sleep been?</label>
            <select className="input-field" onChange={(e) => setProfileField('sleepQuality', e.target.value)} defaultValue="">
                <option value="" disabled>Select...</option>
                <option value="good">Consistently good</option>
                <option value="mixed">Mixed/Okay</option>
                <option value="poor">Struggling</option>
            </select>
        </div>
        """
    },
    "Stage1_5Who5": {
        "title": "Overall Wellbeing (WHO-5)",
        "subtitle": "Over the last two weeks...",
        "type": "likert",
        "store_key": "who5",
        "scale": ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"],
        "items": ["I have felt cheerful and in good spirits", "I have felt calm and relaxed", "I have felt active and vigorous", "I woke up feeling fresh and rested", "My daily life has been filled with things that interest me"]
    },
    "Stage1_6Relational": {
        "title": "Relational Context",
        "subtitle": "How does your social world feel right now?",
        "type": "single_select",
        "store_key": "relationalContext",
        "options": ["Genuinely connected", "Okay, but could be better", "A bit lonely", "Quite isolated", "Overwhelming/Too much"]
    },
    "Stage1_7Priority": {
        "title": "Priority Ranking",
        "subtitle": "Drag these into the order that matters most to you right now.",
        "type": "custom",
        "custom_content": """<p className="sub" style={{color: 'var(--dawn)'}}>Interactive drag-and-drop coming soon.</p>"""
    },
    "Stage1_8Arrival": {
        "title": "Arrival State",
        "subtitle": "Before we go deeper - how would you describe arriving here today? One word, if you like.",
        "type": "text",
        "store_key": "arrivalState"
    },
    "Stage1_9Financial": {
        "title": "Financial Wellness Pulse",
        "subtitle": "Checking in on your financial context.",
        "type": "likert",
        "store_key": "financialPulse",
        "scale": ["Rarely", "Sometimes", "Often"],
        "items": ["How often do you worry about finances?", "Do you feel in control?", "Is your household finance organized?", "Is your income steady?"]
    },
    "Stage1_10Environment": {
        "title": "Environmental Pulse",
        "subtitle": "How does your physical environment feel right now?",
        "type": "custom",
        "custom_content": """
        <div className="form-group">
            <label>Do you have regular access to nature or green spaces?</label>
            <div className="chip-grid" style={{ justifyContent: 'flex-start' }}>
                {['Yes, easily', 'Occasionally', 'Rarely'].map(opt => (
                    <button key={opt} onClick={() => updateObjectField('environmentalPulse', 'natureAccess', opt)} className={`chip ${useLewisStore.getState().environmentalPulse?.natureAccess === opt ? 'selected' : ''}`}>{opt}</button>
                ))}
            </div>
        </div>
        """
    },
    "Stage1_11Intellectual": {
        "title": "Intellectual Pulse",
        "subtitle": "When did you last do something that genuinely stretched your mind or sparked your curiosity?",
        "type": "text",
        "store_key": "intellectualPulse"
    },
    "Stage5_2Pss10": {
        "title": "Emotional & Mental",
        "subtitle": "In the last month, how often have you...",
        "type": "likert",
        "store_key": "pss10",
        "scale": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "items": ["Been upset because of something that happened unexpectedly?", "Felt that you were unable to control the important things in your life?", "Felt nervous and 'stressed'?", "Found that you could not cope with all the things that you had to do?", "Been angered because of things that were outside of your control?", "Found yourself thinking about things that you have to accomplish?"]
    },
    "Stage5_2Ucla3": {
        "title": "Relationships & Social",
        "subtitle": "How often do you feel...",
        "type": "likert",
        "store_key": "ucla3",
        "scale": ["Hardly Ever", "Some of the time", "Often"],
        "items": ["That you lack companionship?", "Left out?", "Isolated from others?"]
    },
    "Stage5_2Diener": {
        "title": "Intellectual & Growth",
        "subtitle": "How much do you agree?",
        "type": "likert",
        "store_key": "diener",
        "scale": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "items": ["I lead a purposeful and meaningful life", "My social relationships are supportive and rewarding", "I am engaged and interested in my daily activities", "I actively contribute to the happiness and well-being of others", "I am competent and capable in the activities that are important to me", "I am a good person and live a good life", "I am optimistic about my future", "People respect me"]
    },
    "Stage5_2Swls": {
        "title": "Life Satisfaction",
        "subtitle": "How much do you agree?",
        "type": "likert",
        "store_key": "swls",
        "scale": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "items": ["In most ways my life is close to my ideal.", "The conditions of my life are excellent.", "I am satisfied with my life.", "So far I have gotten the important things I want in life.", "If I could live my life over, I would change almost nothing."]
    },
    "Stage6Sharing": {
        "title": "Everyday Sharing",
        "subtitle": "A few quick everyday moments... Tap how much you'd share in each.",
        "type": "likert",
        "store_key": "everydaySharing",
        "scale": ["Keep it to myself", "Share a little", "Share fully"],
        "items": ["Time", "Help/energy", "Trust", "Recognition", "Knowledge"]
    },
    "Stage7_2Prior": {
        "title": "Prior Attempts",
        "subtitle": "Have you tried to improve your wellbeing recently?",
        "type": "single_select",
        "store_key": "priorAttempts",
        "options": ["Yes, actively", "On and off", "Not really", "It feels too overwhelming"]
    },
    "Stage8_1EnergyArc": {
        "title": "Energy Arc Mapping",
        "subtitle": "Where's your energy, typically?",
        "type": "custom",
        "custom_content": """
        {['morning', 'afternoon', 'evening', 'night'].map(timeOfDay => (
            <div key={timeOfDay} className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ textTransform: 'capitalize' }}>{timeOfDay}</label>
                <div className="chip-grid" style={{ justifyContent: 'flex-start' }}>
                    {['High', 'Medium', 'Low'].map(level => (
                        <button key={level} 
                            onClick={() => updateObjectField('energyArc', timeOfDay, level)} 
                            className={`chip ${useLewisStore.getState().energyArc?.[timeOfDay] === level ? 'selected' : ''}`}
                        >{level}</button>
                    ))}
                </div>
            </div>
        ))}
        """
    },
    "Stage8_2StressPattern": {
        "title": "Stress-Pattern Clusters",
        "subtitle": "Select any that feel true for you lately.",
        "type": "multi_select",
        "store_key": "stressPatternClusters",
        "options": ["The Surge", "The Flatline", "The Fog", "The Cycle"]
    },
    "Stage8_3Recovery": {
        "title": "Recovery Responsiveness",
        "subtitle": "When you rest or take time out, how do you feel?",
        "type": "single_select",
        "store_key": "recoveryResponsiveness",
        "options": ["Refreshed quickly", "Takes a while to wind down", "Never really feel rested", "Guilty for resting"]
    },
    "Stage9Sensory": {
        "title": "Sound & Sensory Check-in",
        "subtitle": "Listen for a moment. Which feels best to you?",
        "type": "single_select",
        "store_key": "soundPreference",
        "options": ["Forest ambience", "Ocean waves", "Binaural beats / White noise", "Silence"]
    }
}

# Ordered screens list
app_screen_order = [
  'preStage0Age',
  'preStage0Sensory',
  'stage1_0About',
  'stage1_1Identity',
  'stage1_2Stability',
  'stage1_3Pressures',
  'stage1_4Body',
  'stage1_5Who5',
  'stage1_6Relational',
  'stage1_7Priority',
  'stage1_8Arrival',
  'stage1_9Financial',
  'stage1_10Environment',
  'stage1_11Intellectual',
  'stage1_12Cultural',
  'stage1_13BodyRhythm',
  'stage1_14SensoryPause',
  'stage2Attention',
  'stage3_1Affect',
  'stage3_2BodyMap',
  'stage3_3DayRhythm',
  'stage3_4Breathing',
  'stage3_5NsState',
  'stage3_6BodyAwareness',
  'stage4Maze',
  'stage5_1Landscape',
  'stage5_2Pss10',
  'stage5_2Ucla3',
  'stage5_2Gse',
  'stage5_2Promis',
  'stage5_2Cfpb5',
  'stage5_2Diener',
  'stage5_2Ins',
  'stage5_2Swls',
  'stage5_3DeepDives',
  'stage5_4BrightSpot',
  'stage5_5PriorityTension',
  'stage6Sharing',
  'stage7_1External',
  'stage7_2Prior',
  'stage7_3Aspiration',
  'stage7_4Support',
  'stage7_5Planner',
  'stage7_6Values',
  'stage7_7FinancialAsp',
  'stage8_1EnergyArc',
  'stage8_2StressPattern',
  'stage8_3Recovery',
  'stage8_4Cumulative',
  'stage9Sensory',
  'stage10Generating',
  'mirror'
]

template_top = """import React from 'react'
import {{ motion }} from 'framer-motion'
import {{ useLewisStore }} from '../store/useLewisStore.js'

export default function {component_name}() {{
  const {{ setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, {store_vars} }} = useLewisStore()

  const handleNext = () => {{
    setScreen('{next_screen}')
  }}

  return (
    <motion.div
      className="screen-container"
      initial={{{{ opacity: 0, y: 20 }}}}
      animate={{{{ opacity: 1, y: 0 }}}}
      exit={{{{ opacity: 0, y: -20 }}}}
    >
      <div className="content-wrapper" style={{{{ justifyContent: 'center', textAlign: 'center' }}}}>
        <h1 className="headline">{title}</h1>
        <p className="sub">{subtitle}</p>
        
        <div className="form-container" style={{{{ margin: '2rem auto' }}}}>
"""

template_bottom = """
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
"""

for i, camel_name in enumerate(app_screen_order):
    if camel_name in ['preStage0Age', 'preStage0Sensory', 'stage1_0About', 'mirror']:
        continue # Already customized
    if camel_name == 'mirror': continue
    
    next_screen = app_screen_order[i+1] if i + 1 < len(app_screen_order) else "mirror"
    
    # Capitalize for component and filename
    comp_name = camel_name[0].upper() + camel_name[1:] + "Screen"
    lookup_name = camel_name[0].upper() + camel_name[1:]
    
    if lookup_name not in config:
        # Fallback to placeholder if not defined in config
        c = {
            "title": f"Placeholder for {lookup_name}",
            "subtitle": "This screen is under construction.",
            "type": "custom",
            "custom_content": ""
        }
    else:
        c = config[lookup_name]
        
    store_vars = c.get('store_key', '')
    
    content = template_top.format(
        component_name=comp_name,
        next_screen=next_screen,
        title=c['title'],
        subtitle=c['subtitle'],
        store_vars=store_vars
    )
    
    if c['type'] == 'single_select':
        content += f'          <div className="chip-grid">\n'
        for opt in c['options']:
            content += f'            <button onClick={{() => setProfileField(\'{c["store_key"]}\', "{opt}")}} className={{`chip ${{{c["store_key"]} === "{opt}" ? \'selected\' : \'\'}}`}}>{opt}</button>\n'
        content += f'          </div>\n'
        
    elif c['type'] == 'multi_select':
        content += f'          <div className="chip-grid">\n'
        for opt in c['options']:
            content += f'            <button onClick={{() => toggleArrayItem(\'{c["store_key"]}\', "{opt}")}} className={{`chip ${(store_vars + " || []").replace(" ", "")}.includes("{opt}") ? \'selected\' : \'\'`}}>{opt}</button>\n'
        content += f'          </div>\n'
        
    elif c['type'] == 'slider':
        content += f"""
          <div style={{{{ display: 'flex', alignItems: 'center', gap: '1rem' }}}}>
            <span style={{{{ fontSize: '13px', color: 'var(--text-mute)' }}}}>{c['min_label']}</span>
            <input type="range" min="0" max="100" 
              value={{{c['store_key']} || 50}} 
              onChange={{(e) => setProfileField('{c["store_key"]}', parseInt(e.target.value))}} 
              style={{{{ flex: 1, accentColor: 'var(--dawn)' }}}} 
            />
            <span style={{{{ fontSize: '13px', color: 'var(--text-mute)' }}}}>{c['max_label']}</span>
          </div>
        """
        
    elif c['type'] == 'text':
        content += f"""
          <input type="text" className="input-field" placeholder="Type here..." 
            value={{{c['store_key']} || ''}} 
            onChange={{(e) => setProfileField('{c["store_key"]}', e.target.value)}} 
          />
        """
        
    elif c['type'] == 'likert':
        for idx, item in enumerate(c['items']):
            qId = f"q{idx}"
            content += f'          <div className="likert-container">\n'
            content += f'            <p className="likert-prompt">{item}</p>\n'
            content += f'            <div className="likert-options">\n'
            for opt in c['scale']:
                content += f'              <button onClick={{() => setScaleAnswer(\'{c["store_key"]}\', "{qId}", "{opt}")}} className={{`likert-btn ${{{c["store_key"]}?.{qId} === "{opt}" ? \'selected\' : \'\'}}`}}>{opt}</button>\n'
            content += f'            </div>\n'
            content += f'          </div>\n'
            
    elif c['type'] == 'custom':
        content += c.get('custom_content', '')
        
    content += template_bottom
    
    file_path = os.path.join(screens_dir, f"{comp_name}.jsx")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Generated screens successfully!")
