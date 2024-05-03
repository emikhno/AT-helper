try {
    const AThelper = window.AThelper;
    const extPrefix = AThelper.prefix;
    let userSelection = {};

    setInterval(() => {
        const isLoading = document.querySelector('.loading');
        if (isLoading) {
            const loadingTimerId = setInterval(() => {
                const isLoading = document.querySelector('.loading');
                if (!isLoading) {
                    clearInterval(loadingTimerId);
                    const hardcodedStylesSpans = document.querySelectorAll('span[style*="color:"]');
                    for (let i = 0; i < hardcodedStylesSpans.length; i++) {
                        hardcodedStylesSpans[i].style.color = '';
                    }
                    const hardcodedStylesParagraphs = document.querySelectorAll('p[style*="color:"]');
                    for (let i = 0; i < hardcodedStylesParagraphs.length; i++) {
                        hardcodedStylesParagraphs[i].style.color = '';
                    }
                }
            }, 500);
        }
    }, 500);

    const isProtectedFromCopying = document.querySelector('.noselect');
    if (!isProtectedFromCopying) {
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
    }



    function openWhatWrongModal() {
        if (!userSelection.selected) {
            return;
        }

        const modalTitle = AThelper.modal.querySelector(`.${extPrefix}modal_title`);
        modalTitle.textContent = browser.i18n.getMessage('typoText') + '?';

        const modalBody = AThelper.modal.querySelector(`.${extPrefix}modal_body`);
        modalBody.textContent = '';
        const typoDescription = document.createElement('p');
        typoDescription.classList.add(`${extPrefix}text-center`);
        typoDescription.classList.add(`${extPrefix}font-italic`);
        typoDescription.textContent = browser.i18n.getMessage('typoDescription');
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
        typoDescriptionInput.type = 'text';
        typoDescriptionInput.id = `${extPrefix}typo-description`;
        typoDescriptionInput.placeholder =  browser.i18n.getMessage('describeTypoText');
        typoDescriptionInput.classList.add('form-control');
        typoDescriptionInput.classList.add(`${extPrefix}w-100`);
        typoDescriptionInput.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.stopPropagation(); // To prevent reader scrolling
            }
        });
        typoDescriptionInput.addEventListener('keyup', (event) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                saveUserSelection();
            }
        });
        modalBody.appendChild(typoDescriptionInput);

        const modalSave = AThelper.modal.querySelector(`.${extPrefix}modal_actionMain`);
        modalSave.textContent = browser.i18n.getMessage('saveText');
        modalSave.addEventListener('click', saveUserSelection);

        AThelper.modal.classList.add(`${extPrefix}d-block`);
        typoDescriptionInput.focus();
    }

    function saveUserSelection() {
        if (!userSelection.selected) {
            return;
        }

        userSelection.typoDescription = document.getElementById(`${extPrefix}typo-description`).value;
        userSelection.chapterName = document.querySelector('h1').textContent;
        const bookId = location.pathname.split('/')[2];

        browser.runtime.sendMessage({
            message: 'saveTypo',
            payload: {
                'book_id': +bookId,
                ...userSelection
            }
        }).then(() => {
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

            const typoIconPath = document.getElementById(`${extPrefix}typoIcon_path`);
            typoIconPath.setAttribute('stroke', '#4CAF50');
            setTimeout(() => {
                if (AThelper.themeCurrent === 'dark') {
                    typoIconPath.setAttribute('stroke', '#FFFFFF');
                } else {
                    typoIconPath.setAttribute('stroke', '#212121');
                }
            }, 1000);
        }).catch((error) => {
            console.error(error);
        });
    }
} catch (error) {
    console.error('Error:', error);
}
