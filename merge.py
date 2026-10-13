"""Sameina Pico og CSS-skrár í eina þjappaða stílsíðu. Keyra: python3 merge.py"""
from pathlib import Path
import re

grunnur = Path(__file__).resolve().parent
files_names = [
    "new", "grid", "table", "form", "menues", "popup", "icomoon",
    "chatbox", "kvikun", "accordion", "custom"
]
data = (grunnur / "css" / "pico.min.css").read_text(encoding="utf-8") + "\n"

for file_name in files_names:
    with open(grunnur / "css" / (file_name + ".css"), "r", encoding="utf-8") as file_handle:
        temp_data = file_handle.read()
        data = data + temp_data + "\n"

# Þessar skrár innihalda ekki texta með CSS-táknum eða innfelld data-URL.
# Bil í calc() eru varðveitt. /*! leyfisathugasemdir eru varðveittar líka.
data = re.sub(r"/\*(?!\!)[\s\S]*?\*/", "", data)
data = re.sub(r"\s+", " ", data)
data = re.sub(r"\s*([{}:;,])\s*", r"\1", data).strip()

with open(grunnur / "styles.min.css", "w", encoding="utf-8") as file_handle:
    file_handle.write(data)

print("styles.min.css var uppfærð -", len(data.encode("utf-8")), "bæti")
