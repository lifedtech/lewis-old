import os
import re

screens_dir = r"e:\lifed-LEWIS\frontend\src\screens"

# Regex pattern to match the incorrect style attribute
pattern = re.compile(
    r'style=\{ justifyContent: \'center\', textAlign: \'center\' \}'
)

for filename in os.listdir(screens_dir):
    if filename.endswith("Screen.jsx"):
        file_path = os.path.join(screens_dir, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = pattern.sub(r"style={{ justifyContent: 'center', textAlign: 'center' }}", content)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Fixed {filename}")
