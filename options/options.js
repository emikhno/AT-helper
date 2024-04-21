try {
    const themeDefault = document.getElementById('theme-default');
    const themeDark = document.getElementById('theme-dark');
    const mainSettingsLink = document.getElementById('main-settings-link');
    const topicSelector = document.getElementById('topic-selector');
    const typosListLink = document.getElementById('typos-link');
    const profilesListLink = document.getElementById('profiles-link');
    const typosList = document.getElementById('typos');
    const profilesList = document.getElementById('profiles');
    const exportBtn = document.getElementById('btn-export');
    const importBtn = document.getElementById('btn-import');
    const errorMessage = document.getElementById('error-message');

    const uiLanguage = browser.i18n.getUILanguage();
    if (['en-US', 'en-GB', 'en-CA'].includes(uiLanguage)) {
        mainSettingsLink.textContent = 'Main';
        typosLink.textContent = 'Typos';
        profilesListLink.textContent = 'Profiles';
        document.getElementById('main-settings-title').textContent = 'Main Settings';
        document.getElementById('theme-title').textContent = 'Theme';
        document.getElementById('theme-light-text').textContent = 'Light';
        document.getElementById('theme-dark-text').textContent = 'Dark';
        document.getElementById('topic-title').textContent = 'Filter by post topics';
        topicSelector.querySelector('option:first-child').textContent = 'Clear';
        document.getElementById('likes-title').textContent = 'Filter by likes (books)';
        document.getElementById('likes-min-text').textContent = 'from: ';
        document.getElementById('likes-max-text').textContent = 'to: ';
        document.getElementById('export-import-title').textContent = 'Database';
        document.getElementById('file-import-label').textContent = 'Upload the database file: ';
        document.getElementById('typos-settings-title').textContent = 'List of typos';
        document.getElementById('profiles-settings-title').textContent = 'Profile notes';
        exportBtn.textContent = 'Export';
        importBtn.textContent = 'Import';
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

    let likesMin;
    let likesMax;
    const likesFilterMin = document.getElementById('likes-min');
    const likesFilterMax = document.getElementById('likes-max');
    browser.runtime.sendMessage({
        message: 'getLikesFilter'
    }).then(response => {
        [likesMin, likesMax] = response ?? [null, null];
        likesFilterMin.value = likesMin;
        likesFilterMax.value = likesMax;
    }).catch((error) => {
        console.error(error);
    });

    browser.runtime.sendMessage({
        message: 'getBooksTypos'
    }).then(response => {
        if (response.length > 0) {
            createTyposList(response);
        } else {
            noTypos();
        }
    }).catch((error) => {
        console.error('Error:', error);
        errorMessage.textContent = error;
        errorMessage.classList.remove('d-none');
    });

    browser.runtime.sendMessage({
        message: 'getProfilesInfo'
    }).then(response => {
        if (response.length > 0) {
            createProfilesNotesList(response);
        } else {
            noProfilesNotes();
        }
    }).catch((error) => {
        console.error(error);
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
        toggleTab('main', 'main-settings-link');
    });

    typosListLink.addEventListener('click', () => {
        toggleTab('typos', 'typos-link');
    });

    profilesListLink.addEventListener('click', () => {
        toggleTab('profiles', 'profiles-link');
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

    likesFilterMin.addEventListener('change', (event) => {
        likesMin = event.target.value;

        browser.runtime.sendMessage({
            message: 'setLikesFilter',
            payload: [likesMin, likesMax]
        }).catch((error) => {
            console.error(error);
        });
    });

    likesFilterMax.addEventListener('change', (event) => {
        likesMax = event.target.value;

        browser.runtime.sendMessage({
            message: 'setLikesFilter',
            payload: [likesMin, likesMax]
        }).catch((error) => {
            console.error(error);
        });
    });

    exportBtn.addEventListener('click', () => {
        browser.runtime.sendMessage({
            message: 'exportDB'
        }).then(response => {
            if (response) {
                const datetime = new Date().toLocaleString('ru');
                const filename = 'at-helper_' + datetime.substr(0, 10).replaceAll('.', '-') + '.json';
                let dbData = {
                    exported_at: datetime,
                    data: response
                };
                dbData = JSON.stringify(dbData);

                const link = document.createElement('a');
                link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dbData);
                link.download = filename;
                link.click();
            }
        }).catch((error) => {
            console.error('Error:', error);
            errorMessage.textContent = error;
            errorMessage.classList.remove('d-none');
        });
    });

    importBtn.addEventListener('click', () => {
        const fileImport = document.getElementById('file-import');
        fileImport.classList.remove('d-none');
    });

    const importInput = document.getElementById('input-import');
    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function () {
            if (reader.result) {
                const data = JSON.parse(reader.result);
                browser.runtime.sendMessage({
                    message: 'importDB',
                    payload: data.data
                }).then((response) => {
                    if (response) {
                        alert(browser.i18n.getMessage('dbImported'));
                        location.reload();
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                    errorMessage.textContent = error;
                    errorMessage.classList.remove('d-none');
                });
            }
        };

        reader.onerror = function () {
            console.error('Error:', error);
            errorMessage.textContent = error;
            errorMessage.classList.remove('d-none');
        };

        importInput.value = '';
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
        const tittle = document.createElement('h3');
        tittle.textContent = browser.i18n.getMessage('noTyposText');
        typosList.appendChild(tittle);
    }

    function noProfilesNotes() {
        const tittle = document.createElement('h3');
        tittle.textContent = browser.i18n.getMessage('noProfilesNotesText');
        profilesList.appendChild(tittle);
    }

    function toggleTab(settingsGroupId, settingsLinkId) {
        const settingsGroups = document.querySelectorAll('.settings__group');
        for (let i = 0; i < settingsGroups.length; i++) {
            settingsGroups[i].hidden = (settingsGroups[i].id !== settingsGroupId);
        }

        const navItems = document.querySelectorAll('.nav__item');
        for (let i = 0; i < navItems.length; i++) {
            if (navItems[i].id === settingsLinkId) {
                navItems[i].classList.add('nav__item_active');
            } else {
                navItems[i].classList.remove('nav__item_active');
            }
        }
    }

    function createTyposList(typos) {
        let prevBook = '';
        let prevChapter = '';
        typos.forEach(typo => {
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
    }

    function createProfilesNotesList(profiles) {
        const list = document.createElement('ol');
        list.classList.add('profiles-list');

        profiles.forEach(profile => {
            const li = document.createElement('li');
            li.classList.add('profiles-list__li');

            const link = document.createElement('a');
            link.textContent = profile.name;
            link.href = 'https://author.today/u/' + profile.id;
            link.target = '_blank';
            link.classList.add('profiles-list__link');
            li.appendChild(link);

            const note = document.createElement('span');
            note.textContent = profile.info;
            note.title = 'Edit';
            note.classList.add('profiles-list__note');
            note.addEventListener('click', () => {
                const textarea = document.createElement('textarea');
                textarea.classList.add('profiles-list__note-edit');
                textarea.rows = 1;
                textarea.cols = 40;
                textarea.placeholder = browser.i18n.getMessage('profileInfoPlaceholder');
                textarea.textContent = note.textContent;

                textarea.addEventListener('change', (event) => {
                    const profileInfo = event.target.value;
                    browser.runtime.sendMessage({
                        message: 'setProfileInfo',
                        payload: {
                            id: profile.id,
                            info: profileInfo,
                            name: profile.name
                        }
                    }).then(() => {
                        textarea.classList.add('profiles-list__note-edit_saved');
                        setTimeout(() => {
                            note.textContent = profileInfo;
                            textarea.remove();
                            note.hidden = false;
                        }, 1000);
                    }).catch((error) => {
                        console.error(error);
                    });
                });

                textarea.addEventListener('focusout', () => {
                    setTimeout(() => {
                        if (textarea) {
                            textarea.remove();
                            note.hidden = false;
                        }
                    }, 1500);
                });

                note.hidden = true;
                li.appendChild(textarea);
                textarea.focus();
            });
            li.appendChild(note);

            const deleteBtn = document.createElement('div');
            deleteBtn.classList.add('delete-icon');
            deleteBtn.classList.add('profiles-list__delete-icon');
            deleteBtn.textContent = '+';
            deleteBtn.title = 'Delete';
            deleteBtn.addEventListener('click', () => {
                browser.runtime.sendMessage({
                    message: 'deleteProfileInfo',
                    payload: profile.id
                }).then(() => {
                    li.remove();
                }).catch((error) => {
                    console.error(error);
                });
            })
            li.appendChild(deleteBtn);

            list.appendChild(li);
        });

        profilesList.appendChild(list);
    }
} catch (error) {
    console.error('Error:', error);
}
