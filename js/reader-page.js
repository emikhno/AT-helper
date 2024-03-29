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
        if (!userSelection.selected) {
            return;
        }

        const modalTitle = AThelper.modal.querySelector(`.${extPrefix}modal_title`);
        modalTitle.textContent = browser.i18n.getMessage("typoText") + '?';

        const modalBody = AThelper.modal.querySelector(`.${extPrefix}modal_body`);
        modalBody.textContent = '';
        const typoDescription = document.createElement('p');
        typoDescription.classList.add(`${extPrefix}text-center`);
        typoDescription.classList.add(`${extPrefix}font-italic`);
        typoDescription.textContent = browser.i18n.getMessage("typoDescription");
        modalBody.appendChild(typoDescription);
        const typoContext = document.createElement('p');
        const typoContextStart = document.createElement('span');
        typoContextStart.textContent = userSelection.start;
        typoContext.appendChild(typoContextStart);
        const typoSelection = document.createElement('b');
        typoSelection.textContent = `[***]${userSelection.selected}[***]`;
        typoContext.appendChild(typoSelection);
        const typoContextEnd = document.createElement('span');
        typoContextEnd.textContent = userSelection.end;
        typoContext.appendChild(typoContextEnd);
        modalBody.appendChild(typoContext);

        const typoDescriptionInput = document.createElement('input');
        typoDescriptionInput.id = `${extPrefix}typo-description`;
        typoDescriptionInput.placeholder =  browser.i18n.getMessage("describeTypoText");
        typoDescriptionInput.classList.add('form-control');
        typoDescriptionInput.classList.add(`${extPrefix}w-100`);
        typoDescriptionInput.addEventListener('keyup', (event) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                saveUserSelection();
            }
        });
        modalBody.appendChild(typoDescriptionInput);

        const modalSave = AThelper.modal.querySelector(`.${extPrefix}modal_actionMain`);
        modalSave.textContent = browser.i18n.getMessage("saveText");
        modalSave.addEventListener('click', () => {
            saveUserSelection();
        });

        AThelper.modal.classList.add(`${extPrefix}d-block`);
        typoDescriptionInput.focus();



        function saveUserSelection() {
            if (!userSelection.selected) {
                return;
            }

            userSelection.typoDescription = document.getElementById(`${extPrefix}typo-description`).value;
            userSelection.chapterName = document.querySelector('h1').textContent;
            const bookId = location.pathname.split('/')[2];
            let bookTypos = localStorage.getItem(`${extPrefix}typos_${bookId}`);

            if (!bookTypos) {
                localStorage.setItem(`${extPrefix}typos_${bookId}`, JSON.stringify([userSelection]));
            } else {
                bookTypos = JSON.parse(bookTypos);
                localStorage.setItem(`${extPrefix}typos_${bookId}`, JSON.stringify([...bookTypos, userSelection]));
            }

            AThelper.modal.classList.remove(`${extPrefix}d-block`);
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
