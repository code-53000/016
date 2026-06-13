import os
import time
import sys

import psycopg2


def wait_for_db():
    max_retries = 30
    retry_count = 0

    db_config = {
        "dbname": os.environ.get("DB_NAME", "guqin"),
        "user": os.environ.get("DB_USER", "guqin"),
        "password": os.environ.get("DB_PASSWORD", "guqin_secret"),
        "host": os.environ.get("DB_HOST", "db"),
        "port": os.environ.get("DB_PORT", "5432"),
    }

    while retry_count < max_retries:
        try:
            conn = psycopg2.connect(**db_config)
            conn.close()
            print("\nDatabase is ready!")
            return 0
        except psycopg2.OperationalError as e:
            retry_count += 1
            print(".", end="", flush=True)
            time.sleep(1)

    print("\nFailed to connect to database after 30 retries")
    return 1


if __name__ == "__main__":
    sys.exit(wait_for_db())
