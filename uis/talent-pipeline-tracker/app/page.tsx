"use client";

import { Suspense, useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";

import { getCandidates } from "../services/candidates";

import type {
  Candidate,
  CandidateStatus,
  CandidateStage,
} from "../types/candidate";

const statusLabels: Record<CandidateStatus, string> = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada",
};

const stageLabels: Record<CandidateStage, string> = {
  pending: "Pendiente de revisión",
  review: "En revisión",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista técnica",
  offer_presented: "Oferta presentada",
};

function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedStatus = searchParams.get("status") || "";
  const selectedStage = searchParams.get("stage") || "";

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await getCandidates();
        setCandidates(data);
      } catch {
        setError("No se pudieron cargar las candidaturas");
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, []);

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    const queryString = params.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname
    );
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      candidate.full_name.toLowerCase().includes(searchText) ||
      candidate.email.toLowerCase().includes(searchText);

    const matchesStatus =
      !selectedStatus || candidate.status === selectedStatus;

    const matchesStage =
      !selectedStage || candidate.stage === selectedStage;

    return matchesSearch && matchesStatus && matchesStage;
  });

  if (loading) {
    return <p>Cargando candidaturas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Gestor de Candidaturas</h1>
      <p>Brasaland Digital · Personas y Cultura</p>

      <h2>Candidaturas</h2>

      <p>
        <Link href="/candidates/new">
          + Nueva candidatura
        </Link>
      </p>

      <div>
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={selectedStatus}
          onChange={(event) =>
            updateFilter("status", event.target.value)
          }
        >
          <option value="">Todos los estados</option>
          <option value="received">Recibida</option>
          <option value="in_progress">En proceso</option>
          <option value="selected">Seleccionada</option>
          <option value="discarded">Descartada</option>
        </select>

        <select
          value={selectedStage}
          onChange={(event) =>
            updateFilter("stage", event.target.value)
          }
        >
          <option value="">Todas las etapas</option>
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

      <p>Resultados: {filteredCandidates.length}</p>

      {filteredCandidates.map((candidate) => (
        <div key={candidate.id}>
          <h3>
            <Link href={`/candidates/${candidate.id}`}>
              {candidate.full_name}
            </Link>
          </h3>

          <p>Puesto: {candidate.position}</p>
          <p>Estado: {statusLabels[candidate.status]}</p>
          <p>Etapa: {stageLabels[candidate.stage]}</p>

          <hr />
        </div>
      ))}

      {filteredCandidates.length === 0 && (
        <p>No se encontraron candidaturas.</p>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <CandidatesPage />
    </Suspense>
  );
}