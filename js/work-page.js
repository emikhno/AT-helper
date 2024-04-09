try {
    const AThelper = window.AThelper;
    const extPrefix = AThelper.prefix;
    const bookId = location.pathname.split('/')[2];
    const typosList = document.getElementById(`${extPrefix}typosList`);
    let bookTypos = [];

    browser.runtime.sendMessage({
        message: 'getBookTypos',
        payload: +bookId
    }).then((response) => {
        bookTypos = response;

        if (bookTypos.length > 0) {
            typosList.classList.add(`${extPrefix}d-block`);
            typosList.addEventListener('click', () => {
                openListModal();
            });

            browser.runtime.sendMessage({
                message: 'saveBook',
                payload: {
                    'id': +bookId,
                    'title': document.querySelector('h1').innerText
                }
            });
        }
    }).catch((error) => {
        console.error(error);
    });



    function openListModal() {
        const typosListTitle = AThelper.modal.querySelector(`.${extPrefix}modal_title`);
        typosListTitle.textContent = browser.i18n.getMessage('typosText');
        const typosListBody = AThelper.modal.querySelector(`.${extPrefix}modal_body`);
        typosListBody.textContent = '';
        const typosListCopy = AThelper.modal.querySelector(`.${extPrefix}modal_actionMain`);
        typosListCopy.textContent = browser.i18n.getMessage('copyText');
        const typosListClear = AThelper.modal.querySelector(`.${extPrefix}modal_actionSecond`);
        typosListClear.classList.add(`${extPrefix}d-block`)
        typosListClear.textContent = browser.i18n.getMessage('clearText');

        let prevChapter = '';
        // let typosText = '';

        bookTypos.forEach((typo) => {
            const typoElement = document.createElement('div');
            const chapterName = document.createElement('p');
            if (typo.chapterName !== prevChapter) {
                chapterName.classList.add(`${extPrefix}bold`);
                chapterName.classList.add(`${extPrefix}mt-2`);
                chapterName.textContent = typo.chapterName;
                // typosText += `${typo.chapterName}\n\n`;
            } else {
                chapterName.textContent = '...';
                // typosText += '...\n\n';
            }
            typoElement.appendChild(chapterName);

            const typoBody = document.createElement('p');
            const typoContextStart = document.createElement('span');
            typoContextStart.textContent = typo.start;
            typoBody.appendChild(typoContextStart);
            const typoSelection = document.createElement('b');
            typoSelection.textContent = `[***]${typo.selected}[***]`;
            typoBody.appendChild(typoSelection);
            const typoContextEnd = document.createElement('span');
            typoContextEnd.textContent = typo.end;
            typoBody.appendChild(typoContextEnd);
            // typosText += `${typo.start}[***]${typo.selected}[***]${typo.end}\n\n`;
            if (typo.typoDescription) {
                typoBody.appendChild(document.createElement('br'));
                const typoDescription = document.createElement('i');
                typoDescription.textContent = typo.typoDescription;
                typoBody.appendChild(typoDescription);
                // typosText += `/${typo.typoDescription}/\n\n`;
            }
            typoElement.appendChild(typoBody);

            typosListBody.appendChild(typoElement);
            prevChapter = typo.chapterName;
        });

        typosListCopy.addEventListener('click', () => {
            const commentField = document.querySelector('.fr-element');
            if (commentField) {
                commentField.focus();
                typosListBody.childNodes.forEach(node => {
                    commentField.appendChild(node.cloneNode(true));
                });

                try {
                    const form = commentField.closest('form');
                    setTimeout(() => {
                        const submitButton = form.querySelector('[data-bind="btn: processing, disable: disableSubmit"]');
                        submitButton.removeAttribute('disabled');
                    });
                } catch (error) {
                    console.warn(form, submitButton);
                }
            }
            AThelper.modal.classList.remove(`${extPrefix}d-block`);
        });

        typosListClear.addEventListener('click', () => {
            const result = confirm(browser.i18n.getMessage('clearConfirm'));
            if (result) {
                bookTypos.forEach(typo => {
                    browser.runtime.sendMessage({
                        message: 'deleteTypo',
                        payload: typo.id
                    }).catch((error) => {
                        console.error(error);
                    });
                });

                typosList.classList.remove(`${extPrefix}d-block`);
                AThelper.modal.classList.remove(`${extPrefix}d-block`);
            }
        });

        AThelper.modal.classList.add(`${extPrefix}d-block`);
    }
} catch (error) {
    console.error('Error:', error);
}
