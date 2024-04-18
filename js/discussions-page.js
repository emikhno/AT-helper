try {
    const AThelper = window.AThelper;
    const extPrefix = AThelper.prefix;

    const topicMap = new Map();
    topicMap.set('/discussions/blog/personal', 'Личное');
    topicMap.set('/discussions/blog/self-pr', 'Самопиар');
    topicMap.set('/discussions/blog/off-topic', 'Оффтопик');
    topicMap.set('/discussions/blog/notes', 'Заметки на полях');
    topicMap.set('/discussions/blog/flash_mobs-holidays', 'Флешмобы и праздники');
    topicMap.set('/discussions/blog/critique', 'Отзывы и критика');
    topicMap.set('/discussions/blog/articles', 'Статьи');
    topicMap.set('/discussions/blog/contests', 'Конкурсы, марафоны, игры');
    topicMap.set('/discussions/blog/services', 'Предлагаю услуги');
    topicMap.set('/discussions/blog/promocodes', 'Промокоды и розыгрыши');

    let prevUrl = window.location.href;
    setInterval(() => {
        const currUrl = window.location.href;
        if (currUrl !== prevUrl) {
            prevUrl = currUrl;
            const timerId = setInterval(() => {
                const nprogress = document.getElementById('nprogress');
                if (!nprogress) {
                    clearInterval(timerId);
                    createTopicFilter(topicFilter);
                    applyBlogTopicFilter(topicFilter);
                }
            }, 1000);
        }
    }, 100);

    let topicFilter = [];
    browser.runtime.sendMessage({
        message: 'getBlogTopicFilter'
    }).then(response => {
        topicFilter = response ?? [];
        createTopicFilter(topicFilter);
        applyBlogTopicFilter(topicFilter);
    }).catch((error) => {
        console.error(error);
    });



    function createTopicFilter(topicFilter) {
        const panelHeader = document.querySelector('ul.nav-pills');

        const topicFilterWrapper = document.createElement('li');
        topicFilterWrapper.classList.add(`${extPrefix}pa-7px`);

        const topicFilterSelector = createTopicSelector(topicFilter);
        topicFilterWrapper.appendChild(topicFilterSelector);

        panelHeader.appendChild(topicFilterWrapper);
    }

    function createTopicSelector(topicFilter) {
        const selector = document.createElement('select');
        selector.multiple = true;
        selector.size = 1;
        selector.classList.add('form-control');
        selector.style.maxWidth = '190px';
        selector.style.height = 'auto';

        const option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.textContent = browser.i18n.getMessage('hideTopicsText');
        selector.appendChild(option);

        for (let topic of topicMap) {
            const option = document.createElement('option');
            option.value = topic[0];
            option.textContent = topic[1];
            if (topicFilter.includes(topic[0])) {
                option.selected = true;
            }
            selector.appendChild(option);
        }

        const firstOption = selector.querySelector('option:first-child');
        selector.addEventListener('focusin', () => {
            selector.size = 6;
            firstOption.textContent = browser.i18n.getMessage('clearText');
            firstOption.disabled = false;
        });

        selector.addEventListener('focusout', () => {
            selector.size = 1;
            firstOption.textContent = browser.i18n.getMessage('hideTopicsText');
            firstOption.disabled = true;
        });

        selector.addEventListener('change', (event) => {
            const options = selector.querySelectorAll('option');
            if (!event.target.value) {
                for (let i = 0; i < options.length; i++) {
                    options[i].selected = false;
                }
            }

            topicFilter = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    topicFilter.push(options[i].value);
                }
            }

            browser.runtime.sendMessage({
                message: 'setBlogTopicFilter',
                payload: topicFilter
            }).then(response => {
                applyBlogTopicFilter(topicFilter);
            }).catch((error) => {
                console.error(error);
            });
        });

        return selector;
    }

    function applyBlogTopicFilter(topicFilter) {
        const searchResults = document.querySelectorAll('#search-results article');
        if (!searchResults) {
            return;
        }

        for (let i = 0; i < searchResults.length; i++) {
            const postCategory = searchResults[i].querySelector('.post-category a');
            searchResults[i].hidden = topicFilter.includes(postCategory.pathname);
        }
    }
} catch (error) {
    console.error('Error:', error);
}
