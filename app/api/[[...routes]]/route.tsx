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
  const displayName = await getDisplayName(String(winner.fid));
  const pfpUrl = await getUserPfpUrl(winner.fid);
  return c.res({
    image: getShareImage(displayName[0], pfpUrl),
    intents: [<Button action="/">Back</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
