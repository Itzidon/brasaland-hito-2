import csv
import io

from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
)

from fastapi.responses import (
    FileResponse,
    StreamingResponse,
)

from shared.incidents_analysis import (
    analyze_records,
    results_to_rows,
)


app = FastAPI(
    title="Brasaland Incidents API"
)

last_results = None


@app.get("/")
def root():
    return {
        "message": "Brasaland Incidents API",
        "backoffice": "/backoffice",
        "docs": "/docs",
    }


@app.get("/backoffice")
def backoffice():
    return FileResponse(
        "uis/backoffice/index.html"
    )


@app.post("/api/incidents/analyze")
async def analyze_incidents(
    file: UploadFile = File(...)
):
    global last_results

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="A file is required.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file must be a CSV file.",
        )

    try:
        content = await file.read()
        decoded = content.decode("utf-8")

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="The CSV file must use UTF-8 encoding.",
        )

    if not decoded.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded CSV file is empty.",
        )

    try:
        reader = csv.DictReader(
            io.StringIO(decoded)
        )

        records = list(reader)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid CSV format.",
        )

    if not reader.fieldnames:
        raise HTTPException(
            status_code=400,
            detail="The CSV file has no header.",
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

    missing_columns = (
        required_columns - set(reader.fieldnames)
    )

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=(
                "Missing required columns: "
                + ", ".join(
                    sorted(missing_columns)
                )
            ),
        )

    if not records:
        raise HTTPException(
            status_code=400,
            detail=(
                "The CSV file contains no data records."
            ),
        )

    last_results = analyze_records(records)

    return last_results


@app.get("/api/incidents/results/export")
def export_results():
    if last_results is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "No analysis results available yet."
            ),
        )

    rows = results_to_rows(last_results)

    output = io.StringIO()

    writer = csv.DictWriter(
        output,
        fieldnames=[
            "metric",
            "value",
            "percentage",
        ],
    )

    writer.writeheader()
    writer.writerows(rows)

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=results.csv"
        },
    )