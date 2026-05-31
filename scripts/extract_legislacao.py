import os
import json

def extract_legislacao(sql_file, output_json):
    posts = {}
    postmeta = {}
    
    print(f"Iniciando extração do arquivo: {sql_file}")
    
    if not os.path.exists(sql_file):
        print("Arquivo SQL não encontrado!")
        return

    with open(sql_file, 'r', encoding='utf-8', errors='replace') as f:
        data = f.read()

    print("Arquivo carregado na memória. Extraindo wpxo_posts...")
    
    def extract_tuples_from_insert(table_name):
        insert_stmt = f"INSERT INTO `{table_name}`"
        all_tuples = []
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
                    all_tuples.append(current_tuple)
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
            
        return all_tuples

    posts_tuples = extract_tuples_from_insert("wpxo_posts")
    print(f"{len(posts_tuples)} tuples in wpxo_posts")
    
    target_types = {"leis", "portarias", "contrato", "decretos", "decreto", "portaria", "lei"}
    
    for row in posts_tuples:
        if len(row) > 20:
            post_id = row[0]
            post_date = row[2]
            post_content = row[4]
            post_title = row[5]
            post_status = row[7].strip("'")
            post_name = row[11]
            post_type = row[20].strip("'")
            
            if post_status == "publish" and post_type in target_types:
                posts[post_id] = {
                    "id": post_id,
                    "titulo": post_title.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "slug": post_name.strip("'"),
                    "data": post_date.strip("'"),
                    "conteudo": post_content.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "tipo": post_type,
                    "arquivos": []
                }

    meta_tuples = extract_tuples_from_insert("wpxo_postmeta")
    print(f"{len(meta_tuples)} tuples in wpxo_postmeta")
    
    for row in meta_tuples:
        if len(row) >= 4:
            post_id = row[1]
            meta_key = row[2].strip("'")
            meta_value = row[3].strip("'")
            
            if post_id in posts:
                if "meta" not in posts[post_id]:
                    posts[post_id]["meta"] = {}
                posts[post_id]["meta"][meta_key] = meta_value.replace("\\'", "'").replace('\\"', '"')

    print(f"Extraídos {len(posts)} posts válidos e meta dados.")
    
    final_posts = list(posts.values())

    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(final_posts, f, ensure_ascii=False, indent=2)
        
    print(f"Salvo em {output_json}")

if __name__ == "__main__":
    extract_legislacao(r"wordpress\cimaml55_wp821.sql", r"migracao_wp\legislacao_extraida.json")
