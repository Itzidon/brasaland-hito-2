"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  getCandidateById,
  updateCandidateStatus,
  updateCandidateStage,
  getCandidateNotes,
  addCandidateNote,
  deleteCandidateNote,
} from "../../../services/candidates";

import type {
  Candidate,
  CandidateStatus,
  CandidateStage,
  CandidateNote,
} from "../../../types/candidate";

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [newNote, setNewNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const candidateData = await getCandidateById(params.id);
        const notesData = await getCandidateNotes(params.id);

        setCandidate(candidateData);
        setNotes(notesData);
      } catch {
        setError("No se pudo cargar la candidatura.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  async function handleStatusChange(newStatus: CandidateStatus) {
    if (!candidate) return;

    setSaving(true);
    setFeedback("");

    try {
      await updateCandidateStatus(candidate.id, newStatus);

      setCandidate({
        ...candidate,
        status: newStatus,
      });

      setFeedback("Estado actualizado correctamente.");
    } catch {
      setFeedback("No se pudo actualizar el estado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStageChange(newStage: CandidateStage) {
    if (!candidate) return;

    setSaving(true);
    setFeedback("");

    try {
      await updateCandidateStage(candidate.id, newStage);

      setCandidate({
        ...candidate,
        stage: newStage,
      });

      setFeedback("Etapa actualizada correctamente.");
    } catch {
      setFeedback("No se pudo actualizar la etapa.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNote() {
    if (!candidate || !newNote.trim()) return;

    setSaving(true);
    setFeedback("");

    try {
      const createdNote = await addCandidateNote(
        candidate.id,
        newNote.trim()
      );

      setNotes((currentNotes) => [...currentNotes, createdNote]);
      setNewNote("");
      setFeedback("Nota añadida correctamente.");
    } catch {
      setFeedback("No se pudo añadir la nota.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!candidate) return;

    setSaving(true);
    setFeedback("");

    try {
      await deleteCandidateNote(candidate.id, noteId);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId)
      );

      setFeedback("Nota eliminada correctamente.");
    } catch {
      setFeedback("No se pudo eliminar la nota.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Cargando candidatura...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!candidate) {
    return <p>No se encontró la candidatura.</p>;
  }

  return (
    <main>
      <Link href="/">← Volver a candidaturas</Link>

      <p>
        <Link href={`/candidates/${candidate.id}/edit`}>
          Editar candidatura
        </Link>
      </p>

      <h1>{candidate.full_name}</h1>

      <p>
        <strong>Correo electrónico:</strong> {candidate.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {candidate.phone}
      </p>

      <p>
        <strong>Puesto:</strong> {candidate.position}
      </p>

      <p>
        <strong>Años de experiencia:</strong>{" "}
        {candidate.experience_years}
      </p>

      <div>
        <strong>Estado: </strong>

        <select
          value={candidate.status}
          disabled={saving}
          onChange={(event) =>
            handleStatusChange(
              event.target.value as CandidateStatus
            )
          }
        >
          <option value="received">Recibida</option>
          <option value="in_progress">En proceso</option>
          <option value="selected">Seleccionada</option>
          <option value="discarded">Descartada</option>
        </select>
      </div>

      <div>
        <strong>Etapa: </strong>

        <select
          value={candidate.stage}
          disabled={saving}
          onChange={(event) =>
            handleStageChange(
              event.target.value as CandidateStage
            )
          }
        >
          <option value="pending">Pendiente de revisión</option>
          <option value="review">En revisión</option>
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
      </div>

      {saving && <p>Guardando cambios...</p>}
      {feedback && <p>{feedback}</p>}

      <p>
        <strong>Fecha de aplicación:</strong>{" "}
        {new Date(candidate.applied_at).toLocaleDateString("es-ES")}
      </p>

      <p>
        <strong>LinkedIn:</strong>{" "}
        <a
          href={candidate.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil
        </a>
      </p>

      <p>
        <strong>CV:</strong>{" "}
        <a
          href={candidate.cv_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver CV
        </a>
      </p>

      <hr />

      <h2>Notas internas</h2>

      <textarea
        value={newNote}
        onChange={(event) => setNewNote(event.target.value)}
        placeholder="Escribe una nota interna"
        rows={4}
      />

      <br />

      <button
        type="button"
        onClick={handleAddNote}
        disabled={saving}
      >
        Añadir nota
      </button>

      {notes.length === 0 ? (
        <p>No hay notas internas.</p>
      ) : (
        <div>
          {notes.map((note) => (
            <div key={note.id}>
              <p>{note.content}</p>

              <p>
                {new Date(note.created_at).toLocaleString("es-ES")}
              </p>

              <button
                type="button"
                onClick={() => handleDeleteNote(note.id)}
                disabled={saving}
              >
                Eliminar
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}