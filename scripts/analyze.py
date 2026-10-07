import csv
import sys


def load_csv(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)


def main():
    if len(sys.argv) < 2:
        print("Uso: python analyze.py incidents-brasaland.csv")
        return

    file_path = sys.argv[1]
    records = load_csv(file_path)

    print(f"Total records: {len(records)}")


if __name__ == "__main__":
    main()
