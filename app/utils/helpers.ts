import { Lum0x } from "lum0x-sdk";
import { Cast, User, Fan } from "./interface";

Lum0x.init(process.env.LUM0X_API_KEY || "");

let scoreBoard: Record<number, Fan> = {};

const reactionScore = 1;
const recastScore = 3;

// Sorts the scores of users in descending order.
function getSortedScores(): Fan[] {
    const sortedScores: Fan[] = Object.values(scoreBoard);

    sortedScores.sort((a, b) => b.score - a.score);

    for (let i = 0; i < sortedScores.length; i++) {
        scoreBoard[sortedScores[i].fid].ranks = i + 1;
    }

    return sortedScores;
}

// Updates the scoreBoard based on reactions and recasts for a given Cast.
function processReaction(cast: Cast): void {
    const { reactions, recasts } = cast;
    const reactionFids = reactions.fids;
    const recastFids = recasts.fids;

    for (const reactionFid of reactionFids) {
        if (!scoreBoard[reactionFid]) {
            scoreBoard[reactionFid] = {
                fid: reactionFid,
                score: 0,
                reactions: 0,
                recasts: 0,
                ranks: 0
            };
        }
        scoreBoard[reactionFid].score += reactionScore;
        scoreBoard[reactionFid].reactions += 1;
    }

    for (const recastFid of recastFids) {
        if (!scoreBoard[recastFid]) {
            scoreBoard[recastFid] = {
                fid: recastFid,
                score: 0,
                reactions: 0,
                recasts: 0,
                ranks: 0
            };
        }
        scoreBoard[recastFid].score += recastScore;
        scoreBoard[recastFid].recasts += 1;
    }
}

export async function getDisplayName(fids: string): Promise<string[]> {
    const res = await Lum0x.farcasterUser.getUserByFids({ fids: fids });
    const users: User[] = res.users;

    return users.map(user => user.display_name);
}

async function searchMyFan(fid: number): Promise<Fan[]> {
    const res = await Lum0x.farcasterCast.getCastsByFid({
        fid: fid,
        limit: 100
    });

    const casts: Cast[] = res.result.casts;
    for (const cast of casts) {
        processReaction(cast);
    }

    const sortedFids: Fan[] = getSortedScores();

    return sortedFids;
}

export async function getTop10Fans(fid: number): Promise<Fan[]> {
    const res = await Lum0x.farcasterCast.getCastsByFid({
        fid: fid,
        limit: 100
    });

    const casts: Cast[] = res.result.casts;
    for (const cast of casts) {
        processReaction(cast);
    }

    const sortedFids: Fan[] = getSortedScores();

    // Limit to top 10 scores
    sortedFids.splice(10);

    // Create a comma-separated string of FIDs
    let fids = sortedFids.map(info => info.fid).join(',');

    const displayNames: string[] = await getDisplayName(fids);

    // Attach display names to sortedFids
    for (let i = 0; i < sortedFids.length; i++) {
        sortedFids[i].display_name = displayNames[i];
    }

    return sortedFids;
}

export async function weightedRaffle(fid: number): Promise<Fan> {
    const fans = await searchMyFan(fid);
    const totalWeight = fans.reduce((total, fan) => total + fan.score, 0);
    let randomValue = Math.random() * totalWeight;

    for (const fan of fans) {
        randomValue -= fan.score;
        if (randomValue <= 0) {
            return fan;
        }
    }
    // In case no winner was found (should not happen), return the last fan as a fallback
    return fans[fans.length - 1];
}

export async function getUserPfpUrl(fid: number): Promise<string> {
    const res = await Lum0x.farcasterUser.getUserByFids({ fids: String(fid) });
    const user = res.users[0];

    return user.pfp_url;
}

export async function postLum0xTestFrameValidation(fid: number, path: string) {
    fetch('https://testnetapi.lum0x.com/frame/validation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            farcasterFid: fid,
            frameUrl: `${process.env.BASE_URL}/api/${path}`
        })
      });
}