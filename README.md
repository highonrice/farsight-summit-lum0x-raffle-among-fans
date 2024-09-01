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
FIREBASE_PRIVATE_KEY_ID=<Firebase admin cerficate>
FIREBASE_PRIVATE_KEY=<Firebase admin cerficate>
FIREBASE_PROJECT_ID=<Firebase admin cerficate>
FIREBASE_CLIENT_EMAIL=<Firebase admin cerficate>
FIREBASE_CLIENT_ID=<Firebase admin cerficate>
FIREBASE_CLIENT_X509_CERT_URL=<Firebase admin cerficate>

```
npm install
npm run dev
```

Head to http://localhost:3000/api/dev