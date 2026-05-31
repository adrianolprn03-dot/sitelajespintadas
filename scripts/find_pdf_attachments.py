import json
import re
import traceback

try:
    sql_file = r'wordpress\cimaml55_wp821.sql'
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        data = f.read()

    # Find the insert into wpxo_posts
    matches = list(re.finditer(r"INSERT INTO `wpxo_posts` VALUES (.*?);", data, flags=re.DOTALL))
    print(f"Found {len(matches)} INSERT blocks for wpxo_posts")
    
    pdfs = []
    
    for match in matches:
        content = match.group(1)
        # Split by "),("
        rows = content.split("),(")
        for row in rows:
            if row.startswith("("):
                row = row[1:]
            if row.endswith(")"):
                row = row[:-1]
                
            # very rough parse: check if it has application/pdf
            if 'application/pdf' in row:
                parts = row.split(",")
                try:
                    post_id = parts[0]
                    # title is parts[5] roughly
                    pdfs.append(post_id)
                except:
                    pass
                    
    print(f"Found {len(pdfs)} PDF attachments in wpxo_posts.")
except Exception as e:
    traceback.print_exc()
