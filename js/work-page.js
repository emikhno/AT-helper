const bookId = location.pathname.split('/')[2];
let bookTypos = localStorage.getItem(`${extPrefix}typos_${bookId}`);

if (bookTypos) {
    bookTypos = JSON.parse(bookTypos);
    const typosList = document.getElementById(`${extPrefix}typosList`);
    typosList.classList.remove(`${extPrefix}d-none`);
    typosList.classList.add(`${extPrefix}d-block`);
    typosList.addEventListener('click', () => {
        openListModal();
    });
}



function openListModal() {
    let typos = '';
    bookTypos.forEach((typo) => {
        typos += `${typo.chapterName}\n\n${typo.start}[***]${typo.selected}[***]${typo.end}\n\n${typo.typoDescription}\n\n`;
    });
    alert(typos); // TODO replace to custom modal
}
