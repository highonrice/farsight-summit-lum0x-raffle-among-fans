/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Participant } from "../../utils/interface";
import {
  getUserDisplayName,
  getUserPfpUrl,
  getUser,
} from "../../utils/helpers";
import { getShareImage } from "../../ui/share";

let channel: string | undefined;
let startDate: string | undefined;
let endDate: string | undefined;
let limit: string | undefined;

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ?? "" }),
  title: "Raffle among your fans",
  imageAspectRatio: "1:1",
  imageOptions: {
    height: 800,
    width: 800,
  },
});

app.frame("/", (c) => {
  return c.res({
    image: "/Default.png",
    intents: [<Button action="/channel">Setting</Button>],
  });
});

app.frame("/channel", (c) => {
  channel = c.inputText;
  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter channel" />,
      <Button action="/">Back</Button>,
      <Button action="/start-date">Next</Button>,
    ],
  });
});

app.frame("/start-date", (c) => {
  startDate = c.inputText;
  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter Start Date... 2024-09-01" />,
      <Button action="/channel">Back</Button>,
      <Button action="/end-date">Next</Button>,
    ],
  });
});

app.frame("/end-date", (c) => {
  endDate = c.inputText;
  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter End Date... 2024-09-03" />,
      <Button action="/start-date">Back</Button>,
      <Button action="/limit">Next</Button>,
    ],
  });
});

app.frame("/limit", (c) => {
  limit = c.inputText;
  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter limit... default: 25" />,
      <Button action="/end-date">Back</Button>,
      <Button action="/raffle">Next</Button>,
    ],
  });
});

app.frame("/raffle", (c) => {
  return c.res({
    image: "/Default.png",
    intents: [
      <Button action="/limit">Back</Button>,
      <Button action="/result">Raffle!</Button>,
    ],
  });
});

app.frame("/result", async (c) => {
  const winner: Participant = await getUser(channel, startDate, endDate, limit);
  const displayName = await getUserDisplayName(winner.fid);
  const pfpUrl = await getUserPfpUrl(winner.fid);

  return c.res({
    image: getShareImage(displayName[0], pfpUrl),
    intents: [<Button action="/">Home</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
