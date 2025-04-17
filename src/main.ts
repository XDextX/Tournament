import { Player, Match } from './models/Player'
import { matchMaking } from './logic/matchmaking'
import './style.css'
const appElement = document.querySelector<HTMLDivElement>('#app')!;
const playerForm = document.querySelector<HTMLFormElement>('#player-form')!;
const playersElement = document.querySelector<HTMLDivElement>('#players')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-button')!;


appElement.style.width = '100%';
appElement.style.height = '100%';
const rounds: Match[][] = [];
const players: Player[] = [

];
playerForm.addEventListener('submit', onFormSubmit);
startButton.addEventListener('click', () => {
  playerForm.reset();
  playerForm.style.display = 'none';
  nextRound(players);
});
renderPlayers();

function onFormSubmit(e: Event) {
  e.preventDefault();
  const formData = new FormData(playerForm);
  const data = Object.fromEntries(formData);
  const name = data.name;
  if (!name) {
    alert('Please enter a name');
    return;
  }
  const player = new Player(name.toString());
  players.push(player);
  playerForm.reset();
  renderPlayers();
}
function renderPlayers() {
  playersElement.innerHTML = '';
  players.forEach(player => {
    const playerElement = createPlayerElement(player);
    playersElement.appendChild(playerElement);
  });
}
// test data
const testData = false;
if (testData) {
  players.push(...[new Player('John'),
  new Player('Jane'),
  new Player('Bob'),
  new Player('Alice'),
  new Player('Dave'),
  new Player('Eve'),
  new Player('Frank'),
  new Player('George'),
  new Player('Harry'),
  new Player('Ivan'),
  new Player('Jack'),
  new Player('Joe'),
  new Player('Judy'),
  new Player('Kevin'),
  new Player('Larry'),
  new Player('Mary'),
  new Player('Nate'),
  new Player('Oliver'),
  new Player('Peter'),
  new Player('Queen'),
  new Player('Richard'),
  new Player('Sam'),
  new Player('Tom'),]);
}


function getWinners(matches: Match[]) {
  return matches.map(match => match.winner)
}
function createPlayerElement(player: Player) {
  const el = document.createElement('button');
  el.innerHTML = player.render();
  const newLocal: Partial<CSSStyleDeclaration> = {
    width: '50%',
    height: '50px',
    margin: '10px',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
  };
  el.classList.add('flex-container');
  Object.assign(el.style, newLocal);

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
    if (selected) selected.style.backgroundColor = '#fff';
    el.style.backgroundColor = '#ccc';
    setSelected(el);
  });
}
// console.log(matches);


function nextRound(players: Player[]) {

  const matchBoard = document.createElement('div');
  matchBoard.classList.add('flex-container');

  matchBoard.style.border = '1px solid black';


  const matches = matchMaking(players);
  const elements = getMatchElements(matches);
  elements.forEach(el => {
    el.style.width = `${100 / elements.length}%`;
    el.style.minWidth = `20%`
    el.style.maxWidth = `30%`
  });
  if (players.length === 1) {
    const winnerMsg = document.createElement('div');
    winnerMsg.innerText = `🏆 Winner: ${players[0].name}`;
    winnerMsg.style.fontSize = '24px';
    winnerMsg.style.marginTop = '20px';
    matchBoard.appendChild(winnerMsg);
    appElement.innerHTML = '';
    appElement.appendChild(matchBoard);
    appElement.appendChild(renderHistory());
    return;
  }
  const nextRoundButton = document.createElement('button');
  nextRoundButton.innerText = 'Next Round';
  nextRoundButton.style.margin = '20px auto';
  nextRoundButton.style.display = 'block';
  nextRoundButton.style.padding = '10px 20px';
  nextRoundButton.style.fontSize = '16px';

  nextRoundButton.addEventListener('click', () => {
    const winners = getWinners(matches);
    if (winners.length > 0 && winners.every(player => player !== null)) {
      nextRound(winners);
    }
  });
  matchBoard.append(...elements);
  appElement.innerHTML = '';
  appElement.appendChild(matchBoard);
  if (players.length > 1) {
    appElement.appendChild(nextRoundButton);
  }
  rounds.push(matches);
}

function getMatchElements(matches: Match[]): HTMLElement[] {
  return matches.map(match => {
    const { player1, player2 } = match;
    if (!player2) {
      // console.log(match);

      return createByeMatchElement(player1);
    }

    let matchElement = document.createElement('div');
    let player1Element = createPlayerElement(player1);
    let player2Element = createPlayerElement(player2);
    let selected: HTMLElement | undefined;

    attachSelectionHandler(player1Element, () => selected, el => {
      selected = el;
      match.setWinner(player1);
      player1Element.style.pointerEvents = 'none';
      player2Element.style.pointerEvents = 'none';
      player1Element.innerHTML = player1.render();
      player2Element.innerHTML = player2.render();
      matchElement.style.backgroundColor = 'green';

    });
    attachSelectionHandler(player2Element, () => selected, el => {

      selected = el;
      match.setWinner(player2);
      player1Element.style.pointerEvents = 'none';
      player2Element.style.pointerEvents = 'none';
      player1Element.innerHTML = player1.render();
      player2Element.innerHTML = player2.render();
      matchElement.style.backgroundColor = 'green';

    });

    matchElement.appendChild(player1Element);
    matchElement.appendChild(player2Element);
    Object.assign(matchElement.style, {
      border: '1px solid black',
      margin: '10px',
      padding: '5px',
    });
    matchElement.classList.add('flex-container');

    return matchElement;
  });
}

function createByeMatchElement(player1: Player): HTMLElement {
  const el = document.createElement('div');
  el.innerText = `${player1.name} gets a bye this round`;
  el.style.margin = '10px';
  el.style.padding = '10px';
  el.style.border = '1px dashed gray';
  return el;
}
function renderHistory() {
  const history = document.createElement('div');
  history.innerHTML = '<h3>Match History</h3>';

  rounds.forEach((round, index) => {
    const roundDiv = document.createElement('div');
    roundDiv.innerHTML = `<strong>Round ${index + 1}</strong>`;
    round.forEach(match => {
      const p1 = match.player1.name;
      const p2 = match.player2?.name ?? 'BYE';
      const winner = match.winner?.name ?? 'Pending';
      const matchDiv = document.createElement('div');
      matchDiv.innerText = `${p1} vs ${p2} → Winner: ${winner}`;
      roundDiv.appendChild(matchDiv);
    });
    history.appendChild(roundDiv);
  });

  return history;
}

