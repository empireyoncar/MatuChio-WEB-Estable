import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fallback por si la variable no carga en producción
    const GAME_URL = process.env.GAMESERVER_URL || "http://192.168.1.178:8081";

    const res = await fetch(`${GAME_URL}/api/status`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "GameServer unreachable" },
        { status: 500 }
      );
    }

    // Intentamos leer JSON, pero Node 18 a veces devuelve string o vacío
    let raw: any;

    try {
      const data = await res.json();

      if (typeof data === "string") {
        raw = data.trim() === "" ? {} : JSON.parse(data);
      } else {
        raw = data;
      }
    } catch {
      raw = {};
    }

    // Normalizamos playersList
    let playersList: any[] = [];

    if (Array.isArray(raw.playersList)) {
      playersList = raw.playersList;
    } else if (
      typeof raw.playersList === "string" &&
      raw.playersList.trim() !== ""
    ) {
      playersList = [];
    }

    return NextResponse.json(
      {
        playersList,
        players: raw.players ?? 0,

        // Compatibilidad con ambos formatos:
        // - state === "Online"
        // - online === true
        online: raw.state === "Online" || raw.online === true
      },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
