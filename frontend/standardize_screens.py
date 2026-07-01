import os
import re

screens_dir = r"e:\lifed-LEWIS\frontend\src\screens"

# Regex pattern to match the unstyled placeholder
pattern = re.compile(
    r'<div className="content-wrapper">\s*<h2 className="question-text">Placeholder for (.*?)</h2>(.*?)<div className="button-group" style={{ marginTop: \'auto\' }}>',
    re.DOTALL
)

for filename in os.listdir(screens_dir):
    if filename.endswith("Screen.jsx"):
        file_path = os.path.join(screens_dir, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # The replacement uses the standard classes and flex centering
        def replacer(match):
            screen_name = match.group(1)
            inner_content = match.group(2)
            
            return (
                f'<div className="content-wrapper" style={{ justifyContent: \'center\', textAlign: \'center\' }}>\n'
                f'        <h1 className="headline">Placeholder for {screen_name}</h1>\n'
                f'        <p className="sub">This screen is under construction.</p>\n'
                f'{inner_content}'
                f'<div className="button-group" style={{ marginTop: \'2rem\' }}>'
            )
            
        new_content = pattern.sub(replacer, content)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
