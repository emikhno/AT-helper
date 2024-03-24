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
    const typoListTitle = typoListModal.querySelector(`.${extPrefix}modal_title`);
    typoListTitle.textContent = browser.i18n.getMessage("typosText");
    const typoListBody = typoListModal.querySelector(`.${extPrefix}modal_body`);
    typoListBody.innerHTML = '';
    const typoListCopy = typoListModal.querySelector(`.${extPrefix}modal_actionMain`);
    typoListCopy.textContent = browser.i18n.getMessage("copyText");
    const typoListClear = typoListModal.querySelector(`.${extPrefix}modal_actionSecond`);
    typoListClear.textContent = browser.i18n.getMessage("clearText");

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

        typoListBody.appendChild(typoElement);
        prevChapter = typo.chapterName;
    });

    typoListCopy.addEventListener('click', () => {
        const commentField = document.querySelector('.fr-element');
        if (commentField) {
            commentField.focus();
            typoListBody.childNodes.forEach(node => {
                commentField.appendChild(node.cloneNode(true));
            });

            try {
                const form = commentField.closest('form');
                setTimeout(() => {
                    const submitButton = form.querySelector('[data-bind="btn: processing, disable: disableSubmit"]');
                    submitButton.removeAttribute('disabled');
                });
            } catch (error) {
                console.log(form, submitButton);
            }
        }
        typoListModal.classList.remove('AThelper__d-block');
    });

    typoListClear.addEventListener('click', () => {
       const result = confirm(browser.i18n.getMessage("clearConfirm"));
       if (result) {
           localStorage.removeItem(`${extPrefix}typos_${bookId}`);
           typosList.classList.remove(`${extPrefix}d-block`);
           typoListModal.classList.remove('AThelper__d-block');
       }
    });

    typoListModal.classList.add('AThelper__d-block');
}
