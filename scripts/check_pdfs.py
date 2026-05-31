import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('migracao_wp/noticias_extraidas.json', encoding='utf-8'))
pdfs = []
for x in data:
    if 'pdf' in (x.get('conteudo') or '').lower():
        pdfs.append({'id': x['id'], 'titulo': x['titulo'], 'tipo': x['tipo']})

print(f'Found {len(pdfs)} items with pdf in noticias/pages')
for p in pdfs:
    print(f"{p['id']} - {p['titulo']} ({p['tipo']})")
