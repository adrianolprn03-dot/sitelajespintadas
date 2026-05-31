import json
import re

sql_file = r'wordpress\cimaml55_wp821.sql'

with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if line.startswith("INSERT INTO `wpxo_options`"):
            # find tablepress_tables
            if 'tablepress_tables' in line:
                # The data is serialized PHP: a:2:{s:8:"table_id";s:4:"post_id"...}
                # Let's just find the string that looks like it
                match = re.search(r"'tablepress_tables',\s*'(.*?)'", line)
                if match:
                    print("Found tablepress_tables in options!")
                    print(match.group(1)[:500])
