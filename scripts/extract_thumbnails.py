import re
import json

def extract_thumbnails_streaming(sql_file):
    postmeta = {}
    attached_files = {}

    print("Reading SQL file line by line...")
    with open(sql_file, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            if "INSERT INTO `wpxo_postmeta`" in line:
                # Find all (meta_id, post_id, meta_key, meta_value)
                for match in re.finditer(r"\(\d+,\s*(\d+),\s*'_thumbnail_id',\s*'(\d+)'\)", line):
                    post_id = match.group(1)
                    thumb_id = match.group(2)
                    postmeta[post_id] = thumb_id

                for match in re.finditer(r"\(\d+,\s*(\d+),\s*'_wp_attached_file',\s*'([^']+)'\)", line):
                    thumb_id = match.group(1)
                    file_path = match.group(2)
                    attached_files[thumb_id] = file_path

    print(f"Found {len(postmeta)} thumbnail links.")
    print(f"Found {len(attached_files)} attached files.")

    post_images = {}
    for post_id, thumb_id in postmeta.items():
        if thumb_id in attached_files:
            post_images[post_id] = attached_files[thumb_id]

    print(f"Mapped {len(post_images)} posts to images.")
    
    with open("migracao_wp/post_images.json", "w") as out:
        json.dump(post_images, out)
        
extract_thumbnails_streaming(r"wordpress\cimaml55_wp821.sql")
