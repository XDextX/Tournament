import { Player, Match } from "../models/Player";

export function createMatches(players: Player[]) {
    // Build a list of matches for rounds

    let matches: Match[] = [];
    const shuffled = [...players]
        .sort(() => Math.random() - 0.5);
    if (shuffled.length % 2 !== 0) {
        const byePlayer = shuffled.pop();
        if (!byePlayer) throw new Error('byePlayer is undefined');
        byePlayer.score += 1;
        matches.push(new Match(byePlayer, null));
    }
    for (let i = 0; i < shuffled.length; i += 2) {
        const match = new Match(shuffled[i], shuffled[i + 1]);

        matches.push(match);
    }

    return matches;
}


