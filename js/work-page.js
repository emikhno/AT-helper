const bookId = location.pathname.split('/')[2];
let bookTypos = localStorage.getItem(`${extPrefix}typos_${bookId}`);

if (bookTypos) {
    bookTypos = JSON.parse(bookTypos);
    const typosList = document.getElementById(`${extPrefix}typosList`);
    typosList.classList.add(`${extPrefix}d-block`);
    typosList.addEventListener('click', () => {
        openListModal();
    });
}



function openListModal() {
    const typoListTitle = typoListModal.querySelector(`.${extPrefix}modal_title`);
    typoListTitle.textContent = 'Опечатки';
    const typoListBody = typoListModal.querySelector(`.${extPrefix}modal_body`);
    typoListBody.innerHTML = '';
    const typoListCopy = typoListModal.querySelector(`.${extPrefix}modal_actionMain`);
    typoListCopy.textContent = 'Копировать';
    const typoListClear = typoListModal.querySelector(`.${extPrefix}modal_actionSecond`);
    typoListClear.textContent = 'Очистить';

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
            commentField.innerHTML = typoListBody.innerHTML;
            // commentField.innerHTML = typosText;
            commentField.focus();

            /*try {
                const form = commentField.closest('form');
                setTimeout(() => {
                    const submitButton = form.querySelector('[data-bind="btn: processing, disable: disableSubmit"]');
                    submitButton.removeAttribute('disabled');
                });
            } catch (error) {
                console.log(form, submitButton);
            }*/
        }
        typoListModal.classList.remove('AThelper__d-block');
    });

    typoListClear.addEventListener('click', () => {
       const result = confirm('Вы уверены, что хотите удалить все записи?');
       if (result) {
           localStorage.removeItem(`${extPrefix}typos_${bookId}`);
           typosList.classList.remove(`${extPrefix}d-block`);
           typoListModal.classList.remove('AThelper__d-block');
       }
    });

    typoListModal.classList.add('AThelper__d-block');
}
