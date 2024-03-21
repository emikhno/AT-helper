const typoIcon = document.getElementById(`${extPrefix}typoIcon`);
typoIcon.classList.remove(`${extPrefix}d-none`);
typoIcon.classList.add(`${extPrefix}d-block`);
typoIcon.addEventListener('click', () => {
    openWhatWrongModal();
});
let userSelection = {};

document.onselectionchange = () => {
    const selection = document.getSelection();
    if (!selection.isCollapsed) {
        userSelection.start = selection.anchorNode.textContent.slice(0, selection.anchorOffset);
        userSelection.selected = selection.toString();
        userSelection.end = selection.focusNode.textContent.slice(selection.focusOffset);
    }
}

document.addEventListener('keyup', event => {
    if (event.ctrlKey && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
        openWhatWrongModal();
    }
});


function openWhatWrongModal() {
    userSelection.typoDescription = prompt(`Опишите ошибку в выделенном тремя звёздочками фрагменте (это необязательно):\n
${userSelection.start}[***]${userSelection.selected}[***]${userSelection.end}\n
Нажмите ОК, чтобы сохранить информацию об ошибке.`, ''); // TODO replace to custom modal

    if (userSelection.typoDescription !== null) {
        userSelection.chapterName = document.querySelector('h1').textContent;
        const bookId = location.pathname.split('/')[2];
        let bookTypos = localStorage.getItem(`${extPrefix}typos_${bookId}`);

        if (!bookTypos) {
            localStorage.setItem(`${extPrefix}typos_${bookId}`, JSON.stringify([userSelection]));
        } else {
            bookTypos = JSON.parse(bookTypos);
            localStorage.setItem(`${extPrefix}typos_${bookId}`, JSON.stringify([...bookTypos, userSelection]));
        }

        userSelection = {};
        if (window.getSelection) {
            if (window.getSelection().empty) { // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) { // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) { // IE
            document.selection.empty();
        }
    }
}
