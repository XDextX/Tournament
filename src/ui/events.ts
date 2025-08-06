export function attachSelectionHandler(
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
    });
}