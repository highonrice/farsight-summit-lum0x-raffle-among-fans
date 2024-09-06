/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Participant } from "../../utils/interface";
import {
  getDisplayName,
  getUserPfpUrl,
  getUserFromChannel,
  getUserFromDate,
} from "../../utils/helpers";
import { getShareImage } from "../../ui/share";

let type: string;
let startDate: string | undefined;
let endDate: string | undefined;
let channel: string | undefined;

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
    intents: [
      <Button action="/channel">Channel</Button>,
      <Button action="/start-date">Date</Button>,
    ],
  });
});

app.frame("/channel", (c) => {
  type = "channel";
  return c.res({
    image: "/Default.png",
    intents: [
      <TextInput placeholder="Enter channel" />,
      <Button action="/raffle">Next</Button>,
    ],
  });
});

app.frame("/start-date", (c) => {
  type = "date";
  startDate = c.inputText;
  return c.res({
    image: "/Default.png",
    intents: [
      <TextInput placeholder="Enter Start Date... 2024-09-01" />,
      <Button action="/end-date">Next</Button>,
    ],
  });
});

app.frame("/end-date", (c) => {
  startDate = c.inputText;
  return c.res({
    image: "/Default.png",
    intents: [
      <TextInput placeholder="Enter End Date... 2024-09-03" />,
      <Button action="/raffle">Next</Button>,
    ],
  });
});

app.frame("/raffle", (c) => {
  if (type === "channel") {
    channel = c.inputText;
  } else {
    endDate = c.inputText;
  }
  return c.res({
    image: "/Default.png",
    intents: [<Button action="/result">Raffle !</Button>],
  });
});

app.frame("/result", async (c) => {
  console.log("/result", type);
  const winner: Participant =
    type === "channel"
      ? await getUserFromChannel(channel)
      : await getUserFromDate(startDate, endDate);
  const displayName = await getDisplayName(String(winner.fid));
  const pfpUrl = await getUserPfpUrl(winner.fid);
  return c.res({
    image: getShareImage(displayName[0], pfpUrl),
    intents: [<Button action="/">Home</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
