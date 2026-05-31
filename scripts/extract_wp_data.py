import os
import json

def extract_wp_data(sql_file, output_json):
    posts = {}
    postmeta = {}
    
    print(f"Iniciando extração do arquivo: {sql_file}")
    
    if not os.path.exists(sql_file):
        print("Arquivo SQL não encontrado!")
        return

    # To handle multi-line inserts, we parse the whole file char by char or chunk by chunk
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
                            idx = curr_idx # Move outer loop
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
    
    for row in posts_tuples:
        if len(row) > 20:
            post_id = row[0]
            post_date = row[2]
            post_content = row[4]
            post_title = row[5]
            post_excerpt = row[6]
            post_status = row[7]
            post_name = row[11]
            post_type = row[20]
            
            print(f"ID: {post_id}, status: {post_status}, type: {post_type}")
            
            if post_status == "'publish'" and post_type in ("'post'", "'page'"):
                posts[post_id] = {
                    "id": post_id,
                    "titulo": post_title.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "slug": post_name.strip("'"),
                    "data": post_date.strip("'"),
                    "conteudo": post_content.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "resumo": post_excerpt.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "tipo": post_type.strip("'"),
                    "imagem_path": None
                }
            elif post_status.strip("'") == "publish" and post_type.strip("'") in ("post", "page"):
                # fallback just in case
                posts[post_id] = {
                    "id": post_id,
                    "titulo": post_title.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "slug": post_name.strip("'"),
                    "data": post_date.strip("'"),
                    "conteudo": post_content.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "resumo": post_excerpt.strip("'").replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", ""),
                    "tipo": post_type.strip("'"),
                    "imagem_path": None
                }

    meta_tuples = extract_tuples_from_insert("wpxo_postmeta")
    print(f"{len(meta_tuples)} tuples in wpxo_postmeta")
    
    for row in meta_tuples:
        if len(row) >= 4:
            meta_id = row[0]
            post_id = row[1]
            meta_key = row[2]
            meta_value = row[3]
            
            if post_id not in postmeta:
                postmeta[post_id] = {}
            postmeta[post_id][meta_key.strip("'")] = meta_value.strip("'")

    print(f"Extraídos {len(posts)} posts/páginas válidos e meta dados para {len(postmeta)} posts.")
    
    final_noticias = []
    for pid, post in posts.items():
        thumbnail_id = None
        if pid in postmeta and '_thumbnail_id' in postmeta[pid]:
            thumbnail_id = postmeta[pid]['_thumbnail_id']
            
        if thumbnail_id and thumbnail_id in postmeta and '_wp_attached_file' in postmeta[thumbnail_id]:
            post["imagem_path"] = postmeta[thumbnail_id]['_wp_attached_file'].replace("\\/", "/")
            
        final_noticias.append(post)

    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(final_noticias, f, ensure_ascii=False, indent=2)
        
    print(f"Salvo em {output_json}")

if __name__ == "__main__":
    extract_wp_data(r"wordpress\cimaml55_wp821.sql", r"migracao_wp\noticias_extraidas.json")
