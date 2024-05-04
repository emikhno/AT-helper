try {
    const AThelper = window.AThelper;
    const extPrefix = AThelper.prefix;

    let textarea;
    const textareaHint = document.createElement('p');
    textareaHint.textContent = browser.i18n.getMessage('saveText');
    textareaHint.classList.add(`${extPrefix}profile-info-save-btn`)
    textareaHint.hidden = true;

    const profileId = location.pathname.split('/')[2];
    const timerId = setInterval(createTextarea, 100);

    let prevUrl = window.location.href;
    setInterval(() => {
        const currUrl = window.location.href;
        if (currUrl !== prevUrl) {
            prevUrl = currUrl;

            const timerReloadId = setInterval(() => {
                const nprogress = document.getElementById('nprogress');
                if (!nprogress) {
                    clearInterval(timerReloadId);
                    createTextarea();
                }
            }, 1000);
        }
    }, 100);



    function createTextarea() {
        if (document.getElementById('profile-info_textarea')) {
            return;
        }

        const profileInfoWrapper = document.querySelector('.profile-info');
        if (profileInfoWrapper) {
            clearInterval(timerId);

            textarea = document.createElement('textarea');
            textarea.classList.add(`${extPrefix}profile-info`);
            textarea.id = 'profile-info_textarea'
            textarea.rows = 2;
            textarea.cols = 50;
            textarea.placeholder = browser.i18n.getMessage('profileInfoPlaceholder');

            getProfileInfo();
            textarea.addEventListener('input', () => {
                textareaHint.hidden = false;
            });
            textarea.addEventListener('change', setProfileInfo);

            profileInfoWrapper.appendChild(textarea);
            profileInfoWrapper.appendChild(textareaHint);
        }
    }

    function getProfileInfo() {
        browser.runtime.sendMessage({
            message: 'getProfileInfo',
            payload: profileId
        }).then(response => {
            if (response) {
                textarea.value = response;
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    function setProfileInfo(event) {
        const profileInfo = event.target.value;
        const profileName = document.querySelector('.profile-name a');
        browser.runtime.sendMessage({
            message: 'setProfileInfo',
            payload: {
                id: profileId,
                info: profileInfo,
                name: profileName ? profileName.textContent : null
            }
        }).then(() => {
            textareaHint.hidden = true;
            textarea.classList.add(`${extPrefix}profile-info_saved`);
            setTimeout(() => {
                textarea.classList.remove(`${extPrefix}profile-info_saved`);
            }, 1000);
        }).catch((error) => {
            console.error(error);
        });
    }
} catch (error) {
    console.error('Error:', error);
}
