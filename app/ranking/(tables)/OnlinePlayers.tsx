"use client"
import { CharacterOnline } from "@/app/_models/characterOnline"
import { getImage } from '@/app/_utils/characterAvatarReturn';
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import MapsEnum from "@/app/_utils/mapEnum";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(res => res.json());

export default function OnlinePlayers() {

  // Refresca el estado del servidor cada 1 segundo
  const { data: serverStatus } = useSWR(
    "/api/status",
    fetcher,
    { refreshInterval: 1000 }
  );

  // Refresca los jugadores online cada 1 segundo
  const { data: characters } = useSWR(
    serverStatus ? ["/api/characters/ranking/online", serverStatus.playersList] : null,
    async ([url, playersList]) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ playersList })
      });

      return res.json();
    },
    { refreshInterval: 1000 }
  );

  if (!characters) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="w-full flex flex-col gap-5 mx-auto mt-2">
      <table className='w-full m-0'>
        <thead className="m-5 bg-primary text-white">
          <tr className="mb-5">
            <th className='text-start pl-3 pb-3.5'>#</th>
            <th className='text-start pb-3.5'>Name</th>
            <th className='pb-3.5'>Map</th>
            <th className='pb-3.5'>Position</th>
          </tr>
        </thead>
        <tbody>
        {characters.map((c: CharacterOnline, i: number) => (
          <tr key={c.Name} className="border-b-2 border-slate-300">
            <td className='text-start text-slate-700 font-bold pb-3.5 pl-3 pt-3'>{i+1}</td>
            <td className='text-start font-normal text-primary pb-3.5 pt-3'>
              <Image className="inline-block mr-2 rounded-lg shadow-lg shadow-black" src={(getImage(c.CharacterClassId) as StaticImport)} width={35} alt="character_avatar"/> 
              {c.Name}
            </td>
            <td className='pb-3.5 font-normal text-center text-primary text-lg pt-3'>
              {Object.values(MapsEnum)[Object.keys(MapsEnum).indexOf(c.CurrentMapId!)]}
            </td>
            <td className='pb-3.5 font-normal text-center text-primary text-lg pt-3'>
              {c.PositionX}, {c.PositionY}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}
