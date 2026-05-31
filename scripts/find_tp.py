import json

sql_file = r'wordpress\cimaml55_wp821.sql'
with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if line.startswith("INSERT INTO `wpxo_options`"):
            if 'tablepress_tables' in line:
                rows = line.split("),(")
                for r in rows:
                    if 'tablepress_tables' in r:
                        print("Found tablepress_tables in options!")
                        print(r[:1000])
