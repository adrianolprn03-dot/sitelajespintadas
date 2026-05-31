import re
import json

def extract_tablepress(sql_file, output_json):
    print(f"Buscando tabelas do TablePress em {sql_file}...")
    
    with open(sql_file, 'r', encoding='utf-8', errors='replace') as f:
        data = f.read()

    # Tablepress stores table data in wp_posts as post_type = 'tablepress_table'
    # The post_content contains the JSON of the table.
    tables = []
    
    insert_stmt = "INSERT INTO `wpxo_posts`"
    idx = 0
    while True:
        idx = data.find(insert_stmt, idx)
        if idx == -1:
            break
            
        values_idx = data.find("VALUES", idx)
        if values_idx == -1:
            idx += len(insert_stmt)
            continue
            
        tuple_start = data.find("(", values_idx)
        if tuple_start == -1:
            idx += len(insert_stmt)
            continue
            
        length = len(data)
        in_string = False
        escape = False
        current_val = []
        current_tuple = []
        
        curr_idx = tuple_start
        while curr_idx < length:
            c = data[curr_idx]
            
            if escape:
                current_val.append(c)
                escape = False
            elif c == '\\':
                current_val.append(c)
                escape = True
            elif c == "'":
                in_string = not in_string
            elif c == ',' and not in_string:
                current_tuple.append(''.join(current_val).strip())
                current_val = []
            elif c == ')' and not in_string:
                current_tuple.append(''.join(current_val).strip())
                if len(current_tuple) > 20:
                    post_id = current_tuple[0]
                    post_content = current_tuple[4].strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", "")
                    post_title = current_tuple[5].strip("'").replace("\\'", "'")
                    post_type = current_tuple[20].strip("'")
                    
                    if post_type == "tablepress_table":
                        try:
                            table_data = json.loads(post_content)
                            tables.append({
                                "id": post_id,
                                "name": post_title,
                                "data": table_data
                            })
                        except json.JSONDecodeError:
                            pass

                current_tuple = []
                current_val = []
                
                curr_idx += 1
                while curr_idx < length and data[curr_idx] in (' ', '\\n', '\\r', '\\t', '\n', '\r'):
                    curr_idx += 1
                if curr_idx < length:
                    if data[curr_idx] == ',':
                        curr_idx = data.find("(", curr_idx)
                        if curr_idx == -1:
                            break
                        curr_idx -= 1
                    elif data[curr_idx] == ';':
                        idx = curr_idx
                        break
                    else:
                        break
            else:
                if in_string or c not in ('(', ' ', '\\n', '\\r', '\n', '\r'):
                    current_val.append(c)
            curr_idx += 1
        idx += len(insert_stmt)
        
    print(f"Extraídas {len(tables)} tabelas do TablePress.")
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(tables, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    extract_tablepress(r"wordpress\cimaml55_wp821.sql", r"migracao_wp\tablepress.json")
