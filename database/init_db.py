"""
Smart Home Service Automation (HomeEase)
Database Initializer Script
Generates SQLite database 'smarthome.db' from schema.sql & seed_data.sql
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "smarthome.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")
SEED_PATH = os.path.join(BASE_DIR, "seed_data.sql")

def init_database():
    print(f"[*] Initializing database at: {DB_PATH}")
    
    # Remove existing DB if fresh setup desired
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print("[-] Existing database removed for clean rebuild.")
        except Exception as e:
            print(f"[!] Warning: Could not remove old DB: {e}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Execute Schema
    print("[+] Applying schema.sql...")
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)

    # 2. Execute Seed Data
    print("[+] Applying seed_data.sql...")
    with open(SEED_PATH, "r", encoding="utf-8") as f:
        seed_sql = f.read()
    cursor.executescript(seed_sql)

    conn.commit()

    # Verification summary
    print("\n--- Database Setup Summary ---")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall() if not row[0].startswith("sqlite_")]
    
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table};")
        count = cursor.fetchone()[0]
        print(f" • Table [{table}]: {count} records")

    conn.close()
    print("\n[OK] Database successfully created and seeded!\n")

if __name__ == "__main__":
    init_database()
