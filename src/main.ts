import { Player, Match } from './models/Player'
import { matchMaking } from './logic/matchmaking';
import './style.css';

// DOM Elements
const appElement = document.querySelector<HTMLDivElement>('#app')!;
const playerForm = document.querySelector<HTMLFormElement>('#player-form')!;
const playersElement = document.querySelector<HTMLDivElement>('#players')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-button')!;

// State
const rounds: Match[][] = [];
const players: Player[] = [];

// Initial Setup
playerForm.addEventListener('submit', handlePlayerSubmit);
startButton.addEventListener('click', startTournament);

// Test Data (for development)
if (true) {
  const testPlayers = [
    'John', 'Jane', 'Bob', 'Alice', 'Dave', 'Eve', 'Frank', 'George',
    'Harry', 'Ivan', 'Jack', 'Joe', 'Judy', 'Kevin', 'Larry', 'Mary',
    'Nate', 'Oliver', 'Peter', 'Queen', 'Richard', 'Sam', 'Tom'
  ];
  testPlayers.forEach(name => players.push(new Player(name)));
  renderPlayers();
}

function handlePlayerSubmit(e: Event) {
  e.preventDefault();
  const formData = new FormData(playerForm);
  const name = formData.get('name')?.toString().trim();

  if (!name) return alert('Please enter a name');

  players.push(new Player(name));
  playerForm.reset();
  renderPlayers();
}

function renderPlayers() {
  playersElement.innerHTML = '';
  players.forEach(player => {
    const playerEl = createPlayerElement(player);
    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'X';
    removeBtn.addEventListener('click', () => {
      players.splice(players.indexOf(player), 1);
      renderPlayers();
    });
    removeBtn.classList.add('remove-btn');
    playerEl.appendChild(removeBtn);

    playersElement.appendChild(playerEl);
  });
}

function startTournament() {
  playerForm.style.display = 'none';
  nextRound(players);
}

function nextRound(currentPlayers: Player[]) {
  const matchBoard = document.createElement('div');
  matchBoard.classList.add('flex-container');
  matchBoard.style.border = '1px solid black';

  const matches = matchMaking(currentPlayers);
  rounds.push(matches);

  const matchElements = generateMatchElements(matches);
  matchElements.forEach(el => Object.assign(el.style, {
    width: `${100 / matchElements.length}%`,
    minWidth: '20%',
    maxWidth: '30%',
  }));

  // Winner
  if (currentPlayers.length === 1) {
    const winnerMsg = document.createElement('div');
    winnerMsg.innerText = `🏆 Winner: ${currentPlayers[0].name}`;
    winnerMsg.classList.add('winner-msg');
    appElement.innerHTML = '';
    matchBoard.appendChild(winnerMsg);
    appElement.appendChild(matchBoard);
    appElement.appendChild(renderHistory());
    return;
  }

  // Next Round Button
  const nextRoundBtn = document.createElement('button');
  nextRoundBtn.innerText = 'Next Round';
  nextRoundBtn.classList.add('button');
  nextRoundBtn.addEventListener('click', () => {
    const winners = matches.map(m => m.winner);
    if (winners.every(p => p)) nextRound(winners as Player[]);
  });

  matchBoard.append(...matchElements);
  appElement.innerHTML = '';
  appElement.appendChild(matchBoard);
  appElement.appendChild(nextRoundBtn);
}

function generateMatchElements(matches: Match[]): HTMLElement[] {
  return matches.map(match => {
    if (match.player2 == null) return createByeMatchElement(match.player1);

    const matchEl = document.createElement('div');
    const p1El = createPlayerElement(match.player1);
    const p2El = createPlayerElement(match.player2);
    let selected: HTMLElement | undefined;

    const lockSelection = () => {
      p1El.style.pointerEvents = 'none';
      p2El.style.pointerEvents = 'none';
      matchEl.style.backgroundColor = 'green';
      p1El.innerHTML = match.player1.render();
      p2El.innerHTML = match.player2!.render();
    };

    attachSelectionHandler(p1El, () => selected, el => {
      selected = el;
      match.setWinner(match.player1);
      lockSelection();
    });

    attachSelectionHandler(p2El, () => selected, el => {
      selected = el;
      match.setWinner(match.player2!);
      lockSelection();
    });

    matchEl.classList.add('match-card', 'flex-container');
    Object.assign(matchEl.style, {
      border: '1px solid black',
      margin: '10px',
      padding: '5px',
    });

    matchEl.append(p1El, p2El);
    return matchEl;
  });
}

function createPlayerElement(player: Player): HTMLElement {
  const el = document.createElement('button');
  el.innerHTML = player.render();
  el.classList.add('player', 'flex-container');
  return el;
}

function attachSelectionHandler(
  el: HTMLElement,
  getSelected: () => HTMLElement | undefined,
  setSelected: (el: HTMLElement) => void
) {
  el.addEventListener('click', () => {
    const selected = getSelected();
    if (selected === el) return;
    if (selected) selected.classList.remove('selected');
    el.classList.add('selected');
    setSelected(el);
    renderPlayers();
  });
}

function createByeMatchElement(player: Player): HTMLElement {
  const el = document.createElement('div');
  el.innerText = `${player.name} gets a bye this round`;
  el.classList.add('bye-match');
  return el;
}

function renderHistory(): HTMLElement {
  const history = document.createElement('div');
  history.innerHTML = '<h3>Match History</h3>';

  rounds.forEach((round, i) => {
    const roundDiv = document.createElement('div');
    roundDiv.innerHTML = `<strong>Round ${i + 1}</strong>`;
    round.forEach(({ player1, player2, winner }) => {
      const p1 = player1.name;
      const p2 = player2?.name ?? 'BYE';
      const win = winner?.name ?? 'Pending';
      const matchDiv = document.createElement('div');
      matchDiv.innerText = `${p1} vs ${p2} → Winner: ${win}`;
      roundDiv.appendChild(matchDiv);
    });
    history.appendChild(roundDiv);
  });

  return history;
}
