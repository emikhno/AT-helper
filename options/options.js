try {
    const themeDefault = document.getElementById('theme-default');
    const themeDark = document.getElementById('theme-dark');
    const mainSettingsLink = document.getElementById('main-settings-link');
    const mainSettings = document.getElementById('main');
    const topicSelector = document.getElementById('topic-selector');
    const typosListLink = document.getElementById('typos-link');
    const typosList = document.getElementById('typos');
    const errorMessage = document.getElementById('error-message');

    const uiLanguage = browser.i18n.getUILanguage();
    if (['en-US', 'en-GB', 'en-CA'].includes(uiLanguage)) {
        mainSettingsLink.textContent = 'Main';
        typosLink.textContent = 'Typos';
        document.getElementById('main-settings-title').textContent = 'Main Settings';
        document.getElementById('theme-title').textContent = 'Theme';
        document.getElementById('theme-light-text').textContent = 'Light';
        document.getElementById('theme-dark-text').textContent = 'Dark';
        topicSelector.textContent = 'Clear';
        document.getElementById('typos-settings-title').textContent = 'List of typos';
    }

    browser.runtime.sendMessage({
        message: 'getTheme'
    }).then(response => {
        if (response) {
            (response === 'dark')
                ? applyDarkTheme()
                : applyDefaultTheme();
        } else {
            setTimeout(() => {
                browser.runtime.sendMessage({
                    message: 'getTheme'
                }).then(response => {
                    (response === 'dark')
                        ? applyDarkTheme()
                        : applyDefaultTheme();
                })
            }, 10);
        }
    }).catch((error) => {
        console.error('Error:', error);
        errorMessage.textContent = error;
        errorMessage.classList.remove('d-none');
    });

    let topicFilter = [];
    const topicSelectorOptions = topicSelector.querySelectorAll('option');
    browser.runtime.sendMessage({
        message: 'getBlogTopicFilter'
    }).then(response => {
        topicFilter = response ?? [];
        for (let i = 0; i < topicSelectorOptions.length; i++) {
            if (topicFilter.includes(topicSelectorOptions[i].value)) {
                topicSelectorOptions[i].selected = true;
            }
        }
    }).catch((error) => {
        console.error(error);
    });

    browser.runtime.sendMessage({
        message: 'getBooksTypos'
    }).then(response => {
        if (response.length > 0) {
            let prevBook = '';
            let prevChapter = '';
            response.forEach(typo => {
                if (typo.book_id !== prevBook) {
                    const bookLink = document.createElement('a');
                    bookLink.href = 'https://author.today/work/' + typo.book_id;
                    bookLink.target = '_blank';
                    bookLink.classList.add('book-link');
                    const bookName = document.createElement('h3');
                    bookName.textContent = typo.book_id;
                    bookLink.appendChild(bookName);
                    typosList.appendChild(bookLink);

                    browser.runtime.sendMessage({
                        message: 'getBook',
                        payload: typo.book_id
                    }).then((bookData) => {
                        if (bookData) {
                            bookName.textContent = bookData.title;
                        }
                    });
                }

                const typoElement = document.createElement('div');

                const chapterName = document.createElement('p');
                if (typo.chapterName !== prevChapter) {
                    chapterName.classList.add('text-bold');
                    chapterName.classList.add('mt-2');
                    chapterName.textContent = typo.chapterName;
                    typoElement.classList.add('chapter_new');
                } else {
                    chapterName.textContent = '...';
                    typoElement.classList.add('chapter_continue');
                }
                typoElement.appendChild(chapterName);

                const typoBody = document.createElement('p');
                typoBody.classList.add('position-relative');
                const typoContextStart = document.createElement('span');
                typoContextStart.textContent = typo.start;
                typoBody.appendChild(typoContextStart);
                const typoSelection = document.createElement('b');
                typoSelection.textContent = `[***]${typo.selected}[***]`;
                typoBody.appendChild(typoSelection);
                const typoContextEnd = document.createElement('span');
                typoContextEnd.textContent = typo.end;
                typoBody.appendChild(typoContextEnd);
                if (typo.typoDescription) {
                    typoBody.appendChild(document.createElement('br'));
                    const typoDescription = document.createElement('i');
                    typoDescription.textContent = typo.typoDescription;
                    typoBody.appendChild(typoDescription);
                }
                const typoDelete = document.createElement('div');
                typoDelete.classList.add('delete-icon');
                typoDelete.dataset.typoId = typo.id;
                typoDelete.textContent = '+';
                typoDelete.addEventListener('click', () => {
                    browser.runtime.sendMessage({
                        message: 'deleteTypo',
                        payload: +typoDelete.dataset.typoId
                    }).then(() => {
                        typoBody.remove();
                        const hasNextChapterTypoElement = typoElement.nextSibling && typoElement.nextSibling.classList.contains('chapter_continue');
                        if (chapterName.textContent === '...' || !hasNextChapterTypoElement) {
                            typoElement.remove();
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                })
                typoBody.appendChild(typoDelete);
                typoElement.appendChild(typoBody);

                typosList.appendChild(typoElement);
                prevChapter = typo.chapterName;
                prevBook = typo.book_id;
            });
        } else {
            noTypos();
        }
    }).catch((error) => {
        console.error('Error:', error);
        errorMessage.textContent = error;
        errorMessage.classList.remove('d-none');
    });

    themeDefault.addEventListener('click', (event) => {
        setThemeRequest('default');
        applyDefaultTheme();
    });

    themeDark.addEventListener('click', (event) => {
        setThemeRequest('dark');
        applyDarkTheme();
    });

    mainSettingsLink.addEventListener('click', () => {
        mainSettings.hidden = false;
        typosList.hidden = true;
        mainSettingsLink.classList.add('nav__item_active');
        typosListLink.classList.remove('nav__item_active');
    });

    typosListLink.addEventListener('click', () => {
        mainSettings.hidden = true;
        typosList.hidden = false;
        mainSettingsLink.classList.remove('nav__item_active');
        typosListLink.classList.add('nav__item_active');
    });

    topicSelector.addEventListener('change', (event) => {
        if (!event.target.value) {
            for (let i = 0; i < topicSelectorOptions.length; i++) {
                topicSelectorOptions[i].selected = false;
            }
        }

        topicFilter = [];
        for (let i = 0; i < topicSelectorOptions.length; i++) {
            if (topicSelectorOptions[i].selected) {
                topicFilter.push(topicSelectorOptions[i].value);
            }
        }

        browser.runtime.sendMessage({
            message: 'setBlogTopicFilter',
            payload: topicFilter
        }).catch((error) => {
            console.error(error);
        });
    });



    function setThemeRequest(theme) {
        browser.runtime.sendMessage({
            message: 'setTheme',
            payload: theme
        }).catch((error) => {
            console.error('Error:', error);
            errorMessage.textContent = error;
            errorMessage.classList.remove('d-none');
        });
    }

    function applyDarkTheme() {
        themeDark.checked = true;
        document.body.classList.add('theme_dark');
    }

    function applyDefaultTheme() {
        themeDefault.checked = true;
        document.body.classList.remove('theme_dark');
    }

    function noTypos() {
        const noTypos = document.createElement('h3');
        noTypos.textContent = browser.i18n.getMessage('noTyposText');
        typosList.appendChild(noTypos);
    }
} catch (error) {
    console.error('Error:', error);
}
