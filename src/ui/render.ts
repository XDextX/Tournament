import { Player } from "../models/Player";

export function getPlayerElement(player: Player): HTMLElement {
    const el = document.createElement('button');
    el.innerHTML = player.render();
    el.classList.add('player', 'flex-container');
    return el;
}

export function getActionButton(callback: undefined | null | (() => void)): HTMLButtonElement {
    const button = document.createElement('button');
    if (callback)
        button.addEventListener('click', callback);
    return button;
}
export function getMatchElement(): HTMLElement {
    const matchEl = document.createElement('div');

    matchEl.classList.add('match-card', 'flex-container');
    Object.assign(matchEl.style, {
        border: '1px solid black',
        margin: '10px',
        padding: '5px',
    });

    return matchEl;
}