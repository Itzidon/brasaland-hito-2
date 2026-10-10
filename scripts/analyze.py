import csv
import sys
import os
from collections import Counter


VALID_LOCATIONS = [
    "COL-01", "COL-02", "COL-03", "COL-04", "COL-05",
    "COL-06", "COL-07", "COL-08", "COL-09", "COL-10",
    "FLA-01", "FLA-02", "FLA-03", "FLA-04"
]

VALID_CATEGORIES = [
    "CUSTOMER_COMPLAINT",
    "EQUIPMENT",
    "SUPPLY",
    "FOOD_QUALITY",
    "STAFF"
]

VALID_STATUSES = [
    "OPEN",
    "CLOSED",
    "DISCARDED"
]


def load_csv(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)


def validate_record(record):
    errors = []

    if record["location_id"] not in VALID_LOCATIONS:
        errors.append("missing_location")

    if record["category"] not in VALID_CATEGORIES:
        errors.append("invalid_category")

    if not record["description"] or len(record["description"].strip()) < 5:
        errors.append("empty_description")

    if not record["reporter_id"]:
        errors.append("missing_reporter")

    if record["status"] not in VALID_STATUSES:
        errors.append("invalid_status")

    if record["status"] == "CLOSED" and not record["satisfaction_score"]:
        errors.append("closed_without_score")

    if record["satisfaction_score"]:
        try:
            score = int(record["satisfaction_score"])

            if score < 1 or score > 5:
                errors.append("score_out_of_range")

        except ValueError:
            errors.append("score_out_of_range")

    return errors


def export_results(
    valid_records,
    invalid_records,
    error_counts,
    category_counts,
    status_counts,
    score_counts,
    average_score
):
    total_valid = len(valid_records)

    rows = []

    rows.append({
        "metric": "total_records",
        "value": total_valid + len(invalid_records),
        "percentage": ""
    })

    rows.append({
        "metric": "valid_records",
        "value": total_valid,
        "percentage": ""
    })

    rows.append({
        "metric": "invalid_records",
        "value": len(invalid_records),
        "percentage": ""
    })

    rows.append({
        "metric": "missing_location_id",
        "value": error_counts["missing_location"],
        "percentage": ""
    })

    rows.append({
        "metric": "invalid_or_missing_category",
        "value": error_counts["invalid_category"],
        "percentage": ""
    })

    rows.append({
        "metric": "empty_description",
        "value": error_counts["empty_description"],
        "percentage": ""
    })

    rows.append({
        "metric": "missing_reporter_id",
        "value": error_counts["missing_reporter"],
        "percentage": ""
    })

    rows.append({
        "metric": "closed_without_score",
        "value": error_counts["closed_without_score"],
        "percentage": ""
    })

    rows.append({
        "metric": "score_out_of_range",
        "value": error_counts["score_out_of_range"],
        "percentage": ""
    })

    for category in VALID_CATEGORIES:
        count = category_counts[category]
        percentage = (count / total_valid) * 100 if total_valid else 0

        rows.append({
            "metric": f"category_{category}",
            "value": count,
            "percentage": f"{percentage:.1f}"
        })

    for status in VALID_STATUSES:
        count = status_counts[status]
        percentage = (count / total_valid) * 100 if total_valid else 0

        rows.append({
            "metric": f"status_{status}",
            "value": count,
            "percentage": f"{percentage:.1f}"
        })

    rows.append({
        "metric": "average_satisfaction_score",
        "value": f"{average_score:.2f}",
        "percentage": ""
    })

    for score in range(1, 6):
        rows.append({
            "metric": f"satisfaction_score_{score}",
            "value": score_counts[score],
            "percentage": ""
        })

    output_path = os.path.join("scripts", "results.csv")

    with open(output_path, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=["metric", "value", "percentage"]
        )

        writer.writeheader()
        writer.writerows(rows)

    print()
    print(f"Results exported successfully to {output_path}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python analyze.py incidents-brasaland.csv")
        return

    file_path = sys.argv[1]

    try:
        records = load_csv(file_path)
    except FileNotFoundError:
        print(f"Error: file not found: {file_path}")
        return
    except Exception as error:
        print(f"Error reading file: {error}")
        return

    valid_records = []
    invalid_records = []

    error_counts = {
        "missing_location": 0,
        "invalid_category": 0,
        "empty_description": 0,
        "missing_reporter": 0,
        "invalid_status": 0,
        "closed_without_score": 0,
        "score_out_of_range": 0,
    }

    for record in records:
        errors = validate_record(record)

        if errors:
            invalid_records.append(record)

            for error in errors:
                error_counts[error] += 1
        else:
            valid_records.append(record)

    category_counts = Counter(
        record["category"] for record in valid_records
    )

    status_counts = Counter(
        record["status"] for record in valid_records
    )

    closed_scores = []

    for record in valid_records:
        if record["status"] == "CLOSED" and record["satisfaction_score"]:
            closed_scores.append(
                int(record["satisfaction_score"])
            )

    score_counts = Counter(closed_scores)

    if closed_scores:
        average_score = sum(closed_scores) / len(closed_scores)
    else:
        average_score = 0

    total_valid = len(valid_records)

    print("=" * 60)
    print("  BRASALAND — INCIDENT REPORT ANALYSIS")
    print(f"  Source file: {os.path.basename(file_path)}")
    print("=" * 60)

    print()
    print(f"TOTAL RECORDS IN FILE .......... {len(records)}")
    print(f"  ├─ Valid records .............. {len(valid_records)}")
    print(f"  └─ Invalid / incomplete ....... {len(invalid_records)}")

    print()
    print("INVALID RECORDS BREAKDOWN")
    print(f"  ├─ Missing location_id ........ {error_counts['missing_location']}")
    print(f"  ├─ Invalid or missing category  {error_counts['invalid_category']}")
    print(f"  ├─ Empty description .......... {error_counts['empty_description']}")
    print(f"  ├─ Missing reporter_id ........ {error_counts['missing_reporter']}")
    print(f"  ├─ Closed case, no score ...... {error_counts['closed_without_score']}")
    print(f"  └─ Score out of range ......... {error_counts['score_out_of_range']}")

    print()
    print("BREAKDOWN BY CATEGORY (valid records)")

    for category in VALID_CATEGORIES:
        count = category_counts[category]
        percentage = (count / total_valid) * 100 if total_valid else 0

        print(
            f"  ├─ {category:<20} {count:>3}  ({percentage:.1f}%)"
        )

    print()
    print("BREAKDOWN BY STATUS (valid records)")

    for status in VALID_STATUSES:
        count = status_counts[status]
        percentage = (count / total_valid) * 100 if total_valid else 0

        print(
            f"  ├─ {status:<10} {count:>3}  ({percentage:.1f}%)"
        )

    print()
    print("SATISFACTION INDEX (closed cases)")
    print(
        f"  Scored cases: {len(closed_scores)} of {status_counts['CLOSED']}"
    )
    print(f"  Average score: {average_score:.2f} / 5.00")
    print(f"  ├─ Score 1 (Very dissatisfied) ... {score_counts[1]}")
    print(f"  ├─ Score 2 (Dissatisfied) ........ {score_counts[2]}")
    print(f"  ├─ Score 3 (Neutral) ............. {score_counts[3]}")
    print(f"  ├─ Score 4 (Satisfied) ........... {score_counts[4]}")
    print(f"  └─ Score 5 (Very satisfied) ...... {score_counts[5]}")

    print()
    print("=" * 60)

    answer = input("Export results to CSV? [y / n]: ").strip().lower()

    if answer == "y":
        export_results(
            valid_records,
            invalid_records,
            error_counts,
            category_counts,
            status_counts,
            score_counts,
            average_score
        )
    else:
        print("Results were not exported.")


if __name__ == "__main__":
    main()