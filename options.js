function saveOptions(e) {
    browser.storage.sync.set({
        serverUrl: document.querySelector("#serverUrl").value
    });
    e.preventDefault();
}

function restoreOptions() {
    browser.storage.sync
        .get('serverUrl')
        .then((results) => {
            document.querySelector("#serverUrl").value = results.serverUrl || 'https://mastodon.social';
        });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
