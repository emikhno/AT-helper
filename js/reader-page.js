(function (AThelper) {
    const extPrefix = AThelper.prefix;
    let userSelection = {};

    const isDefendedFromCopying = document.querySelector('.noselect ');
    if (isDefendedFromCopying) {
        return;
    }

    const typoIcon = document.getElementById(`${extPrefix}typoIcon`);
    typoIcon.classList.add(`${extPrefix}d-block`);
    typoIcon.addEventListener('click', () => {
        openWhatWrongModal();
    });

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
        userSelection.typoDescription = prompt(
            `${browser.i18n.getMessage("typoDescription")}\n
                ${userSelection.start}[***]${userSelection.selected}[***]${userSelection.end}\n
                ${browser.i18n.getMessage("typoSubmit")}`,
            ''); // TODO Should it be replaced to a custom modal?

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
}(window.AThelper));
