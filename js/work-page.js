(function (AThelper) {
    const extPrefix = AThelper.prefix;
    const bookId = location.pathname.split('/')[2];
    let bookTypos = localStorage.getItem(`${extPrefix}typos_${bookId}`);
    const typosList = document.getElementById(`${extPrefix}typosList`);

    if (bookTypos) {
        bookTypos = JSON.parse(bookTypos);
        typosList.classList.add(`${extPrefix}d-block`);
        typosList.addEventListener('click', () => {
            openListModal();
        });
    }



    function openListModal() {
        const typosListTitle = AThelper.modal.querySelector(`.${extPrefix}modal_title`);
        typosListTitle.textContent = browser.i18n.getMessage("typosText");
        const typosListBody = AThelper.modal.querySelector(`.${extPrefix}modal_body`);
        typosListBody.innerHTML = '';
        const typosListCopy = AThelper.modal.querySelector(`.${extPrefix}modal_actionMain`);
        typosListCopy.textContent = browser.i18n.getMessage("copyText");
        const typosListClear = AThelper.modal.querySelector(`.${extPrefix}modal_actionSecond`);
        typosListClear.classList.add(`${extPrefix}d-block`)
        typosListClear.textContent = browser.i18n.getMessage("clearText");

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
            typoBody.innerHTML = `${typo.start}<b>[***]${typo.selected}[***]</b>${typo.end}`;
            // typosText += `${typo.start}[***]${typo.selected}[***]${typo.end}\n\n`;
            if (typo.typoDescription) {
                typoBody.innerHTML += `<br><i>/${typo.typoDescription}/</i>`;
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
            const result = confirm(browser.i18n.getMessage("clearConfirm"));
            if (result) {
                localStorage.removeItem(`${extPrefix}typos_${bookId}`);
                typosList.classList.remove(`${extPrefix}d-block`);
                AThelper.modal.classList.remove(`${extPrefix}d-block`);
            }
        });

        AThelper.modal.classList.add(`${extPrefix}d-block`);
    }
}(window.AThelper));
