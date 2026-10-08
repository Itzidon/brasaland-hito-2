import type {
  Candidate,
  CandidateStatus,
  CandidateStage,
  CandidateNote,
  CandidateFormData,
} from "../types/candidate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// OBTENER TODAS LAS CANDIDATURAS
export async function getCandidates(): Promise<Candidate[]> {
  const firstResponse = await fetch(
    `${API_URL}/records?page=1&limit=20`
  );

  if (!firstResponse.ok) {
    throw new Error("No se pudieron cargar las candidaturas");
  }

  const firstData = await firstResponse.json();

  const allCandidates: Candidate[] = [...firstData.data];

  const totalPages = Math.ceil(
    firstData.total / firstData.limit
  );

  for (let page = 2; page <= totalPages; page++) {
    const response = await fetch(
      `${API_URL}/records?page=${page}&limit=20`
    );

    if (!response.ok) {
      throw new Error("No se pudieron cargar las candidaturas");
    }

    const data = await response.json();

    allCandidates.push(...data.data);
  }

  return allCandidates;
}

// OBTENER UNA CANDIDATURA POR ID
export async function getCandidateById(
  id: string
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/records/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo cargar la candidatura");
  }

  const data = await response.json();

  return data.data ?? data;
}

// ACTUALIZAR EL ESTADO
export async function updateCandidateStatus(
  id: string,
  status: CandidateStatus
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el estado");
  }

  const data = await response.json();

  return data.data ?? data;
}

// ACTUALIZAR LA ETAPA
export async function updateCandidateStage(
  id: string,
  stage: CandidateStage
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stage }),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar la etapa");
  }

  const data = await response.json();

  return data.data ?? data;
}

// OBTENER LAS NOTAS
export async function getCandidateNotes(
  id: string
): Promise<CandidateNote[]> {
  const response = await fetch(`${API_URL}/records/${id}/notes`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las notas");
  }

  const result = await response.json();
  const data = result.data ?? result;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.notes)) {
    return data.notes;
  }

  return [];
}

// AÑADIR UNA NOTA
export async function addCandidateNote(
  id: string,
  content: string
): Promise<CandidateNote> {
  const response = await fetch(`${API_URL}/records/${id}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("No se pudo añadir la nota");
  }

  const data = await response.json();

  return data.data ?? data;
}

// ELIMINAR UNA NOTA
export async function deleteCandidateNote(
  candidateId: string,
  noteId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/records/${candidateId}/notes/${noteId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar la nota");
  }
}

// CREAR UNA NUEVA CANDIDATURA
export async function createCandidate(
  candidate: CandidateFormData
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar la candidatura");
  }

  const data = await response.json();

  return data.data ?? data;
}
// EDITAR UNA CANDIDATURA COMPLETA
export async function updateCandidate(
  id: string,
  candidate: CandidateFormData
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/records/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  });

  if (!response.ok) {
    throw new Error("No se pudo editar la candidatura");
  }

  const data = await response.json();

  return data.data ?? data;
}