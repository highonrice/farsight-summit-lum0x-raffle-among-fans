/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import path from 'path';
import fs from 'fs/promises';
import { Fan } from '../../utils/interface'
import { getDisplayName, getTop10Fans, getUserPfpUrl, weightedRaffle } from '../../utils/helpers'
import { createFan, getFan } from '@/app/utils/db/queries/fans';
import { getLeaderboardImage } from '../../ui/leaderboard'
import { getShareImage } from '../../ui/share'

async function getRegularFontData() {
  const fontPath = path.resolve('./public/fonts/Coinbase_Display-Regular-web-1.32.ttf');
  const fontData = await fs.readFile(fontPath);
  return fontData;
}

async function getBoldFontData() {
  const fontPath = path.resolve('./public/fonts/Coinbase_Display-Bold-web-1.32.ttf');
  const fontData = await fs.readFile(fontPath);
  return fontData;
}

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ?? '' }),
  title: 'Raffle among your fans',
  imageAspectRatio: '1.91:1',
  imageOptions: {
    height: 1910,
    width: 1000,
    fonts: [
      {
        name: 'coinbase',
        data: await getRegularFontData(),
        style: 'normal',
        weight: 400,
      },
      {
        name: 'coinbase',
        data: await getBoldFontData(),
        style: 'normal',
        weight: 700,
      },
    ]
  },
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  return c.res({
    image: '/Default.png',
    intents: [
      <Button action='/raffle'>Raffle!</Button>,
      <Button action='/fans'>My Top 10 Fans</Button>,
    ],
  })
})

app.frame('/raffle', async (c) => {
  const fid = c.frameData?.fid

  const winner: Fan = await weightedRaffle(Number(fid))

  const fanDocRef = await createFan(winner)
  const shareUrl = `${process.env.BASE_URL}/share/${fanDocRef.id}`

  return c.res({
    image: '/Result.png',
    intents: [
      <Button.Link href={shareUrl}>Share</Button.Link>,
      <Button action='/'>Back</Button>,
    ],
  })
})

app.frame('/fans', async (c) => {
  const fid = c.frameData?.fid
  if (!fid) {
    return c.error({ message: 'Invalid fid', statusCode: 404 })
  }

  return c.res({
    image: `/leaderboard-image/${fid}`,
    intents: [
      <Button action='/raffle'>Raffle</Button>,
      <Button action='/'>Back</Button>,
    ],
  })
})

app.frame('/share/:id', async (c) => {
  const id = c.req.param('id')
  const fanDoc = await getFan(id)
  const { fid, ranks, score, reactions, recasts } = fanDoc.data() as Fan
  const displayName = await getDisplayName(String(fid))
  const pfpUrl = await getUserPfpUrl(fid)
  return c.res({
    image: (
      getShareImage(ranks, score, reactions, recasts, displayName[0], pfpUrl)
    ),
    intents: [
      <Button action='/raffle'>Raffle</Button>,
      <Button action='/fans'>My Top 10 Fans</Button>,
    ],
  })
})

app.image('/leaderboard-image/:fid', async (c) => {
  const fid = c.req.param('fid')
  if (fid == undefined) {
    return c.res({
      image: (
        <img src="/Error.png" />
      ),
    })
  }
  const top10Fans: Fan[] = await getTop10Fans(Number(fid))
  return c.res({
    image: (getLeaderboardImage(top10Fans))
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
