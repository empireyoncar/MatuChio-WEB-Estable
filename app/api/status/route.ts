import { NextResponse } from "next/server";

export async function GET() {
  try {
    const GAME_URL = process.env.GAMESERVER_URL || "http://192.168.1.178:8081";

    console.log("URL USADA:", GAME_URL);

    const res = await fetch(`${GAME_URL}/api/status`);

    if (!res.ok) {
      console.log("FETCH ERROR:", res.status);
      return NextResponse.json(
        { error: "GameServer unreachable" },
        { status: 500 }
      );
    }

    let raw: any;

    try {
      const data = await res.json();

      if (typeof data === "string") {
        raw = data.trim() === "" ? {} : JSON.parse(data);
      } else {
        raw = data;
      }

      console.log("RAW DATA:", raw);

    } catch (err) {
      console.log("JSON PARSE ERROR:", err);
      raw = {};
    }

    let playersList: any[] = [];

    if (Array.isArray(raw.playersList)) {
      playersList = raw.playersList;
    }

    return NextResponse.json(
      {
        playersList,
        players: raw.players ?? 0,
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
