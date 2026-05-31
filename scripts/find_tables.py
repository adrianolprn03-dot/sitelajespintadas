import re

def find_tables():
    tables = set()
    with open(r'wordpress\cimaml55_wp821.sql', 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if line.startswith('CREATE TABLE'):
                match = re.search(r'CREATE TABLE `([^`]+)`', line)
                if match:
                    tables.add(match.group(1))
    print("All tables found:", sorted(list(tables)))

find_tables()
