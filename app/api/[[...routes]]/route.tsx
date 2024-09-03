/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import path from "path";
import fs from "fs/promises";
import { Fan, Participant } from "../../utils/interface";
import {
  getDisplayName,
  getTop10Fans,
  getUserPfpUrl,
  weightedRaffle,
  postLum0xTestFrameValidation,
  getUserFromChannel,
} from "../../utils/helpers";
// import { createFan, getFan } from "@/app/utils/db/queries/fans";
import {
  createParticipant,
  getParticipant,
} from "@/app/utils/db/queries/participants";
import { getLeaderboardImage } from "../../ui/leaderboard";
import { getShareImage } from "../../ui/share";

async function getRegularFontData() {
  const fontPath = path.resolve(
    "./public/fonts/Coinbase_Display-Regular-web-1.32.ttf"
  );
  const fontData = await fs.readFile(fontPath);
  return fontData;
}

async function getBoldFontData() {
  const fontPath = path.resolve(
    "./public/fonts/Coinbase_Display-Bold-web-1.32.ttf"
  );
  const fontData = await fs.readFile(fontPath);
  return fontData;
}

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ?? "" }),
  title: "Raffle among your fans",
  imageAspectRatio: "1:1",
  imageOptions: {
    height: 1106,
    width: 1106,
    fonts: [
      {
        name: "coinbase",
        data: await getRegularFontData(),
        style: "normal",
        weight: 400,
      },
      {
        name: "coinbase",
        data: await getBoldFontData(),
        style: "normal",
        weight: 700,
      },
    ],
  },
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  return c.res({
    image: "/Default.png",
    intents: [
      <Button action="/result">Raffle!</Button>,
      // <Button action="/fans">My Top 10 Fans</Button>,
    ],
  });
});

app.frame("/raffle", async (c) => {
  const fid = c.frameData?.fid;

  await postLum0xTestFrameValidation(Number(fid), "raffle");

  // const winner: Fan = await weightedRaffle(Number(fid));

  // const winner: Participant = await getUserFromChannel();
  // console.log(winner);
  // const fanDocRef = await createFan(winner);
  // const participantDocRef = await createParticipant(winner);

  // const frameUrl = `${process.env.BASE_URL}/api/share/${fanDocRef.id}`;
  // const frameUrl = `${process.env.BASE_URL}/api/share/${participantDocRef.id}`;
  const message = `Winner of the raffle is...!!`;
  const urlMessage = message.replace(/ /g, "%20");
  // const shareUrl = `https://warpcast.com/~/compose?text=${urlMessage}&embeds[]=${frameUrl}`;

  return c.res({
    image: "/Result.png",
    intents: [
      // <Button.Link href={shareUrl}>Share</Button.Link>,
      <Button action="/result/">Share</Button>,
      <Button action="/">Back</Button>,
    ],
  });
});

app.frame("/result", async (c) => {
  const winner: Participant = await getUserFromChannel();

  // const participantDoc = await getParticipant(String(winner.fid));
  // const { fid } = participantDoc.data() as Participant;
  const displayName = await getDisplayName(String(winner.fid));
  const pfpUrl = await getUserPfpUrl(winner.fid);
  return c.res({
    image: getShareImage(
      // ranks,
      // score,
      // reactions,
      // recasts,
      displayName[0],
      pfpUrl
    ),
    intents: [
      // <Button action="/raffle">Raffle</Button>,
      <Button action="/">Back</Button>,
    ],
  });
});

app.frame("/fans", async (c) => {
  const fid = c.frameData?.fid;
  if (!fid) {
    return c.error({ message: "Invalid fid", statusCode: 404 });
  }

  await postLum0xTestFrameValidation(Number(fid), "fans");

  return c.res({
    image: `/leaderboard-image/${fid}`,
    intents: [
      <Button action="/raffle">Raffle</Button>,
      <Button action="/">Back</Button>,
    ],
  });
});

app.frame("/share/:id", async (c) => {
  const viewerFid = c.frameData?.fid;
  const id = c.req.param("id");
  // const fanDoc = await getFan(id);
  const participantDoc = await getParticipant(id);

  await postLum0xTestFrameValidation(Number(viewerFid), "share");

  // const { fid, ranks, score, reactions, recasts } = fanDoc.data() as Fan;
  const { fid } = participantDoc.data() as Participant;
  const displayName = await getDisplayName(String(fid));
  const pfpUrl = await getUserPfpUrl(fid);
  return c.res({
    image: getShareImage(
      // ranks,
      // score,
      // reactions,
      // recasts,
      displayName[0],
      pfpUrl
    ),
    intents: [
      <Button action="/raffle">Raffle</Button>,
      // <Button action="/fans">My Top 10 Fans</Button>,
    ],
  });
});

app.image("/leaderboard-image/:fid", async (c) => {
  const fid = c.req.param("fid");
  if (fid == undefined) {
    return c.res({
      image: <img src="/Error.png" />,
    });
  }
  const top10Fans: Fan[] = await getTop10Fans(Number(fid));
  return c.res({
    image: getLeaderboardImage(top10Fans),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
