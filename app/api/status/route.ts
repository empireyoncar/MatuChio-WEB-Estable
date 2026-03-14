import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const GAME_URL = process.env.GAMESERVER_URL || "http://192.168.1.178:8081";

    const res = await fetch(`${GAME_URL}/api/status`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "GameServer unreachable" },
        { status: 500 }
      );
    }

    let raw: any;

    try {
      raw = await res.json();
    } catch {
      raw = {};
    }

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

  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
