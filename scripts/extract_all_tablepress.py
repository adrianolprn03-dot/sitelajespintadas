import json
import re

sql_file = r'wordpress\cimaml55_wp821.sql'

tables = {}
with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if line.startswith("INSERT INTO `wpxo_posts`"):
            # The line is huge, split by "),"
            parts = line.split("),(")
            for p in parts:
                if 'tablepress_table' in p:
                    # Very rough extraction
                    # A typical post row: (ID, author, date, date_gmt, content, title, excerpt, status, comment_status, ping_status, password, name, to_ping, pinged, modified, modified_gmt, content_filtered, parent, guid, menu_order, type, mime_type, comment_count)
                    # We can try to regex extract the ID and the JSON content
                    m = re.search(r"^\(?(\d+),.*?'(.*?)','tablepress_table'", p)
                    if m:
                        post_id = m.group(1)
                        # the JSON content is somewhere before the title
                        # let's just find the JSON array inside this string
                        m_json = re.search(r'(\[\[.*?\]\])', p)
                        if m_json:
                            tables[post_id] = m_json.group(1)
                            
with open("migracao_wp/all_tablepress.json", "w", encoding='utf-8') as out:
    json.dump(tables, out, indent=2, ensure_ascii=False)

print(f"Extracted {len(tables)} tablepress tables to migracao_wp/all_tablepress.json")
