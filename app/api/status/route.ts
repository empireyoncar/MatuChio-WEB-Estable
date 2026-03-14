import { NextResponse } from "next/server";

// 🔥 Fuerza a Next.js a NO cachear este endpoint
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const GAME_URL = process.env.GAMESERVER_URL || "http://192.168.1.178:8081";

    console.log("URL USADA:", GAME_URL);

    const res = await fetch(`${GAME_URL}/api/status`, {
      cache: "no-store" // evita cache del fetch
    });

    if (!res.ok) {
      console.log("FETCH ERROR:", res.status);
      return NextResponse.json(
        { error: "GameServer unreachable" },
        { status: 500 }
      );
    }

    let raw: any;

    try {
      raw = await res.json();
      console.log("RAW DATA:", raw);
    } catch (err) {
      console.log("JSON PARSE ERROR:", err);
      raw = {};
    }

    // Detectamos automáticamente la lista de jugadores
    let playersList: any[] = [];

    if (Array.isArray(raw.playersList)) {
      playersList = raw.playersList;
    } else if (Array.isArray(raw.onlinePlayers)) {
      playersList = raw.onlinePlayers;
    } else if (Array.isArray(raw.characters)) {
      playersList = raw.characters.map((c: any) => c.Name);
    } else if (Array.isArray(raw.players)) {
      playersList = raw.players;
    }

    return NextResponse.json(
      {
        playersList,
        players: playersList.length,
        online: raw.state === "Online" || raw.online === true
      },
      { status: 200 }
    );

  } catch (err) {
    console.log("GENERAL ERROR:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
