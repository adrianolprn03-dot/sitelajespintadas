import json

sql_file = r'wordpress\cimaml55_wp821.sql'

attachments = []
with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if line.startswith("INSERT INTO `wpxo_posts`"):
            rows = line.split("),(")
            for r in rows:
                if 'attachment' in r and 'application/pdf' in r:
                    parts = r.split("','")
                    # rough extraction of title and url
                    # usually guid is one of the last fields
                    try:
                        title = ""
                        url = ""
                        for p in parts:
                            if p.startswith("http") and ".pdf" in p:
                                url = p
                        attachments.append(url)
                    except:
                        pass

print(f"Found {len(attachments)} PDF attachments")
for a in attachments[:20]:
    print(a)
