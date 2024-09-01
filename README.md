# FarSight Summit Buildathon Project: Fan Raffle
This project was created as part of the FarSight Summit Buildathon.

## Overview
This Frame enables you to conduct a raffle among your Farcaster fans, with a unique twist. The probability of a fan being selected is directly influenced by their level of engagement with your most recent 100 casts. The more a fan interacts with your content, the higher their chances of winning.

## How It Works
- Raffle Mechanics: The raffle draws from your pool of Farcaster fans.
- Interaction-Based Probability: The likelihood of a fan being selected is proportional to the amount of interaction they have had with your last 100 casts. Fans who engage more frequently (through likes, comments, etc.) have a higher probability of being chosen.

## Usage

There are some .env variables you should set.

BASE_URL=<App's url when deployed>
NEYNAR_API_KEY=<Your NEYNAR API Key>
LUM0X_API_KEY=<Your Lum0x API Key>
FIREBASE_SERVICE_ACCOUNT_KEY=<Firebase admin private key string>

To learn how to use service account key json file with vercel, refer to this article: https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5

```
npm install
npm run dev
```

Head to http://localhost:3000/api/dev