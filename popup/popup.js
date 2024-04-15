try {
    const themeDefault = document.getElementById('themeDefault');
    const themeDark = document.getElementById('themeDark');
    const optionsLink = document.getElementById('optionsLink');
    const optionsLinkIcon = document.getElementById('optionsLinkIcon');
    const errorMessage = document.getElementById('errorMessage');

    const uiLanguage = browser.i18n.getUILanguage();
    if (['en-US', 'en-GB', 'en-CA'].includes(uiLanguage)) {
        document.getElementById('themeTitle').textContent = 'Theme: ';
        document.getElementById('themeLightText').textContent = 'Light';
        document.getElementById('themeDarkText').textContent = 'Dark';
        document.getElementById('optionsLinkTitle').textContent = 'Options';
        optionsLink.title = 'Options and saving data';
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

    themeDefault.addEventListener('click', () => {
        setThemeRequest('default');
        applyDefaultTheme();
    });

    themeDark.addEventListener('click', () => {
        setThemeRequest('dark');
        applyDarkTheme();
    });

    optionsLink.addEventListener('click', () => {
        browser.runtime.openOptionsPage();
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
        optionsLinkIcon.setAttribute('stroke', '#FFFFFF');
    }

    function applyDefaultTheme() {
        themeDefault.checked = true;
        document.body.classList.remove('theme_dark');
        optionsLinkIcon.setAttribute('stroke', '#000000');
    }
} catch (error) {
    console.error('Error:', error);
}
