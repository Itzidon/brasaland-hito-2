"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  getCandidateById,
  updateCandidate,
} from "../../../../services/candidates";

import type {
  CandidateFormData,
  CandidateStatus,
  CandidateStage,
} from "../../../../types/candidate";

export default function EditCandidatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<CandidateFormData>({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    linkedin_url: "",
    cv_url: "",
    experience_years: 0,
    status: "received",
    stage: "pending",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadCandidate() {
      try {
        const candidate = await getCandidateById(params.id);

        setForm({
          full_name: candidate.full_name ?? "",
          email: candidate.email ?? "",
          phone: candidate.phone ?? "",
          position: candidate.position ?? "",
          linkedin_url: candidate.linkedin_url ?? "",
          cv_url: candidate.cv_url ?? "",
          experience_years: candidate.experience_years ?? 0,
          status: candidate.status,
          stage: candidate.stage,
        });
      } catch {
        setError("No se pudo cargar la candidatura.");
      } finally {
        setLoading(false);
      }
    }

    loadCandidate();
  }, [params.id]);

  function updateField(
    field: keyof CandidateFormData,
    value: string | number
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setFeedback("");

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.position.trim()
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setSaving(true);

    try {
      await updateCandidate(params.id, form);

      setFeedback("Candidatura actualizada correctamente.");

      setTimeout(() => {
        router.push(`/candidates/${params.id}`);
      }, 1000);
    } catch {
      setError("No se pudo actualizar la candidatura.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main>
        <p>Cargando candidatura...</p>
      </main>
    );
  }

  return (
    <main>
      <Link href={`/candidates/${params.id}`}>
        ← Volver a la candidatura
      </Link>

      <h1>Editar candidatura</h1>
      <p>Brasaland Digital · Personas y Cultura</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre completo *
            <br />
            <input
              type="text"
              value={form.full_name}
              onChange={(event) =>
                updateField("full_name", event.target.value)
              }
              required
            />
          </label>
        </div>

        <div>
          <label>
            Correo electrónico *
            <br />
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              required
            />
          </label>
        </div>

        <div>
          <label>
            Teléfono *
            <br />
            <input
              type="text"
              value={form.phone}
              onChange={(event) =>
                updateField("phone", event.target.value)
              }
              required
            />
          </label>
        </div>

        <div>
          <label>
            Puesto *
            <br />
            <input
              type="text"
              value={form.position}
              onChange={(event) =>
                updateField("position", event.target.value)
              }
              required
            />
          </label>
        </div>

        <div>
          <label>
            LinkedIn
            <br />
            <input
              type="url"
              value={form.linkedin_url}
              onChange={(event) =>
                updateField("linkedin_url", event.target.value)
              }
            />
          </label>
        </div>

        <div>
          <label>
            Enlace al CV
            <br />
            <input
              type="url"
              value={form.cv_url}
              onChange={(event) =>
                updateField("cv_url", event.target.value)
              }
            />
          </label>
        </div>

        <div>
          <label>
            Años de experiencia
            <br />
            <input
              type="number"
              min="0"
              value={form.experience_years}
              onChange={(event) =>
                updateField(
                  "experience_years",
                  Number(event.target.value)
                )
              }
            />
          </label>
        </div>

        <div>
          <label>
            Estado
            <br />
            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as CandidateStatus
                )
              }
            >
              <option value="received">Recibida</option>
              <option value="in_progress">En proceso</option>
              <option value="selected">Seleccionada</option>
              <option value="discarded">Descartada</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Etapa
            <br />
            <select
              value={form.stage}
              onChange={(event) =>
                updateField(
                  "stage",
                  event.target.value as CandidateStage
                )
              }
            >
              <option value="pending">
                Pendiente de revisión
              </option>

              <option value="review">
                En revisión
              </option>

              <option value="personal_interview">
                Entrevista personal
              </option>

              <option value="technical_interview">
                Entrevista técnica
              </option>

              <option value="offer_presented">
                Oferta presentada
              </option>
            </select>
          </label>
        </div>

        {error && <p>{error}</p>}

        {feedback && (
          <p>
            <strong>{feedback}</strong>
          </p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}