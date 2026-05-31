import re
import json

paths = set()
with open(r'migracao_wp\prefe528_wp228.sql', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        matches = re.findall(r'(?:wp-content/uploads/|")([0-9]{4}/[0-9]{2}/[a-zA-Z0-9_\-\./]+\.pdf)', line)
        for m in matches:
            paths.add(m)

print("Total PDFs found:", len(paths))
with open(r'migracao_wp\pdfs_extraidos.json', 'w') as out:
    json.dump(list(paths), out, indent=2)
