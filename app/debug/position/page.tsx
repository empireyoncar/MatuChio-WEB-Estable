"use client";

import useSWR from "swr";

export default function DebugPosition() {
  const { data, error } = useSWR(
    "/api/characters/ranking/online",
    async () => {
      const res = await fetch("/api/characters/ranking/online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ playersList: ["empireyon"] })
      });
      return res.json();
    },
    { refreshInterval: 1000 }
  );

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Cargando...</p>;

  const pj = data[0];

  return (
    <div style={{ padding: 20 }}>
      <h1>Debug de Posición</h1>
      <p><strong>Nombre:</strong> {pj.Name}</p>
      <p><strong>Mapa:</strong> {pj.CurrentMapId}</p>
      <p><strong>Posición X:</strong> {pj.PositionX}</p>
      <p><strong>Posición Y:</strong> {pj.PositionY}</p>

      <p style={{ marginTop: 20, color: "gray" }}>
        Esta página refresca cada 1 segundo.
      </p>
    </div>
  );
}
