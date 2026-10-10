import csv
import io
from collections import Counter

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from scripts.analyze import (
    VALID_CATEGORIES,
    VALID_STATUSES,
    validate_record,
)


app = FastAPI(title="Brasaland Incidents API")

last_results = None


def analyze_records(records):
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
            closed_scores.append(int(record["satisfaction_score"]))

    score_counts = Counter(closed_scores)

    average_score = (
        sum(closed_scores) / len(closed_scores)
        if closed_scores
        else 0
    )

    total_valid = len(valid_records)

    categories = {}

    for category in VALID_CATEGORIES:
        count = category_counts[category]

        categories[category] = {
            "count": count,
            "percentage": round(
                (count / total_valid) * 100, 1
            ) if total_valid else 0
        }

    statuses = {}

    for status in VALID_STATUSES:
        count = status_counts[status]

        statuses[status] = {
            "count": count,
            "percentage": round(
                (count / total_valid) * 100, 1
            ) if total_valid else 0
        }

    return {
        "total_records": len(records),
        "valid_records": len(valid_records),
        "invalid_records": len(invalid_records),
        "invalid_breakdown": error_counts,
        "categories": categories,
        "statuses": statuses,
        "satisfaction": {
            "scored_cases": len(closed_scores),
            "closed_cases": status_counts["CLOSED"],
            "average_score": round(average_score, 2),
            "scores": {
                "1": score_counts[1],
                "2": score_counts[2],
                "3": score_counts[3],
                "4": score_counts[4],
                "5": score_counts[5],
            },
        },
    }


@app.post("/api/incidents/analyze")
async def analyze_incidents(file: UploadFile = File(...)):
    global last_results

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file must be a CSV file."
        )

    try:
        content = await file.read()
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="The CSV file must use UTF-8 encoding."
        )

    if not decoded.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded CSV file is empty."
        )

    try:
        reader = csv.DictReader(io.StringIO(decoded))
        records = list(reader)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid CSV format."
        )

    if not reader.fieldnames:
        raise HTTPException(
            status_code=400,
            detail="The CSV file has no header."
        )

    required_columns = {
        "incident_id",
        "date",
        "location_id",
        "category",
        "description",
        "status",
        "customer_id",
        "satisfaction_score",
        "reporter_id",
    }

    missing_columns = required_columns - set(reader.fieldnames)

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=(
                "Missing required columns: "
                + ", ".join(sorted(missing_columns))
            )
        )

    last_results = analyze_records(records)

    return last_results


@app.get("/api/incidents/results/export")
def export_results():
    if last_results is None:
        raise HTTPException(
            status_code=404,
            detail="No analysis results available yet."
        )

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "metric",
        "value",
        "percentage"
    ])

    writer.writerow([
        "total_records",
        last_results["total_records"],
        ""
    ])

    writer.writerow([
        "valid_records",
        last_results["valid_records"],
        ""
    ])

    writer.writerow([
        "invalid_records",
        last_results["invalid_records"],
        ""
    ])

    for key, value in last_results["invalid_breakdown"].items():
        writer.writerow([
            f"invalid_{key}",
            value,
            ""
        ])

    for category, data in last_results["categories"].items():
        writer.writerow([
            f"category_{category}",
            data["count"],
            data["percentage"]
        ])

    for status, data in last_results["statuses"].items():
        writer.writerow([
            f"status_{status}",
            data["count"],
            data["percentage"]
        ])

    writer.writerow([
        "average_satisfaction_score",
        last_results["satisfaction"]["average_score"],
        ""
    ])

    for score, count in last_results["satisfaction"]["scores"].items():
        writer.writerow([
            f"satisfaction_score_{score}",
            count,
            ""
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=results.csv"
        },
    )