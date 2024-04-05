const themeDefault = document.getElementById('themeDefault');
const themeDark = document.getElementById('themeDark');
const typosList = document.getElementById('typosList');
const errorMessage = document.getElementById('errorMessage');

browser.tabs.query({
    url: 'https://author.today/*'
}).then((response) => {
    if (response.length) {
        const tabId = response[0].id;
        return browser.tabs.sendMessage(
            tabId,
            {
                message: 'getTheme'
            }
        )
    } else {
        throw browser.i18n.getMessage('noAuthorTodayTabs');
    }
}).then((response) => {
    if (response && response.message === 'dark') {
        setDarkTheme();
    } else {
        setDefaultTheme();
    }
}).catch(error => {
    themeDefault.disabled = true;
    themeDark.disabled = true;
    typosList.classList.remove('cursor');
    console.error('Error:', error);
    errorMessage.textContent = error;
    errorMessage.classList.remove('d-none');
});

themeDefault.addEventListener('click', (event) => {
    setThemeRequest('default');
    setDefaultTheme();
});

themeDark.addEventListener('click', (event) => {
    setThemeRequest('dark');
    setDarkTheme();
});



function setThemeRequest(theme) {
    browser.tabs.query({
        url: 'https://author.today/*'
    }).then((response) => {
        if (response.length) {
            const tabId = response[0].id;
            browser.tabs.sendMessage(
                tabId,
                {
                    message: 'setTheme',
                    value: theme
                }
            )
        } else {
            throw browser.i18n.getMessage('noAuthorTodayTabs');
        }
    }).catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = error;
        errorMessage.classList.remove('d-none');
    });
}

function setDarkTheme() {
    themeDark.checked = true;
    document.body.classList.add('theme_dark');
    typosList.setAttribute('stroke', '#FFFFFF');
}

function setDefaultTheme() {
    themeDefault.checked = true;
    document.body.classList.remove('theme_dark');
    typosList.setAttribute('stroke', '#000000');
}
