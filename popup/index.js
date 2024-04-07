const themeDefault = document.getElementById('themeDefault');
const themeDark = document.getElementById('themeDark');
const typosList = document.getElementById('typosList');
const errorMessage = document.getElementById('errorMessage');

browser.runtime.sendMessage({
    message: 'getTheme'
}).then(response => {
    if (response === 'dark') {
        applyDarkTheme();
    } else {
        applyDefaultTheme();
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
    typosList.setAttribute('stroke', '#FFFFFF');
}

function applyDefaultTheme() {
    themeDefault.checked = true;
    document.body.classList.remove('theme_dark');
    typosList.setAttribute('stroke', '#000000');
}
