/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Participant } from "../../utils/interface";
import {
  getDisplayName,
  getUserPfpUrl,
  getUserFromChannel,
} from "../../utils/helpers";
import { getShareImage } from "../../ui/share";
import { Box } from "./ui";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ?? "" }),
  title: "Raffle among your fans",
  imageAspectRatio: "1:1",
  imageOptions: {
    height: 1106,
    width: 1106,
  },
});

app.frame("/", (c) => {
  return c.res({
    image: "/Default.png",
    intents: [<Button action="/result">Raffle!</Button>],
  });
});

app.frame("/result", async (c) => {
  const winner: Participant = await getUserFromChannel();
  console.log(winner);
  const displayName = await getDisplayName(String(winner.fid));
  console.log(displayName);
  const pfpUrl = await getUserPfpUrl(winner.fid);
  console.log(pfpUrl);
  return c.res({
    image: getShareImage(displayName[0], pfpUrl),
    // image: getShareImage(
    //   "Amy",
    //   "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5a205540-e1e9-4ae5-75e7-979e3026df00/rectcrop3"
    // ),

    intents: [<Button action="/">Back</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
