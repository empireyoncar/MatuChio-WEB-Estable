import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playersList } = await req.json();

    if (!playersList || playersList.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const characters = await prisma.character.findMany({
      where: {
        Name: { in: playersList }
      },
      select: {
        Name: true,
        CharacterClassId: true,
        CurrentMapId: true,
        PositionX: true,
        PositionY: true
      }
    });

    return NextResponse.json(characters, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
