import zipfile
import os

zip_path = r'wordpress\uploud.zip'
extract_dir = r'migracao_wp\uploads'

print("Extracting PDFs from zip...")
os.makedirs(extract_dir, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as z:
    for file_info in z.infolist():
        if file_info.filename.lower().endswith('.pdf'):
            try:
                # Some filenames have invalid cp437 encoding
                # Just extract normally and let zipfile handle it
                z.extract(file_info, extract_dir)
            except Exception as e:
                print(f"Failed to extract {file_info.filename}: {e}")
                
print("Extraction complete!")
