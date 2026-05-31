import os

def check_statuses(sql_file):
    with open(sql_file, 'r', encoding='utf-8', errors='replace') as f:
        data = f.read()

    insert_stmt = f"INSERT INTO `wpxo_posts`"
    idx = 0
    statuses = set()
    target_types = {'leis', 'portarias', 'contrato', 'decretos', 'decreto', 'portaria', 'lei'}
    
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
                    post_type = current_tuple[20].strip("'")
                    post_status = current_tuple[7].strip("'")
                    if post_type in target_types:
                        statuses.add(post_status)

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
        
    print("Statuses encontrados:", statuses)

if __name__ == "__main__":
    check_statuses(r"wordpress\cimaml55_wp821.sql")
