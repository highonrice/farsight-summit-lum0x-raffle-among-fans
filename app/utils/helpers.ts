import { Lum0x } from "lum0x-sdk";
import { Participant } from "./interface";

Lum0x.init(process.env.LUM0X_API_KEY || "");

export async function getDisplayName(fids: string): Promise<string[]> {
  const res = await Lum0x.farcasterUser.getUserByFids({ fids: fids });
  // const users: User[] = res.users;
  const participants: Participant[] = res.users;
  return participants.map((participant) => participant.display_name);
}

export async function getUserPfpUrl(fid: number): Promise<string> {
  const res = await Lum0x.farcasterUser.getUserByFids({ fids: String(fid) });
  const user = res.users[0];

  return user.pfp_url;
}
export async function getUserDisplayName(fid: number): Promise<string> {
  const res = await Lum0x.farcasterUser.getUserByFids({ fids: String(fid) });
  const user = res.users[0];

  return user.display_name;
}
export async function postLum0xTestFrameValidation(fid: number, path: string) {
  fetch("https://testnetapi.lum0x.com/frame/validation", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      farcasterFid: fid,
      frameUrl: `${process.env.BASE_URL}/api/${path}`,
    }),
  });
}
// farsightsummit채널에서 최근 캐스트 25개의 작성자 중 한명 임의 선택 -> fid,display_name 반환
export async function getUserFromChannel() {
  let res = await Lum0x.farcasterFeed.getFeed({
    feed_type: "filter",
    filter_type: "parent_url",
    parent_url: "https://warpcast.com/~/channel/farsightsummit",
  });
  let authors = res.casts.map((cast: any) => cast.author.fid);
  let authorSet: Set<any> = new Set(authors);

  const authorList = Array.from(authorSet);
  const randomArray = authorList.sort(() => Math.random() - 0.5);
  const displayName = await getUserDisplayName(randomArray[0]);

  return { fid: randomArray[0], display_name: displayName };
}

// export async function main(fid: number) {
//     return await weightedRaffle(fid)
// }
