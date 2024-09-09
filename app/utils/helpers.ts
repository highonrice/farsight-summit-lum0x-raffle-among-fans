import { Lum0x } from "lum0x-sdk";

Lum0x.init(process.env.LUM0X_API_KEY || "");

let cursor: string | undefined;

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

export async function getUser(
  channel: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  limit: string | undefined
) {
  let res = await Lum0x.farcasterFeed.getFeed({
    feed_type: "filter",
    filter_type: "parent_url",
    parent_url: "https://warpcast.com/~/channel/" + channel,
    limit: Number(limit),
  });

  let startDateUnix = startDate && new Date(startDate).getTime();
  let endDateUnix = endDate && new Date(endDate).getTime();
  let filteredCasts = res.casts.filter((cast: { timestamp: number }) => {
    //2024-09-02T00:09:30
    //start와 end날짜가 같은경우 예외처리
    if (startDateUnix === endDateUnix) {
      new Date(cast.timestamp).getTime() < Number(endDateUnix);
    } else {
      Number(startDateUnix) < new Date(cast.timestamp).getTime() &&
        new Date(cast.timestamp).getTime() < Number(endDateUnix);
    }
  });

  if (filteredCasts.length === 0) {
    return { fid: 321762, display_name: "Amy" };
  }
  let authors = filteredCasts.map((cast: any) => cast.author.fid);
  let authorSet: Set<any> = new Set(authors);

  const authorList = Array.from(authorSet);
  const randomArray = authorList.sort(() => Math.random() - 0.5);
  const displayName = await getUserDisplayName(randomArray[0]);

  return { fid: randomArray[0], display_name: displayName };
}
// farsightsummit 채널에서 9월 2일 이후 캐스트 작성자 중 한명 임의 선택 -> fid,display_name 반환
// export async function getUserFromDate(
//   startDate: string | undefined,
//   endDate: string | undefined
// ) {
//   let res = await Lum0x.farcasterFeed.getFeed({
//     feed_type: "filter",
//     filter_type: "parent_url",
//     parent_url: "https://warpcast.com/~/channel/farsightsummit",
//   });
//   let startDateUnix = startDate && new Date(startDate).getTime();
//   let endDateUnix = endDate && new Date(endDate).getTime();
//   let filteredCasts = res.casts.filter((cast: { timestamp: number }) => {
//     //2024-09-02T00:09:30
//     //start와 end날짜가 같은경우 예외처리
//     if (startDateUnix === endDateUnix) {
//       new Date(cast.timestamp).getTime() < Number(endDateUnix);
//     } else {
//       Number(startDateUnix) < new Date(cast.timestamp).getTime() &&
//         new Date(cast.timestamp).getTime() < Number(endDateUnix);
//     }
//   });
//   if (filteredCasts.length === 0) {
//     return { fid: 321762, display_name: "Amy" };
//   }
//   let authors = filteredCasts.map((cast: any) => cast.author.fid);
//   let authorSet: Set<any> = new Set(authors);

//   const authorList = Array.from(authorSet);
//   const randomArray = authorList.sort(() => Math.random() - 0.5);
//   const displayName = await getUserDisplayName(randomArray[0]);

//   return { fid: randomArray[0], display_name: displayName };
// }
// //type이 channel인경우
// export async function getUserFromChannel(channel: string | undefined) {
//   let res = await Lum0x.farcasterFeed.getFeed({
//     feed_type: "filter",
//     filter_type: "parent_url",
//     parent_url: "https://warpcast.com/~/channel/" + channel,
//   });

//   let filteredCasts = res.casts.filter(
//     (cast: { channel: { id: string | undefined } }) =>
//       channel === cast.channel.id
//   );

//   if (filteredCasts.length === 0) {
//     return { fid: 321762, display_name: "Amy" };
//   }

//   let authors = filteredCasts.map((cast: any) => cast.author.fid);
//   let authorSet: Set<any> = new Set(authors);

//   const authorList = Array.from(authorSet);
//   const randomArray = authorList.sort(() => Math.random() - 0.5);
//   const displayName = await getUserDisplayName(randomArray[0]);

//   return { fid: randomArray[0], display_name: displayName };
// }
// export async function main(fid: number) {
//     return await weightedRaffle(fid)
// }
