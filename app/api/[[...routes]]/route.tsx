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
  // const winner: Participant = await getUserFromChannel();
  // console.log(winner);
  // const displayName = await getDisplayName(String(winner.fid));
  // console.log(displayName);
  // const pfpUrl = await getUserPfpUrl(winner.fid);
  // console.log(pfpUrl);
  return c.res({
    // image: getShareImage(displayName[0], pfpUrl),
    // image: getShareImage(
    //   "Amy",
    //   "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5a205540-e1e9-4ae5-75e7-979e3026df00/rectcrop3"
    // ),
    image:  <Box
    grow
    alignVertical="center"
    padding="10"
    paddingBottom="26"
    marginTop="2"
    marginBottom="2"
    fontWeight="700"
    position="relative"
  >
    <div
      style={{
        position: "absolute",
        display: "flex",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <img src="/Share.png" />
    </div>
    <div
      style={{
        position: "absolute",
        display: "flex",
        top: 730,
        left: 450,
        width: 300,
        height: 45,
        color: "white",
        fontSize: 54,
        fontFamily: "coinbase",
      }}
    >
      {/* {`${displayName}`} */}
      Amy
    </div>
    <div
      style={{
        position: "absolute",
        display: "flex",
        top: 300,
        left: 380,
        width: "28%",
        fontFamily: "Poppins",
      }}
    >
      <img
        src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5a205540-e1e9-4ae5-75e7-979e3026df00/rectcrop3"
        //   src={pfpUrl}
        width={400}
        height={400}
        style={{
          borderRadius: "60%",
        }}
      />
    </div>
  </Box>
    intents: [<Button action="/">Back</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
