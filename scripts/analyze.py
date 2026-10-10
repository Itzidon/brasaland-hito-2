import csv
import os
import sys


ROOT_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)


from shared.incidents_analysis import (
    VALID_CATEGORIES,
    VALID_STATUSES,
    analyze_records,
    results_to_rows,
)


def load_csv(file_path):
    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:
        reader = csv.DictReader(file)
        return list(reader)


def print_report(results, source_file):
    print("=" * 60)
    print("  BRASALAND — INCIDENT REPORT ANALYSIS")
    print(f"  Source file: {os.path.basename(source_file)}")
    print("=" * 60)

    print()
    print(
        f"TOTAL RECORDS IN FILE .......... "
        f"{results['total_records']}"
    )
    print(
        f"  ├─ Valid records .............. "
        f"{results['valid_records']}"
    )
    print(
        f"  └─ Invalid / incomplete ....... "
        f"{results['invalid_records']}"
    )

    invalid = results["invalid_breakdown"]

    print()
    print("INVALID RECORDS BREAKDOWN")
    print(
        f"  ├─ Missing location_id ........ "
        f"{invalid['missing_location']}"
    )
    print(
        f"  ├─ Invalid or missing category  "
        f"{invalid['invalid_category']}"
    )
    print(
        f"  ├─ Empty description .......... "
        f"{invalid['empty_description']}"
    )
    print(
        f"  ├─ Missing reporter_id ........ "
        f"{invalid['missing_reporter']}"
    )
    print(
        f"  ├─ Invalid status .............. "
        f"{invalid['invalid_status']}"
    )
    print(
        f"  ├─ Closed case, no score ...... "
        f"{invalid['closed_without_score']}"
    )
    print(
        f"  └─ Score out of range ......... "
        f"{invalid['score_out_of_range']}"
    )

    print()
    print("BREAKDOWN BY CATEGORY (valid records)")

    for category in VALID_CATEGORIES:
        data = results["categories"][category]

        print(
            f"  ├─ {category:<20} "
            f"{data['count']:>3}  "
            f"({data['percentage']:.1f}%)"
        )

    print()
    print("BREAKDOWN BY STATUS (valid records)")

    for status in VALID_STATUSES:
        data = results["statuses"][status]

        print(
            f"  ├─ {status:<10} "
            f"{data['count']:>3}  "
            f"({data['percentage']:.1f}%)"
        )

    satisfaction = results["satisfaction"]

    print()
    print("SATISFACTION INDEX (closed cases)")
    print(
        f"  Scored cases: "
        f"{satisfaction['scored_cases']} "
        f"of {satisfaction['closed_cases']}"
    )
    print(
        f"  Average score: "
        f"{satisfaction['average_score']:.2f} / 5.00"
    )

    scores = satisfaction["scores"]

    print(
        f"  ├─ Score 1 (Very dissatisfied) ... "
        f"{scores['1']}"
    )
    print(
        f"  ├─ Score 2 (Dissatisfied) ........ "
        f"{scores['2']}"
    )
    print(
        f"  ├─ Score 3 (Neutral) ............. "
        f"{scores['3']}"
    )
    print(
        f"  ├─ Score 4 (Satisfied) ........... "
        f"{scores['4']}"
    )
    print(
        f"  └─ Score 5 (Very satisfied) ...... "
        f"{scores['5']}"
    )

    print()
    print("=" * 60)


def export_results(results):
    output_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "results.csv",
    )

    rows = results_to_rows(results)

    with open(
        output_path,
        "w",
        newline="",
        encoding="utf-8",
    ) as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "metric",
                "value",
                "percentage",
            ],
        )

        writer.writeheader()
        writer.writerows(rows)

    print()
    print(
        f"Results exported successfully to "
        f"{output_path}"
    )


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python analyze.py "
            "incidents-brasaland.csv"
        )
        return

    file_path = sys.argv[1]

    try:
        records = load_csv(file_path)

    except FileNotFoundError:
        print(
            f"Error: file not found: {file_path}"
        )
        return

    except Exception as error:
        print(
            f"Error reading file: {error}"
        )
        return

    if not records:
        print("Error: the CSV file contains no records.")
        return

    results = analyze_records(records)

    print_report(results, file_path)

    answer = input(
        "Export results to CSV? [y / n]: "
    ).strip().lower()

    if answer == "y":
        export_results(results)
    else:
        print("Results were not exported.")


if __name__ == "__main__":
    main()