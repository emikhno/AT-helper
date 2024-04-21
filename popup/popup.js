try {
    const themeDefault = document.getElementById('theme-default');
    const themeDark = document.getElementById('theme-dark');
    const optionsLink = document.getElementById('options-link');
    const optionsLinkIcon = document.getElementById('options-link-icon');
    const exportBtn = document.getElementById('btn-export');
    const errorMessage = document.getElementById('error-message');

    const uiLanguage = browser.i18n.getUILanguage();
    if (['en-US', 'en-GB', 'en-CA'].includes(uiLanguage)) {
        document.getElementById('theme-title').textContent = 'Theme: ';
        document.getElementById('theme-light-text').textContent = 'Light';
        document.getElementById('theme-dark-text').textContent = 'Dark';
        document.getElementById('options-link-title').textContent = 'Options';
        document.getElementById('theme-dark-text').textContent = 'Dark';
        exportBtn.textContent = 'Export Database';
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
