export class Player {
    name: string;
    score: number;
    constructor(name: string, score: number = 0) {
        this.name = name;
        this.score = score;
    }
    render = () => { return `${this.name} (${this.score})` }
}
export class Match {
    player1: Player;
    player2: Player | null;
    constructor(player1: Player, player2: Player | null) {
        this.player1 = player1;
        this.player2 = player2;
    }
    get winner(): Player | null {
        if (this.player2 === null) {
            return this.player1;
        }
        if (this.player1.score === this.player2.score) {
            return null;
        }
        return this.player1.score > this.player2.score ? this.player1 : this.player2;
    }
    setWinner(player: Player) {
        if (this.player2 === player) {
            this.player2.score += 1;
        } else {
            this.player1.score += 1;
        }
    }
}