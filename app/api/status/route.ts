import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.GAMESERVER_URL}/api/status`);

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
        // Si viene vacío → lo convertimos en objeto vacío
        raw = data.trim() === "" ? {} : JSON.parse(data);
      } else {
        raw = data;
      }
    } catch {
      // Si falla el parseo → devolvemos objeto vacío
      raw = {};
    }

    // Normalizamos playersList para evitar [""] o strings
    let playersList: any[] = [];

    if (Array.isArray(raw.playersList)) {
      playersList = raw.playersList;
    } else if (
      typeof raw.playersList === "string" &&
      raw.playersList.trim() !== ""
    ) {
      // Si viene como string no vacío → lo ignoramos y devolvemos []
      playersList = [];
    }

    return NextResponse.json(
      {
        playersList,
        players: raw.players ?? 0,
        online: raw.state === "Online"
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
